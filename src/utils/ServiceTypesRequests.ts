const BaseURL = "http://localhost:5127";

export const fetchAllServiceTypes = async () => {
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
