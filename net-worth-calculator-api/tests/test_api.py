import pytest, json
from unittest.mock import patch

from config import TestConfig
from app import create_app
from services.file_reader import FileReader

file_reader = FileReader()
file_reader.write_data('data/test_database.json', {'currency': 'USD', 'totalAssets': 0, 'totalLiabilities': 0})


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app(TestConfig)
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            yield testing_client

def test_404(test_client):
    """
    Api should return 404 if hitting a non existing endpoint
    """
    response = test_client.get('/')
    assert response.status_code == 404

def test_get_accounts(test_client):
    """
    Get accounts should successfully return all the accounts data
    """
    response = test_client.get('/accounts')
    expected = {'currency': 'USD', 'totalAssets': 0, 'totalLiabilities': 0}
    assert json.loads(response.get_data(as_text=True)) == expected
    assert response.status_code == 200

def test_update_accounts(test_client):
    """
    Updating an account should update a field and the total of assets or 
    liabilities. It should also return the updated data
    """
    payload = {'chequing': 1000}
    response = test_client.put('/accounts', json=payload)
    expected = {'currency': 'USD', 'totalAssets': 1000, 'totalLiabilities': 0, 'chequing': 1000}
    assert json.loads(response.get_data(as_text=True)) == expected
    assert response.status_code == 200

def test_update_accounts_validation(test_client):
    """
    Updating account should return 400 status code in case of validation error
    """
    payload = {'chequing': '1000'}
    response = test_client.put('/accounts', json=payload)
    assert response.status_code == 400

@patch('services.database.ConversionService.get_exchange_rate')
def test_update_currency(mock_get_exchange_rate, test_client):
    """
    Updating currency should get currency rate from conversion api and return
    updated values adjusted to the rate
    """
    mock_get_exchange_rate.return_value = 1.25
    payload = {'currency': 'CAD'}
    response = test_client.put('/currency', json=payload)
    expected = {'currency': 'CAD', 'totalAssets': 1250, 'totalLiabilities': 0, 'chequing': 1250}
    assert json.loads(response.get_data(as_text=True)) == expected
    assert response.status_code == 200

@patch('services.database.ConversionService.get_exchange_rate')
def test_update_currency_service_unavailable(mock_get_exchange_rate, test_client):
    """
    Updating currency should return 503 status code if its not able to get 
    rate from the upstream api or cache
    """
    mock_get_exchange_rate.return_value = None
    payload = {'currency': 'CAD'}
    response = test_client.put('/currency', json=payload)
    assert response.status_code == 503
