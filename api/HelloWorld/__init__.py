import json
import logging
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    data = { 'message': 'Hello World!' }
    return func.HttpResponse(json.dumps(data), status_code=200)
