const BaseURL = "http://localhost:5127";

export const fetchAllWorkers = async (filterData: object) => {
  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  })
  const url = `${BaseURL}/workers?${params}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return response
}

export const fetchWorkerById = async (userId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/workers/${userId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}

export const addNewWorker = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/workers`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}
