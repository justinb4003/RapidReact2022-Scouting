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


@app.function_name(name="HelloWorld")
@app.route(route="hello")  # HTTP Trigger
def hello_world(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("HelloWorld function processed a request!!!")