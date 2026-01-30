const BaseURL = "http://localhost:5127";

export const fetchCountries = async () => {
  const response = await fetch(`${BaseURL}/countries`, {
    method: 'GET',
  })
  return response
}

export const fetchStatesByCountryId = async (countryId: number) => {
  const response = await fetch(`${BaseURL}/states/${countryId}`, {
    method: 'GET',
  })
  return response
}

export const fetchCitiesByStateId = async (stateId: number) => {
  const response = await fetch(`${BaseURL}/cities/${stateId}`, {
    method: 'GET',
  });
  return response;
};