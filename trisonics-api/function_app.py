import os
import io
import json
import base64
import math
import logging
import requests
import datetime
import numpy as np
import pandas as pd
import azure.functions as func

from azure.storage.blob import BlobClient, ContentSettings
from azure.cosmos import CosmosClient
from uuid import uuid4

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello") # HTTP Trigger
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("HttpTrigger1 function processed a request!!!")


@app.function_name(name="GetOPRData")
@app.route(route="GetOPRData")
def get_opr_data(req: func.HttpRequest) -> func.HttpResponse:
    event_key = req.params.get('event_key')
    df = http_get_opr_data(event_key)
    json_obj = df.to_json(orient='records')
    return func.HttpResponse(
        json_obj,
        status_code=200
    )


@app.function_name(name="GetPitResults")
@app.route(route="GetPitResults")
def get_pit_results(req: func.HttpRequest) -> func.HttpResponse:
    secret_team_key = req.params.get('secret_team_key')
    team_key = req.params.get('team_key')
    event_key = req.params.get('event_key')
    print(f'Secret team key: {secret_team_key}')
    print(f'Team key: {team_key}')
    print(f'Event key: {event_key}')
    logging.error('getting pit data now')
    df = get_pit_data(secret_team_key='', event_key=event_key,
                      team_key=team_key)
    if df is not None:
        json_obj = df.to_json(orient='records')
    else:
        json_obj = json.dumps([])
    return func.HttpResponse(
        json_obj,
        status_code=200
    )


@app.function_name(name="GetResults")
@app.route(route="GetResults")
def get_results(req: func.HttpRequest) -> func.HttpResponse:
    secret_team_key = req.params.get('secret_team_key')
    event_key = req.params.get('event_key')
    df = get_scouting_data(secret_team_key=secret_team_key,
                           event_key=event_key)
    json_obj = df.to_json(orient='records')
    return func.HttpResponse(
        json_obj,
        status_code=200
    )


@app.function_name(name="GetTeamsForEvent")
@app.route(route="GetTeamsForEvent")
def get_teams_for_event(req: func.HttpRequest) -> func.HttpResponse:
    event_key = req.params.get('event_key')
    df = get_event_teams_df(event_key)
    df.sort_values(by=['team_number'], inplace=True, ascending=True)
    ret = []
    for idx, row in df.iterrows():
        ret.append({
            'number': row['team_number'],
            'name': row['nickname'],
            'locaton': row['school_name']
        })
    json_obj = json.dumps(ret)
    return func.HttpResponse(
        json_obj,
        status_code=200
    )


@app.function_name(name="GetTimeEntries")
@app.route(route="GetTimeEntries")
def get_time_entries(req: func.HttpRequest) -> func.HttpResponse:
    secret_team_key = req.params.get('secret_team_key')
    account_name = req.params.get('account_name')
    print(f'Secret team key: {secret_team_key}')
    print(f'Account name: {account_name}')
    ret = cosmos_get_time_entries(secret_team_key=secret_team_key,
                                  account_name=account_name)
    return func.HttpResponse(
        json.dumps(ret),
        status_code=200
    )


@app.function_name(name="PostPitResults")
@app.route(route="PostPitResults")
def post_pit_results(req: func.HttpRequest) -> func.HttpResponse:
    # Get the request body, interpreted as JSON into an python object
    payload = req.get_json()
    blob_conn = os.environ.get('BLOB_CONN')
    # Get image data from payload
    payload['image_names'] = []
    for i in payload['images']:
        header, b64data = i.split(',', 2)
        _, encoding = header.split(':', 2)
        mimetype, algo = encoding.split(';')
        filetype, fileext = mimetype.split('/', 2)
        filedata = base64.b64decode(b64data)
        logging.info(fileext)
        # upload to blob storage
        logging.info(blob_conn)
        filename = f'{uuid4()}.{fileext}'
        blob_client = BlobClient.from_connection_string(
            conn_str=blob_conn,
            container_name='images',
            blob_name=filename,
        )
        blob_client.upload_blob(
            data=filedata,
            content_settings=ContentSettings(content_type=mimetype)
        )
        payload['image_names'].append(filename)
    del payload['images']
    container = get_container('PitResults')
    # Now that we have a connection to the container we can insert/update data
    container.upsert_item(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )


