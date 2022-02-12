import os
import json
import logging
import azure.functions as func
import pandas as pd

from azure.cosmos import CosmosClient

def main(req: func.HttpRequest) -> func.HttpResponse:
    endpoint = os.environ.get('COSMOS_ENDPOINT')
    key = os.environ.get('COSMOS_KEY')
    # Some hard-coded values for our datbase name and container for match results
    db_name = 'ScoutingData'
    container_name = 'MatchResults'
    client = CosmosClient(endpoint, key)
    db = client.get_database_client(db_name)
    container = db.get_container_client(container_name)
    query = "SELECT * FROM c"
    items = container.query_items(query=query, enable_cross_partition_query=True)
    # Now we make a Panads dataframe out of our query results
    df = pd.DataFrame(items)
    df = df[df.columns.drop(list(df.filter(regex='^_')))]
    df = df.drop(columns=['id'])
    html_dump = df.to_html()
    print(html_dump)
    return func.HttpResponse(
        html_dump,
        status_code=200
    )
