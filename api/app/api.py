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

    cluster_url = 'https://search-magellan-public-dev-pwta5a6pazn5d77gdrgqqzaeda.us-west-2.es.amazonaws.com'
    papers_index = 'paper_v1'

    @api.route('/paper/search')
    def search_papers():
        queryText = request.args.get('q')
        query = {
            'query': {
                'simple_query_string': {
                    'query': queryText,
                    'fields': [
                        'metadata.title^4',
                        'abstract.text^3',
                        'body.text^2',
                        'authors.first',
                        'authors.middle',
                        'authors.last'
                    ]
                }
            }
        }
        resp = requests.get(
            f'{cluster_url}/{papers_index}/_search',
            data=json.dumps(query),
            headers = {
                'Content-Type': 'application/json'
            }
        )
        return jsonify(resp.json()), resp.status_code

    @api.route('/paper/<string:id>')
    def get_paper(id: str):
        resp = requests.get(f'{cluster_url}/{papers_index}/_doc/{id}')
        return jsonify(resp.json()), resp.status_code

    return api
