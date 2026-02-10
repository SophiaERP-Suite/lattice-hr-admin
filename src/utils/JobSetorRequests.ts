const BaseURL = "http://localhost:5127";

export const fetchJobSectors = async () => {
  const response = await fetch(`${BaseURL}/job-sectors`, {
    method: 'GET',
  })
  return response
}

export const fetchAllJobSectors = async () => {
  const response = await fetch(`${BaseURL}/job-sectors/all`, {
    method: 'GET',
  })
  return response
}

export const addJobSector = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-sectors`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateJobSector = async (data: FormData, jobSectorId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-sectors/${jobSectorId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deleteJobSector = async (jobSectorId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-sectors/${jobSectorId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}
