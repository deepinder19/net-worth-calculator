import requests

from services.cache import Cache
from config import Config


class ConversionService:
    def __init__(self):
        self.cache = Cache()

    def get_exchange_rate(self, from_currency, to_currency):
        URL = f'https://freecurrencyapi.net/api/v2/latest?apikey={Config.CONVERSION_API_KEY}&base_currency={from_currency}'
        try:
            res = requests.get(url=URL)
            rate = res.json()['data'][to_currency]
            self.cache.put(f'{from_currency}{to_currency}', rate)
            return rate
        except Exception as e:
            return self.find_in_cache(from_currency, to_currency)
    
    def find_in_cache(self, from_currency, to_currency):
        rate = None
        if self.cache.get(f'{from_currency}{to_currency}'):
            rate = self.cache.get(f'{from_currency}{to_currency}')
        elif self.cache.get(f'{to_currency}{from_currency}'):
            rate = 1 / self.cache.get(f'{to_currency}{from_currency}')
        return rate
