
import os
import json
import base64
import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__

from azure.cosmos import CosmosClient

from ..ar_utils import *


def main(req: func.HttpRequest) -> func.HttpResponse:
    # Get the request body, interpreted as JSON into an python object
    payload = req.get_json()
    blob_conn = os.environ.get('BLOB_CONN')
    # Get image data from payload
    for i in payload['images']:
        header, b64data = i.split(',', 2)
        _, encoding = header.split(':', 2)
        mimetype, algo = encoding.split(';')
        filetype, fileext = mimetype.split('/', 2) 
        filedata = base64.b64decode(b64data)
        logging.info(fileext)
        # upload to blob storage
        blob_client = BlobServiceClient.from_connection_string(blob_conn)
        # use return URL to place into payload
        # delete the image data key from payload
        # container = get_container('PitResults') 
        # Now that we have a connection to the container we can insert/update the data
        # container.upsert_item(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )
