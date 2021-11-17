from unittest.mock import patch, Mock
from requests.models import Response

from services.conversion_service import ConversionService

conversion_client = ConversionService()


@patch('requests.get')
def test_get_exchange_rate(mock_get):
    """
    Get exchange rate should return rate from upstream api and save it in cache
    """
    mocked_response = Mock(spec=Response)
    mocked_response.json.return_value = {'data': {'TO': 1.25}}
    mocked_response.status_code = 200
    mock_get.return_value = mocked_response
    assert conversion_client.get_exchange_rate('FROM', 'TO') == 1.25
    assert conversion_client.cache.get('FROMTO') == 1.25

@patch('requests.get')
def test_get_exchange_rate_error_cache(mock_get):
    """
    In case of upstream api failure, conversion api should return rate if 
    found in cache
    """
    mocked_response = Mock(spec=Response)
    mocked_response.status_code = 503
    mock_get.return_value = mocked_response
    assert conversion_client.get_exchange_rate('FROM', 'TO') == 1.25

@patch('requests.get')
def test_get_exchange_rate_error_cache_reverse(mock_get):
    """
    In case of upstream api failure, conversion api should return adjusted rate 
    if key `FROMTO` not in cache but revrese currency key `TOFROM` is in cache
    """
    mocked_response = Mock(spec=Response)
    mocked_response.status_code = 503
    mock_get.return_value = mocked_response
    assert conversion_client.get_exchange_rate('TO', 'FROM') == 1 / 1.25

@patch('requests.get')
def test_get_exchange_rate_error_no_cache(mock_get):
    """
    In case of upstream api failure, conversion api should return None if rate
    not found in cache
    """
    mocked_response = Mock(spec=Response)
    mocked_response.status_code = 503
    mock_get.return_value = mocked_response
    assert conversion_client.get_exchange_rate('FROM', 'OTHER') == None
