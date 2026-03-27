const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export const getJobSeekerInfo = async (jobSeekerId: number) => {
  const response = await fetch(`${BaseURL}/jobseeker/${jobSeekerId}/JobSeekerInfo/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getBankDetails = async (jobSeekerId: number) => {
  const response = await fetch(`${BaseURL}/bank/${jobSeekerId}/me/admin`, {
    method: "GET",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    //   "Content-Type": "application/json",
    // },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return data
};