const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export const getEmployerShifts = async (employerId: number) => {
  const response = await fetch(`${BaseURL}/shifts/${employerId}/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getJobShifts = async (jobId: number) => {
  const response = await fetch(`${BaseURL}/shifts/job/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
