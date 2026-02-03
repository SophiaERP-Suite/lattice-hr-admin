const BaseURL = "http://localhost:5127";

export const fetchAllPackages = async (filterData: object) => {
  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  })
  const url = `${BaseURL}/packages?${params}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return response
}

export const fetchPackageById = async (packageId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/packages/${packageId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return response
}


export const addFeatureToPackage = async (packageId: number, data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/packages/${packageId}/feature`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updatePackageFeatureById = async (packageId: number, packageFeatureId: number, data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/packages/${packageId}/feature/${packageFeatureId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const deletetePackageFeatureById = async (packageId: number, packageFeatureId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/packages/${packageId}/feature/${packageFeatureId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}

export const createPackage = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/packages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updatePackageDetails = async (packageId: number, data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/packages/${packageId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}
