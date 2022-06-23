import os
import json
import logging
import azure.functions as func
import pandas as pd

from ..ar_utils import *

def main(req: func.HttpRequest) -> func.HttpResponse:
    secret_team_key = req.params.get('secret_team_key')
    account_name = req.params.get('account_name')
    print(f'Secret team key: {secret_team_key}')
    print(f'Account name: {account_name}')
    ret = get_time_entries(secret_team_key=secret_team_key, account_name=account_name)
    return func.HttpResponse(
        json.dumps(ret),
        status_code=200
    )
