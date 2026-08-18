const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

export interface JobFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  stateId?: number;
  cityId?: number;
  status?: number;
}

export const fetchAllJobs = async (filterData: object) => {
  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  })
  const url = `${BaseURL}/jobs?${params}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return response
}

export const createJob = async (data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/jobs/admin`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const updateJob = async (jobId: number, data: FormData) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/jobs/${jobId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: data
  })
  return response
}

export const getJobById = async (jobId: number) => {
  const token = localStorage.getItem('accessToken');
  const url = `${BaseURL}/jobs/${jobId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  return response
}


export const JobApplications = async (jobId: number) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${BaseURL}/job-application/job/${jobId}/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const GetMyFilteredJobsApplications = async (
  filters: JobFilters = {},
  jobId: number,
) => {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 10));

  if (filters.searchTerm) {
    params.set("searchTerm", filters.searchTerm);
  }
  if (filters.stateId != null && filters.stateId > 0) {
    params.set("stateId", String(filters.stateId));
  }
  if (filters.cityId != null && filters.cityId > 0) {
    params.set("cityId", String(filters.cityId));
  }
  if (filters.status != null && filters.status > 0) {
    params.set("status", String(filters.status));
  }

  const url = `${BaseURL}/job-application/jobApplication/${jobId}/admin?${params.toString()}`;

  console.log("FINAL URL:", url);
  console.log("FINAL URL stta:", url);
  const token = localStorage.getItem('accessToken');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Server error:", errorText);
    throw new Error("Failed to fetch jobs");
  }

  return await response.json();
};
