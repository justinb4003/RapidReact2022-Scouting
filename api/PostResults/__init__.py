import os
import json
import logging
import azure.functions as func

from azure.cosmos import CosmosClient


def main(req: func.HttpRequest) -> func.HttpResponse:
    # Get the request body, interpreted as JSON into an python object
    payload = req.get_json()
    # Grab the username and password from environment variables
    endpoint = os.environ.get('COSMOS_ENDPOINT')
    key = os.environ.get('COSMOS_KEY')
    # Some hard-coded values for our datbase name and container for match results
    db_name = 'ScoutingData'
    container_name = 'MatchResults'
    client = CosmosClient(endpoint, key)
    db = client.get_database_client(db_name)
    container = db.get_container_client(container_name)
    # Now that we have a connection to the container we can insert/update the data
    container.upsert_item(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )
