const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const getAllTimesheetsForAdmin = async (
  page = 1,
  pageSize = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(status ? { status } : {}),
    ...(search ? { searchTerm: search } : {}),
  });
  const res = await fetch(`${BASE_URL}/timesheet/admin?${params}`, {
    method: "GET",
    headers: authHeaders()
  });

  const data = await res.json();
  return data;
};

export const getAllTimesheets = async (
  page = 1,
  pageSize = 10,
  status?: string,
  employerId?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(status ? { status } : {}),
  });
  const res = await fetch(`${BASE_URL}/timesheet/employer/${employerId}/admin?${params}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch timesheets");
  return res.json();
};

export const getEmployeeTimesheets = async (
  jobSeekerId: number,
  page = 1,
  pageSize = 10,
  status?: string,
  employerId?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(status ? { status } : {}),
  });
  const res = await fetch(
    `${BASE_URL}/timesheet/employer/employee/${jobSeekerId}/${employerId}/admin?${params}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch employee timesheets");
  return res.json();
};

export const getTimesheetById = async (timesheetId: number,) => {
  const res = await fetch(`${BASE_URL}/timesheet/${timesheetId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch timesheet");
  return res.json();
};

export const reviewTimesheet = async (
  timesheetId: number,
  action: "Approved" | "Rejected",
  notes?: string,
  employerId?: number
) => {
  const res = await fetch(`${BASE_URL}/timesheet/${timesheetId}/${employerId}/review/admin`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ action, notes }),
  });
  if (!res.ok) throw new Error("Failed to review timesheet");
  return res;
};