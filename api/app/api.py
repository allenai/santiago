import json

from flask import Flask, Blueprint, jsonify, request, current_app
from random import randint
from time import sleep
import requests

def create_api() -> Blueprint:
    """
    Creates an instance of your API. If you'd like to toggle behavior based on
    command line flags or other inputs, add them as arguments to this function.
    """
    api = Blueprint('api', __name__)

    def error(message: str, status: int = 400) -> (str, int):
        return jsonify({ 'error': message}), status

    # This route simply tells anything that depends on the API that it's
    # working. If you'd like to redefine this behavior that's ok, just
    # make sure a 200 is returned.
    @api.route('/')
    def index() -> (str, int):
        return '', 204

    @api.route('/papers/search', methods=['GET'])
    def search_papers():
        queryText = request.args.get('q')
        query = {
            "query": {
                "simple_query_string": {
                    "query": queryText,
                    "fields": [
                        "metadata.title^4",
                        "abstract.text^3",
                        "body.text^2",
                        "authors.first",
                        "authors.middle",
                        "authors.last"
                    ]
                }
            }
        }
        url = "https://search-magellan-public-dev-pwta5a6pazn5d77gdrgqqzaeda.us-west-2.es.amazonaws.com/paper_v1/_search"
        req = requests.Request(
                'GET',
                url,
                data=json.dumps(query),
                headers={ "Content-Type": "application/json" }
              ).prepare()
        s = requests.Session()
        resp = s.send(req)
        status = resp.status_code
        data = resp.json()
        return jsonify(data), resp.status_code

    return api
