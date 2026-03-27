const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

const token = localStorage.getItem("token");

export const CreateJob = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  });

  if (!response) {
    console.log("job nniiws", response);
  }

  return response;
};

export const getJobTypes = async () => {
  const response = await fetch(`${BaseURL}/job-meta/types`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getJobSectors = async () => {
  const response = await fetch(`${BaseURL}/job-meta/sectors`, {
    method: "GET",
  });

  return response.json();
};

export const getJobCategories = async () => {
  const response = await fetch(`${BaseURL}/job-meta/categories`, {
    method: "GET",
  });

  return response.json();
};

export const getJobWorkMode = async () => {
  const response = await fetch(`${BaseURL}/workmode`, {
    method: "GET",
  });

  return response.json();
};
