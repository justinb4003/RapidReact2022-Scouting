import os
import pandas as pd

from azure.cosmos import CosmosClient


def get_container():
    endpoint = os.environ.get('COSMOS_ENDPOINT')
    key = os.environ.get('COSMOS_KEY')
    # Some hard-coded values for our datbase name and container for match results
    db_name = 'ScoutingData'
    container_name = 'MatchResults'
    client = CosmosClient(endpoint, key)
    db = client.get_database_client(db_name)
    container = db.get_container_client(container_name)
    return container


def get_scouting_data(secret_team_key=None, event_key=None):
    container = get_container()
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
    return df
