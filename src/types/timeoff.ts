export interface LeaveRequest {
  leaveRequestId: number;
  employeeName: string;
  employeeAvatar?: string;
  employeeDepartment: string;
  employeeJobTitle: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  dateCreated: string;
}

export interface LeaveRequestsResponse {
  items: LeaveRequest[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface DepartmentStats {
  department: string;
  total: number;
  pending: number;
  approved: number;
}
