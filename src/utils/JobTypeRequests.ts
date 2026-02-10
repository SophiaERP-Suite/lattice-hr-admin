const BaseURL = "http://localhost:5127";

export const fetchJobTypes = async () => {
  const response = await fetch(`${BaseURL}/job-types`, {
    method: 'GET',
  })
  return response
}

export const fetchAllJobTypes = async () => {
  const response = await fetch(`${BaseURL}/job-types/all`, {
    method: 'GET',
  })
  return response
}

export const addJobType = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-types`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateJobType = async (data: FormData, jobTypeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-types/${jobTypeId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteJobType = async (jobTypeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-types/${jobTypeId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
