from flask import Blueprint, request, jsonify, current_app
from flask_expects_json import expects_json

from api.schemas import update_accounts_schema, update_currency_schema
from utils.exceptions import ServiceUnavailableError

api = Blueprint('api', __name__)

@api.errorhandler(ServiceUnavailableError)
def handle_exception(err):
    response = {"error": err.description}
    return jsonify(response), err.code

@api.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    header['Access-Control-Allow-Methods'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    return response

@api.route('/accounts', methods=['GET'])
def get_accounts():
    return jsonify(current_app.db.get_data()), 200

@api.route('/accounts', methods=['PUT'])
@expects_json(update_accounts_schema)
def update_accounts():
    current_app.db.update_accounts(request.json)
    return jsonify(current_app.db.get_data()), 200

@api.route('/currency', methods=['PUT'])
@expects_json(update_currency_schema)
def update_currency():
    current_app.db.update_currency(request.json['currency'])
    return jsonify(current_app.db.get_data()), 200
