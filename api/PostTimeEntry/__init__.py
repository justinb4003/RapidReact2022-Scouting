import os
import json
import logging
import azure.functions as func

from azure.cosmos import CosmosClient

from ..ar_utils import *


def main(req: func.HttpRequest) -> func.HttpResponse:
    # Get the request body, interpreted as JSON into an python object
    payload = req.get_json()
    container = get_container('TimeTracking') 
    # Now that we have a connection to the container we can insert/update the data
    container.upsert_item(payload)
    logging.error(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )
