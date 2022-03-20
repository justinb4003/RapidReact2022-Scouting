import logging

import azure.functions as func

from ..ar_utils import *

def main(req: func.HttpRequest) -> func.HttpResponse:
    event_key = req.params.get('event_key')
    df = get_event_teams_df(event_key)
    df.sort_values(by=['team_number'], inplace=True, ascending=True)
    ret = []
    for idx, row in df.iterrows():
        ret.append({
            'number': row['team_number'],
            'name': row['nickname'],
            'locaton': row['school_name']
        })
    json_obj = json.dumps(ret) 
    return func.HttpResponse(
        json_obj,
        status_code=200
    )

