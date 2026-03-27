import type { TermsType } from "../types/terms";

const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const GetAllTerms = async () => {
  const response = await fetch(
    `${BaseURL}/terms`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const CreateTerms = async (data: FormData) => {
  const response = await fetch(
    `${BaseURL}/terms`,
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

export const UpdateTerms = async (id: number, data: FormData) => {
  const response = await fetch(
    `${BaseURL}/terms/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  return response.json();
};