const BaseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

const token = localStorage.getItem("token");

export const getMyAttendanceByEmployerId = async (
  jobSeekerId: number,
  month: number,
  year: number,
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  const response = await fetch(
    `${BaseURL}/clock/${jobSeekerId}/EmployeeTimesheet?month=${month}&year=${year}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch attendance");

  return response.json();
};

export const getMyAttendanceSummaryByJobSeekerId = async (jobSeekerId: number, month: number, year: number) => {
  const response = await fetch(`${BaseURL}/clock/${month}/${year}/${jobSeekerId}/jobseekerAttendanceSummary`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
