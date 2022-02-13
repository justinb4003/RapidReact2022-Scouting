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


def get_scouting_data():
    container = get_container()
    query = "SELECT * FROM c"
    items = container.query_items(query=query, enable_cross_partition_query=True)
    # Now we make a Panads dataframe out of our query results
    df = pd.DataFrame(items)
    df = df[df.columns.drop(list(df.filter(regex='^_')))]
    df = df.drop(columns=['id'])
    return df
