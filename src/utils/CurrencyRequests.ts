const BaseURL = "http://localhost:5127";

export const fetchCurrencies = async () => {
  const response = await fetch(`${BaseURL}/currencies`, {
    method: 'GET',
  })
  return response
}

export const fetchAllCurrencies = async () => {
  const response = await fetch(`${BaseURL}/currencies/all`, {
    method: 'GET',
  })
  return response
}

export const updateCurrency = async (currencyId: number, data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/currencies/${currencyId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}
