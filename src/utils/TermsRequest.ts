import type { TermsType } from "../types/terms";

// const BaseURL = import.meta.env.VITE_API_URL;
const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const GetAllTerms = async (clientId: number) => {
  const response = await fetch(
    `${BaseURL}/terms/${clientId}/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
    },
  );
  return response.json();
};

export const GetTermsByType = async (
  type: TermsType,
  employerId?: number
) => {
  const url = employerId
    ? `${BaseURL}/terms/type/${type}?employerId=${employerId}`
    : `${BaseURL}/terms/type/${type}`;

  const response = await fetch(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.json();
};

export const GetTermsById = async (id: number) => {
  const response = await fetch(
    `${BaseURL}/terms/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.json();
};

export const CreateTerms = async (data: FormData, employerId: number) => {
  const response = await fetch(
    `${BaseURL}/terms/${employerId}/admin`,
    {
      method: "POST",
      body: data
    },
  );
  return response.json();
};

export const UpdateTerms = async (id: number, data: FormData) => {
  const response = await fetch(
    `${BaseURL}/terms/${id}`,
    {
      method: "PUT",
      body: data
    },
  );
  return response.json();
};

export const DeleteTerms = async (id: number) => {
  const response = await fetch(
    `${BaseURL}/terms/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  return response.json();
};

// export const CreateTermsWithFormData = async (formData: FormData) => {
//   const response = await fetch(
//     `${BaseURL}/terms`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData
//     },
//   );
//   return response.json();
// };