const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
// const BaseURL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

export const CancelOffer = async (jobOfferId: number) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${jobOfferId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const GetOffer = async (jobApplicationId: number) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${jobApplicationId}/admin`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  // const data = await response.json()
  // console.log("jjj offer", data)
  return response.json();
};

export const UpdateOffer = async (jobOfferId: number, data: FormData) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${jobOfferId}`,
    {
      method: "PUT",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      body: data
    },
  );
  return response.json();
};

export const GetEmployerOffers = async (
  search?: string,
  status?: string,
  pageNumber: number = 1,
  pageSize: number = 20,
  clientId?: number
) => {
  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (status !== undefined && status !== null) params.append('status', status.toString());
  if (pageNumber) params.append('pageNumber', pageNumber.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());

  const queryString = params.toString();

  const response = await fetch(
    `${BaseURL}/jobOffer/${clientId}/employerOffers/admin?${queryString}`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};

export const GetAllEmployerOffers = async (clientId: number) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${clientId}/allEmployerOffers/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};

export const CreateJobOffer = async (data: FormData, employerId: number) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${employerId}/admin`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data
    },
  );

  return response.json();
};

export const SendJobOffer = async (id: number) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${id}/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log('CreateJobOffer send API response:', response);
  return response.json();
};
