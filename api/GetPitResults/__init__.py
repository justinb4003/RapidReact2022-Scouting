import os
import json
import logging
import azure.functions as func
import pandas as pd

from ..ar_utils import *

def main(req: func.HttpRequest) -> func.HttpResponse:
    secret_team_key = req.params.get('secret_team_key')
    team_key = req.params.get('team_key')
    event_key = req.params.get('event_key')
    print(f'Secret team key: {secret_team_key}')
    print(f'Team key: {team_key}')
    print(f'Event key: {event_key}')
    df = get_pit_data(secret_team_key='', event_key=event_key, team_key=team_key)
    if df is not None:
        json_obj = df.to_json(orient='records')
    else:
        json_obj = json.dumps([])
    return func.HttpResponse(
        json_obj,
        status_code=200
    )
