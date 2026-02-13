const BaseURL = "http://localhost:5127";

export const fetchResponsibilityTypes = async () => {
  const response = await fetch(`${BaseURL}/responsibility-types`, {
    method: 'GET',
  })
  return response
}

export const fetchAllResponsibilityTypes = async () => {
  const response = await fetch(`${BaseURL}/responsibility-types/all`, {
    method: 'GET',
  })
  return response
}

export const addResponsibilityType = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/responsibility-types`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateResponsibilityType = async (data: FormData, typeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/responsibility-types/${typeId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteResponsibilityType = async (typeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/responsibility-types/${typeId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
