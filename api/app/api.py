import json
import requests
import os

from flask import Flask, Blueprint, jsonify, request, current_app, Response
from random import randint
from time import sleep
from dataclasses import dataclass, asdict
from requests_aws4auth import AWS4Auth
from typing import Optional

@dataclass
class ClusterConfig:
    host: str
    secure: bool = False
    auth_type: Optional[str] = None
    port: Optional[str] = None

    @property
    def origin(self):
        proto = 'https' if self.secure else 'http'
        origin = f'{proto}://{self.host}'
        if self.port is not None:
            origin += f':{self.port}'
        return origin

    def auth(self) -> Optional[AWS4Auth]:
        if self.auth_type == 'aws':
            creds_path = os.getenv('SANTIAGO_ES_CREDS_PATH', '/secrets/escreds.json')
            with open(creds_path, 'r') as fh:
                creds = json.load(fh)
            return AWS4Auth(creds['access_key'], creds['secret_key'], creds['region'], 'es')
        else:
            return None

    @staticmethod
    def load_from_env() -> 'ClusterConfig':
        config_path = os.getenv('SANTIAGO_CLUSTER_CONFIG_PATH', '/config/cluster.json')
        with open(config_path, 'r') as fh:
            config = json.load(fh)
        return ClusterConfig(**config)

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

    papers_index = 'paper_v1'
    meta_index = 'metadata_v1';

    @api.route('/paper/search')
    def search_papers():
        queryText = request.args.get('q')
        try:
            offset = int(request.args.get('o', '0'))
        except ValueError as err:
            return jsonify({ 'error': 'Invalid offset' }), 400
        try:
            size = int(request.args.get('sz', '10'))
        except ValueError as err:
            return jsonify({ 'error': 'Invalid size' }), 400
        if size > 40:
            return jsonify({ 'error': 'Page size cannot be above 40' }), 400
        query = {
            'from': offset,
            'size': size,
            'query': {
                'simple_query_string': {
                    'query': queryText,
                    'all_fields': True
                }
            }
        }
        cluster = ClusterConfig.load_from_env()
        resp = requests.get(
            f'{cluster.origin}/{papers_index}/_search',
            data=json.dumps(query),
            auth=cluster.auth(),
            headers = {
                'Content-Type': 'application/json'
            }
        )
        # TODO: It's unecessary to deserialize and then reserialize the data, but we do it
        # since jsonify takes care of some of the headers we'd need to set othewrise. We should
        # write a helper that gets rid of the unecessary work and use it for all endpoints
        # that are more or less ES proxies.
        return jsonify(resp.json()), resp.status_code

    @api.route('/paper/<string:id>')
    def get_paper(id: str):
        cluster = ClusterConfig.load_from_env()
        resp = requests.get(f'{cluster.origin}/{papers_index}/_doc/{id}', auth=cluster.auth())
        if request.args.get('download', None) is not None:
            doc = resp.json()
            return Response(json.dumps(doc['_source']), mimetype='application/json', headers={
                'Content-Disposition': f'attachment; filename={id}.json'
            })
        else:
            return jsonify(resp.json()), resp.status_code

    @api.route('/paper/<string:id>/meta')
    def get_paper_metadata(id: str):
        query = {
            'query': {
                'term': {
                    'paper_ids': {
                        'value': id
                    }
                }
            }
        }
        cluster = ClusterConfig.load_from_env()
        resp = requests.get(
            f'{cluster.origin}/{meta_index}/_search',
            data=json.dumps(query),
            auth=cluster.auth(),
            headers = {
                'Content-Type': 'application/json'
            }
        )
        return jsonify(resp.json()), resp.status_code

    @api.route('/papers')
    def get_papers():
        ids = [ id for id in request.args.get('ids', '').split(',') if id.strip() != '' ]
        num_ids = len(ids)
        # We set a cap as to how many can be requested to prevent people from doing crazy
        # things. We could increase this, as it's somewhat arbitrary. ES won't let it go
        # above 10000, I think.
        max_ids = 100
        if num_ids > max_ids:
            return jsonify({ 'error': 'You can only specify up to 100 ids'}), 400
        if num_ids == 0:
            return jsonify([])
        papers = []
        cluster = ClusterConfig.load_from_env()
        query = {
            'query': {
                'terms': {
                    'paper_id': ids
                }
            },
            'size': max_ids,
            '_source': ['paper_id', 'metadata.authors', 'metadata.title', 'abstract.text' ]
        }
        resp = requests.get(
            f'{cluster.origin}/{papers_index}/_search',
            data=json.dumps(query),
            auth=cluster.auth(),
            headers = {
                'Content-Type': 'application/json'
            }
        )
        papers = [ doc['_source'] for doc in resp.json().get('hits', {}).get('hits', []) ]
        return jsonify(papers), resp.status_code

    @api.route('/meta/search')
    def search_meta():
        queryText = request.args.get('q')
        try:
            offset = int(request.args.get('o', '0'))
        except ValueError as err:
            return jsonify({ 'error': 'Invalid offset' }), 400
        try:
            size = int(request.args.get('sz', '10'))
        except ValueError as err:
            return jsonify({ 'error': 'Invalid size' }), 400
        if size > 40:
            return jsonify({ 'error': 'Page size cannot be above 40' }), 400
        query = {
            'from': offset,
            'size': size,
            'query': {
                'simple_query_string': {
                    'query': queryText,
                    'all_fields': True
                }
            }
        }
        cluster = ClusterConfig.load_from_env()
        resp = requests.get(
            f'{cluster.origin}/{meta_index}/_search',
            data=json.dumps(query),
            auth=cluster.auth(),
            headers = {
                'Content-Type': 'application/json'
            }
        )
        return jsonify(resp.json()), resp.status_code

    @api.route('/meta/<string:id>')
    def get_meta(id: str):
        cluster = ClusterConfig.load_from_env()
        resp = requests.get(f'{cluster.origin}/{meta_index}/_doc/{id}', auth=cluster.auth())
        if request.args.get('download', None) is not None:
            doc = resp.json()
            return Response(json.dumps(doc['_source']), mimetype='application/json', headers={
                'Content-Disposition': f'attachment; filename={id}.json'
            })
        else:
            return jsonify(resp.json()), resp.status_code

    return api
