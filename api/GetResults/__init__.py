import os
import json
import logging
import azure.functions as func
import pandas as pd

from ..ar_utils import *

def main(req: func.HttpRequest) -> func.HttpResponse:
    df = get_scouting_data()
    json_obj = df.to_json(orient='records')
    return func.HttpResponse(
        json_obj,
        status_code=200
    )
