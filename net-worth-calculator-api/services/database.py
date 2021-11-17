from services.conversion_service import ConversionService
from utils.exceptions import ServiceUnavailableError
from .file_reader import FileReader

assets = {'chequing', 'savingsForTaxes', 'rainyDayFund', 'savingsForFun', 'savingsForTravel', 'savingsPersonalDevelopment', 'investment1', 'investment2', 'investment3', 'primaryHome', 'secondHome', 'otherLongTermAsset'}
liabilities = {'creditCard1', 'creditCard2', 'mortgage1', 'mortgage2', 'lineOfCredit', 'investmentLoan'}


class Database:
    def __init__(self):
        self.conversion_client = ConversionService()
        self.file_reader = FileReader()
        self.file_path = ''

    def init_app(self, path):
        self.file_path =  path
    
    def get_data(self):
        return self.file_reader.get_data(self.file_path)
    
    def update_accounts(self, json):
        data = self.file_reader.get_data(self.file_path)
        for key, val in json.items():
            if key in assets:
                old_val = data.get(key, 0)
                data['totalAssets'] += val - old_val
                data[key] = val
            elif key in liabilities:
                old_val = data.get(key, 0)
                data['totalLiabilities'] += val - old_val
                data[key] = val
        self.file_reader.write_data(self.file_path, data)
    
    def update_currency(self, currency):
        data = self.file_reader.get_data(self.file_path)
        rate = self.conversion_client.get_exchange_rate(data.get('currency', 'USD'), currency)
        if not rate:
            raise ServiceUnavailableError()
        data['currency'] = currency
        for key, val in data.items():
            if key != 'currency':
                data[key] = rate * val
        self.file_reader.write_data(self.file_path, data)
