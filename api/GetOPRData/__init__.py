import logging

import azure.functions as func

from ..ar_utils import *

def main(req: func.HttpRequest) -> func.HttpResponse:
    event_key = req.params.get('event_key')
    df = get_opr_data(event_key)
    json_obj = df.to_json(orient='records')
    return func.HttpResponse(
        json_obj,
        status_code=200
    )
