const BaseURL = "http://localhost:5127";

export const fetchComplaintCategories = async () => {
  const response = await fetch(`${BaseURL}/complaint-categories`, {
    method: 'GET',
  })
  return response
}

export const fetchAllComplaintCategories = async () => {
  const response = await fetch(`${BaseURL}/complaint-categories/all`, {
    method: 'GET',
  })
  return response
}

export const addComplaintCategory = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/complaint-categories`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateComplaintCategory = async (data: FormData, categoryId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/complaint-categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteComplaintCategory = async (categoryId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/complaint-categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
