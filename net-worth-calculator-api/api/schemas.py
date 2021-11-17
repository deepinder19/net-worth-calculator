from typing_extensions import Required


update_accounts_schema = {
    'type': 'object',
    'properties': {
        'chequing': {'type': 'number'},
        'savingsForTaxes': {'type': 'number'},
        'rainyDayFund': {'type': 'number'},
        'savingsForFun': {'type': 'number'},
        'savingsForTravel': {'type': 'number'},
        'savingsPersonalDevelopment': {'type': 'number'},
        'investment1': {'type': 'number'},
        'investment2': {'type': 'number'},
        'investment3': {'type': 'number'},
        'primaryHome': {'type': 'number'},
        'secondHome': {'type': 'number'},
        'otherLongTermAsset': {'type': 'number'},
        'creditCard1': {'type': 'number'},
        'creditCard2': {'type': 'number'},
        'mortgage1': {'type': 'number'},
        'mortgage2': {'type': 'number'},
        'lineOfCredit': {'type': 'number'},
        'investmentLoan':{'type': 'number'}
    }
}

update_currency_schema = {
    'type': 'object',
    'properties': {
        'currency': {'type': 'string'}
    },
    'required': ['currency']
}
