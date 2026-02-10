const BaseURL = "http://localhost:5127";

export const fetchWorkModes = async () => {
  const response = await fetch(`${BaseURL}/workmode`, {
    method: 'GET',
  })
  return response
}

export const fetchAllWorkModes = async () => {
  const response = await fetch(`${BaseURL}/workmode/all`, {
    method: 'GET',
  })
  return response
}

export const addWorkMode = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/workmode`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateWorkMode = async (data: FormData, workModeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/workmode/${workModeId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteWorkMode = async (workModeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/workmode/${workModeId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
