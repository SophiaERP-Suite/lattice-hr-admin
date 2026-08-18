const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

const token = localStorage.getItem("token");

export const getAllCountries = async () => {
  const response = await fetch(`${BaseURL}/countries`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getAllStates = async (countryId: number) => {
  const response = await fetch(`${BaseURL}/states/${countryId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getAllCities = async (stateId: number) => {
  const response = await fetch(`${BaseURL}/cities/${stateId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