@app.function_name(name="PostResults")
@app.route(route="PostResults")
def post_results(req: func.HttpRequest) -> func.HttpResponse:
    # Get the request body, interpreted as JSON into an python object
    payload = req.get_json()
    container = get_container('MatchResults')
    # Now that we have a connection to the container we can insert/update data
    container.upsert_item(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )


@app.function_name(name="PostTimeEntry")
@app.route(route="PostTimeEntry")
def post_time_entry(req: func.HttpRequest) -> func.HttpResponse:
    # Get the request body, interpreted as JSON into an python object
    payload = req.get_json()
    container = get_container('TimeTracking')
    # Now that we have a connection to the container we can insert/update data
    container.upsert_item(payload)
    logging.error(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )


@app.function_name(name="RebuildData")
@app.schedule(schedule="0 */1 * * * *", arg_name="req",
              run_on_startup=True, use_monitor=False)
def rebuild_data(req: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if req.past_due:
        logging.info('The timer is past due!')

    logging.error('Python timer trigger function ran at %s', utc_timestamp)


def get_tba_url_as_df(url):
    """
    Retrieves a URL from The Blue Alliance and converts it to a dataframe
    """
    tba = 'https://www.thebluealliance.com/api/v3'
    # We must specify this extra HTTP header so TBA knows what account is
    # accessing the data.
    key = os.environ.get('TBA_KEY')
    headers = {'X-TBA-Auth-Key': key}
    full_url = f'{tba}{url}'
    # Uncomment this to see the URL you'r trying to contact.  Sometimes a
    # mistake like having two slashes (//) instead of one (/) means the server
    # can't process your request.
    # print(f'Retrieving {full_url}')
    r = requests.get(full_url, headers=headers)
    json_data = r.text
    df = pd.read_json(io.StringIO(json_data))
    return df


def get_teams_df(year):
    """
    Repeatedly calls the teams/<year>/X URL to build a complete dataframe with
    all FRC team data that TBA has

    Parameters:
    -----------
        year: str
            Year to locate active teams
    Returns:
    --------
    DataFrame
        DataFrame will contain every team found for the given year
    """
    # Initiailize our dataframe object to a simple None value, which means
    # nothing, null, zero, blank, something akin to that.
    teams_df = None

    # We keep a running count of how many teams we've discovered to determine
    # when we should stop.
    full_team_count = 0
    last_team_count = 0
    # We'll hard-code a maximum of 25 pages of results that we will look at.
    # That sets the upper team number limit at 25 * 500 = 12,500.
    # We're safe for now.
    for page_index in range(25):
        partial_df = get_tba_url_as_df(f'/teams/{year}/{page_index}')

        # If teams_df is still None that means this is our first pass through
        # the data and we'll use our partial dataframe of data to initialize
        # the final one
        if teams_df is None:
            teams_df = partial_df
        # Else, if it wasn't the first time through, we have the final
        # dataframe already started, so we need to append() the partial one
        # to the largert one
        else:
            teams_df = teams_df.append(partial_df)

        # Now we take a count of how many teams we've found so far.
        # It's a little odd, because we're useing teams_df.index which
        # returns and index number for each row of data, then taking the
        # length/len() of that to get the total count.
        full_team_count = len(teams_df.index)

        # If we've still got the seame number of teams that we had on the
        # last run through this loop then we must be done.
        if full_team_count != last_team_count:
            last_team_count = full_team_count
        else:
            break
    return teams_df


def get_team_events_df(team_key, year):
    """
    Parameters:
    -----------
        team_key: str
            TBA key for a team. Example: 'frc4003'
        year: str
            Year of events we're looking for
    Returns:
    --------
    DataFrame
        DataFrame contains information on every event a team participated in
        for the given year.
    """
    df = get_tba_url_as_df(f'/team/{team_key}/events/{year}')
    return df


def get_event_df(event_key):
    """
    Parameters:
    -----------
        team_key: str
            TBA key for a team. Example: 'frc4003'
        year: str
            Year of events we're looking for
    Returns:
    --------
    DataFrame
        DataFrame contains information on every event a team participated in
        for the given year.
    """
    df = get_tba_url_as_df(f'/event/{event_key}/simple')
    return df


def get_event_matches_df(event_key):
    """
    Parameters:
    -----------
        event_key: str
            TBA key for an event. Example: '2020misjo'
    Returns:
    --------
    DataFrame
        DataFrame contains information on every match for the given event key.
    """
    df = get_tba_url_as_df(f'/event/{event_key}/matches')
    return df


def get_events_df(year):
    """
    Parameters:
    -----------
        year: str
            Year of events we're looking for
    Returns:
    --------
    DataFrame
        DataFrame contains information on every event in a year.
    """
    df = get_tba_url_as_df(f'/events/{year}')
    return df


def get_event_teams_df(event_key):
    """
    Parameters:
    -----------
        team_key: str
            TBA key for a team. Example: 'frc4003'
        year: str
            Year of events we're looking for
    Returns:
    --------
    DataFrame
        DataFrame contains information on every event a team participated in
        for the given year.
    """
    df = get_tba_url_as_df(f'/event/{event_key}/teams')
    return df


def get_container(container_name='MatchResults'):
    endpoint = os.environ.get('COSMOS_ENDPOINT')
    key = os.environ.get('COSMOS_KEY')
    # Some hard-coded values for our datbase name and container for match
    # results
    db_name = 'ScoutingData'
    client = CosmosClient(endpoint, key)
    db = client.get_database_client(db_name)
    container = db.get_container_client(container_name)
    return container


def get_scouting_data(secret_team_key=None, event_key=None):
    container = get_container('MatchResults')
    query = "SELECT * FROM c WHERE 1=1 "
    params = [
    ]
    if (secret_team_key is not None):
        query += "AND TRIM(LOWER(c.secret_team_key)) = TRIM(LOWER(@secret_team_key)) "  # noqa
        params.append({'name': '@secret_team_key', 'value': secret_team_key})
    if (event_key is not None):
        query += "AND c.event_key = @event_key "
        params.append({'name': '@event_key', 'value': event_key})

    items = container.query_items(query=query, parameters=params,
                                  enable_cross_partition_query=True)
    # Now we make a Panads dataframe out of our query results
    df = pd.DataFrame(items)
    df = df[df.columns.drop(list(df.filter(regex='^_')))]
    df = df.drop(columns=['id'])
    df["auton_tarmac"] = df["auton_tarmac"].astype(int)
    df.drop_duplicates(inplace=True, ignore_index=True, keep='last')
    return df


def cosmos_get_time_entries(secret_team_key=None, account_name=None):
    container = get_container('TimeTracking')
    query = "SELECT * FROM c WHERE 1=1 "
    params = [
    ]
    query += "AND c.secret_team_key = @secret_team_key "
    params.append({'name': '@secret_team_key', 'value': secret_team_key})
    query += "AND c.account_name = @account_name "
    params.append({'name': '@account_name', 'value': account_name})
    print(query)
    print(params)
    items = container.query_items(query=query, parameters=params,
                                  enable_cross_partition_query=True)

    return list(items)


def get_pit_data(secret_team_key=None, event_key=None, team_key=None):
    container = get_container('PitResults')
    query = "SELECT * FROM c WHERE 1=1 "
    params = [
    ]
    """
    if (secret_team_key is not None):
        query += "AND c.secret_team_key = @secret_team_key "
        params.append({'name': '@secret_team_key', 'value': secret_team_key})
    """
    if (event_key is not None):
        query += "AND c.event_key = @event_key "
        params.append({'name': '@event_key', 'value': event_key})
    if (team_key is not None):
        query += "AND c.scouting_team = @team_key "
        params.append({'name': '@team_key', 'value': int(team_key)})

    print(query)
    print(params)
    items = container.query_items(query=query, parameters=params,
                                  enable_cross_partition_query=True)

    results = []
    for item in items:
        newitem = dict(item)
        if 'image_names' in newitem:
            newimages = []
            for image in newitem['image_names']:
                newurl = f'{os.environ.get("BLOB_PUB_URL")}/{image}'
                print(newurl)
                newimages.append(newurl)
            newitem['image_names'] = newimages
        results.append(newitem)
        print(json.dumps(dict(newitem), sort_keys=True, indent=4))
    df = pd.DataFrame(results)
    df = df[df.columns.drop(list(df.filter(regex='^_')))]
    if df.empty:
        return None
    df = df.drop(columns=['id'])
    # df.drop_duplicates(inplace=True, ignore_index=True, keep='last')
    return df


def http_get_opr_data(event_code):
    event_teams = get_event_teams_df(event_code)['key']
    team_dict = {key: int(key[3:]) for key in event_teams}

    # Now get the qualification matches

    matches = get_event_matches_df(event_code)
    quals = matches[matches['comp_level'] == 'qm']
    quals = quals.dropna(axis='index', subset=['score_breakdown'])

    # dictionary to keep track of who played in a match
    # had to be modified so we could work with events where not
    # every team showed up.

    teams_in_match = []
    for i, r in quals.iterrows():
        blue_teams = r['alliances']['blue']['team_keys']
        red_teams = r['alliances']['red']['team_keys']
        teams_in_match += blue_teams + red_teams

    event_teams = list(set(teams_in_match))
    teams_in_match = {team: 0 for team in event_teams}

    # build lookup df for each team's matches in order
    team_match_numbers = {
        'match_num': [],
        'team_key': []
    }
    for match, row in quals.iterrows():
        for color in ['blue', 'red']:
            alliance = row['alliances'][color]
            teams = alliance['surrogate_team_keys'] + alliance['team_keys']
            for t in teams:
                mn = row['match_number']
                team_match_numbers['match_num'].append(mn)
                team_match_numbers['team_key'].append(t)
    tmn_df = pd.DataFrame.from_dict(team_match_numbers)
    tmn_df['match_of_tournament'] = (
        tmn_df.sort_values(by='match_num')
              .groupby('team_key')
              .cumcount()+1
    )

    # compute oprs

    team_matrix = []
    score_matrix = []
    for match, row in quals.iterrows():
        for color in ['blue', 'red']:
            alliance = row['alliances'][color]
            teams = alliance['surrogate_team_keys'] + alliance['team_keys']
            team_matrix_row = teams_in_match.copy()
            for team in teams:
                mot = tmn_df.loc[(tmn_df['team_key'] == team) & (tmn_df['match_num'] == row['match_number']), 'match_of_tournament'].values[0]  # noqa
                # Use tanh to make the 12th match more important than the 1st,
                # emphasis on later matches
                team_matrix_row[team] = math.tanh(mot)
            team_matrix.append(team_matrix_row)

            scores = row['score_breakdown'][color]
            score_matrix.append(scores)

    team_df = pd.DataFrame(team_matrix)
    score_df = pd.DataFrame(score_matrix)
    score_df = score_df.select_dtypes(np.number)

    Q, R = np.linalg.qr(team_df)
    oprs = np.linalg.inv(R) @ Q.T @ score_df
    oprs.index = [team_dict[team] for team in event_teams]
    oprs = oprs.sort_index()
    oprs['teamNumber'] = oprs.index
    oprs.sort_values(by=['totalPoints'], inplace=True, ascending=False)
    return oprs
