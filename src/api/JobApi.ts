import type { JobFilters } from "../utils/JobRequests";

const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";
const token = localStorage.getItem("token");

export const GetAllEmployerApplications = async (
  page = 1,
  pageSize = 10,
  searchTerm = "",
  status = "",
  jobId?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(searchTerm && { searchTerm }),
    ...(status && { status }),
    ...(jobId && { jobId: String(jobId) }),
  });

  const res = await fetch(`${BaseURL}/job-application/applications?${params}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return res.json();
};

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
    `${BaseURL}/jobOffer/${jobApplicationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const UpdateOffer = async (jobOfferId: number, data: FormData) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${jobOfferId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data
    },
  );
  return response.json();
};

export const GetEmployerOffers = async (
  search?: string,
  status?: string,
  pageNumber: number = 1,
  pageSize: number = 20
) => {
  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (status !== undefined && status !== null) params.append('status', status.toString());
  if (pageNumber) params.append('pageNumber', pageNumber.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());

  const queryString = params.toString();

  const response = await fetch(
    `${BaseURL}/jobOffer/employerOffers?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const GetAllEmployerOffers = async () => {
  const response = await fetch(
    `${BaseURL}/jobOffer/allEmployerOffers`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const CreateJobOffer = async (data: FormData) => {
  const response = await fetch(
    `${BaseURL}/jobOffer`,
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

export const getReferencesByJobSeekerId = async (jobSeekerId: number) => {
  const response = await fetch(
    `${BaseURL}/reference/${jobSeekerId}/jobSeeker`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const CreateJob = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return response;
};

export const UpdateJob = async (data: FormData, jobId: number) => {
  const response = await fetch(`${BaseURL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return response;
};

export const PublishJob = async (jobId: number) => {
  const response = await fetch(`${BaseURL}/jobs/${jobId}/publish`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const JobApplications = async (jobId: number) => {
  const response = await fetch(`${BaseURL}/job-application/job/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const JobApplicationTimeline = async (applicationId: number) => {
  const response = await fetch(
    `${BaseURL}/application-timeline/${applicationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const JobApplication = async (applicationId: number) => {
  const response = await fetch(
    `${BaseURL}/job-application/${applicationId}/application`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const ApplicationFeedback = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/job-application/add-feedback`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return response.json();
};

export const UpdateApplicationStatus = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/job-application/update-status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  return response.json();
};

export const GetMyJobs = async (page: number, pageSize: number) => {
  const response = await fetch(
    `${BaseURL}/jobs/${page}/${pageSize}/ByEmployer`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

export const GetJob = async (jobId: number) => {
  const response = await fetch(`${BaseURL}/jobs/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// job meta
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

export const getJobCategories = async (jobSectorId: number) => {
  const response = await fetch(
    `${BaseURL}/job-meta/${jobSectorId}/categories`,
    {
      method: "GET",
    },
  );

  return response.json();
};

export const getJobWorkMode = async () => {
  const response = await fetch(`${BaseURL}/workmode`, {
    method: "GET",
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

  const url = `${BaseURL}/job-application/jobApplication/${jobId}?${params.toString()}`;

  console.log("FINAL URL:", url);
  console.log("FINAL URL stta:", url);

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
