const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export const GetAllTaxRates = async () => {
  const response = await fetch(
    `${BaseURL}/taxRate`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  return response;
};

export const CreateTax = async (data: FormData) => {
  const response = await fetch(
    `${BaseURL}/taxRate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data
    },
  );
  return response;
};

export const UpdateTaxRate = async (id: number, data: FormData) => {
  const response = await fetch(
    `${BaseURL}/taxRate/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: data
    },
  );
  return response;
};

export const DeleteTaxRate = async (id: number) => {
  const response = await fetch(
    `${BaseURL}/taxRate/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  return response;
};