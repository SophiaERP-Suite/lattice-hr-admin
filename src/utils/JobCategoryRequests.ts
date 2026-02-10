const BaseURL = "http://localhost:5127";

export const fetchJobCategories = async (jobSectorId: number) => {
  const response = await fetch(`${BaseURL}/job-categories/${jobSectorId}`, {
    method: 'GET',
  })
  return response
}

export const fetchAllJobCategories = async (filterData: object) => {
  
  const params = new URLSearchParams();
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  })
  const url = `${BaseURL}/job-categories/all?${params}`;
  const response = await fetch(url, {
    method: 'GET',
  })
  return response
}

export const addJobCategory = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-categories`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateJobCategory = async (data: FormData, jobTypeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-categories/${jobTypeId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteJobCategory = async (jobTypeId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-categories/${jobTypeId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
