export const formatToCurrency = (currency, value) => {
  let formatted = parseFloat(value).toFixed(2)
  if (isNaN(formatted)) {
    formatted = ''
  }
  else {
    formatted = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code'
    }).format(formatted);
    formatted = formatted.replace(/[a-z]{3}/i, '').trim()
  }
  return formatted
}

export const formatCurrencyToString = (value) => {
  if (value) {
    return value.replace(/,/gi, '')
  }
  return value
}
