const BaseURL = "http://localhost:5127";

export const fetchJobTypes = async () => {
  const response = await fetch(`${BaseURL}/job-types`, {
    method: 'GET',
  })
  return response
}