import os
import json
import logging
import azure.functions as func
import pandas as pd

from ..ar_utils import *

def main(req: func.HttpRequest) -> func.HttpResponse:
    secret_team_key = req.params.get('secret_team_key')
    event_key = req.params.get('event_key')
    df = get_scouting_data(secret_team_key=secret_team_key, event_key=event_key)
    json_obj = df.to_json(orient='records')
    return func.HttpResponse(
        json_obj,
        status_code=200
    )
