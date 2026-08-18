const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export const CreateInterview = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/interviews/add-question`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;
};

export const GetResponses = async (jobId: number, jobSeekerId: number) => {
  const response = await fetch(
    `${BaseURL}/interviews/${jobId}/${jobSeekerId}/responses`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};


export const UpdateQuestion = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/interviews/update-question`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  return response;

  // const result = await response.text(); 
  // console.log("Status:", response.status);
  // console.log("Response body:", result);
};

export const GetAllQuestions = async (jobId: number) => {
  const response = await fetch(
    `${BaseURL}/interviews/${jobId}/questions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const DeleteQuestion = async (id: number) => {
  const response = await fetch(`${BaseURL}/interviews/delete-question/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
