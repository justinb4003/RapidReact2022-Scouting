
import os
import json
import base64
import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContentSettings, ContainerClient, __version__
from azure.cosmos import CosmosClient
from uuid import uuid4

from ..ar_utils import *


def main(req: func.HttpRequest) -> func.HttpResponse:
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
        ret = blob_client.upload_blob(data=filedata, content_settings=ContentSettings(content_type=mimetype))
        payload['image_names'].append(filename)
    del payload['images']
    container = get_container('PitResults') 
    # Now that we have a connection to the container we can insert/update the data
    container.upsert_item(payload)
    return func.HttpResponse(
            json.dumps(payload),
            status_code=200
    )
