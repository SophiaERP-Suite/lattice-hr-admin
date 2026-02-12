const BaseURL = "http://localhost:5127";

export const fetchActiveServiceTypes = async () => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/service-types`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return response
}

export const fetchAllServiceTypes = async () => {
  const response = await fetch(`${BaseURL}/service-types/all`, {
    method: 'GET',
  })
  return response
}

export const addServiceType = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/service-types`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateServiceType = async (data: FormData, serviceTypeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/service-types/${serviceTypeId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteServiceType = async (serviceTypeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/service-types/${serviceTypeId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}

