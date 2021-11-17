const baseUrl = 'http://localhost:5000'

function handleErrors(response) {
  if (!response.ok) {
    throw Error();
  }
  return response;
}

function makeRequest(url, method, payload) {
  const requestParams = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  }
  if (method.match(/(POST|PUT|PATCH)/)) {
    requestParams['body'] = JSON.stringify(payload)
  }
  return fetch(`${baseUrl}${url}`, requestParams)
    .then(handleErrors)
    .then(res => res.json())
}

export async function getAccounts() {
  return await makeRequest('/accounts', 'GET');
}

export function updateAccounts(payload) {
  return makeRequest('/accounts', 'PUT', payload);
}

export async function updateCurrency(payload) {
  return await makeRequest('/currency', 'PUT', payload);
}
