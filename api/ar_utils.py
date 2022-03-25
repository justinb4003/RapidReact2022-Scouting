import os
import io
import json
import requests

import numpy as np
import pandas as pd

from azure.cosmos import CosmosClient


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
  # Uncomment this to see the URL you'r trying to contact.  Sometimes a simple
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
    # That sets the upper team number limit at 25 * 500 = 12,500.  We're safe for now.
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
    # Some hard-coded values for our datbase name and container for match results
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
        query += "AND c.secret_team_key = @secret_team_key " 
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

    df = pd.DataFrame(items)
    df = df[df.columns.drop(list(df.filter(regex='^_')))]
    if df.empty:
        return None
    df = df.drop(columns=['id'])
    # df.drop_duplicates(inplace=True, ignore_index=True, keep='last')
    return df

def get_opr_data(event_code):
    event_teams = get_event_teams_df(event_code)['key']
    team_dict = {key:int(key[3:]) for key in event_teams}

    ## Now get the qualification matches

    matches = get_event_matches_df(event_code)
    quals = matches[matches['comp_level'] == 'qm']
    quals = quals.dropna(axis='index', subset=['score_breakdown'])

    ## dictionary to keep track of who played in a match
    ## had to be modified so we could work with events where not
    ## every team showed up.

    teams_in_match = []
    for i, r in quals.iterrows():
        blue_teams = r['alliances']['blue']['team_keys']
        red_teams = r['alliances']['red']['team_keys']
        teams_in_match += blue_teams + red_teams

    event_teams = list(set(teams_in_match))
    teams_in_match = {team: 0 for team in event_teams}

    ## compute oprs

    team_matrix = []
    score_matrix = []
    for match, row in quals.iterrows():
        for color in ['blue', 'red']:
            alliance = row['alliances'][color]
            teams = alliance['surrogate_team_keys'] + alliance['team_keys']
            team_matrix_row = teams_in_match.copy()
            for team in teams:
                team_matrix_row[team] = 1
            team_matrix.append(team_matrix_row)

            scores = row['score_breakdown'][color]  # Problem here, row['score_breakdown'] is None
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
