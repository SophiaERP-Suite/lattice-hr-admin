const BaseURL = "http://localhost:5127";

export interface JobFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  stateId?: number;
  cityId?: number;
  status?: number;
}

export const GetOffer = async (jobApplicationId: number) => {
  const response = await fetch(
    `${BaseURL}/jobOffer/${jobApplicationId}/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};

export const JobApplication = async (applicationId: number) => {
  const response = await fetch(
    `${BaseURL}/job-application/${applicationId}/application/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};

export const JobApplicationTimeline = async (applicationId: number) => {
  const response = await fetch(
    `${BaseURL}/application-timeline/${applicationId}/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};

export const getReferencesByJobSeekerId = async (jobSeekerId: number) => {
  const response = await fetch(
    `${BaseURL}/reference/${jobSeekerId}/jobSeeker/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};

export const ApplicationFeedback = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/job-application/add-feedback/admin`, {
    method: "POST",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
    body: data,
  });
  return response.json();
};

export const GetResponses = async (jobId: number, jobSeekerId: number) => {
  const response = await fetch(
    `${BaseURL}/interviews/${jobId}/${jobSeekerId}/responses/admin`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
  );
  return response.json();
};


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

export const UpdateApplicationStatus = async (data: FormData) => {
  const response = await fetch(`${BaseURL}/job-application/update-status/admin`, {
    method: "PUT",

    body: data,
  });
  return response;
};
