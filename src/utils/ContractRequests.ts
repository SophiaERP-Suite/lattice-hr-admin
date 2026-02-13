const BaseURL = "http://localhost:5127";

export const fetchAllContractRequests = async (filterData: object) => {
  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  })
  const url = `${BaseURL}/contract-requests?${params}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return response
}

export const getContractRequestById = async (requestId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/contract-requests/${requestId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}

export const sendContractRequestMessage = async (requestId: number, data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/contract-requests/${requestId}/message`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateContractRequestMessage = async (requestId: number, data: FormData, messageId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/contract-requests/${requestId}/message/${messageId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteContractRequestMessage = async (requestId: number, messageId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/contract-requests/${requestId}/message/${messageId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
