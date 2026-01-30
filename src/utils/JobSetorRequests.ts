const BaseURL = "http://localhost:5127";

export const fetchJobSectors = async () => {
  const response = await fetch(`${BaseURL}/job-sectors`, {
    method: 'GET',
  })
  return response
}