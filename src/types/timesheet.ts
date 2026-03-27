export interface TimesheetLine {
  lineId: number;
  workDate: string;
  dayName: string;
  clockIn: string | null;
  clockOut: string | null;
  regularHrs: number;
  overtimeHrs: number;
  totalHrs: number;
  leaveType: string | null;
  holiday: string | null;
  notes: string | null;
  isLeaveDay: boolean;
  isHoliday: boolean;
  currencyCode: string
}

export interface Timesheet {
  timesheetId: number;
  jobSeekerId: number;
  employeeName: string;
  employeeAvatar: string;
  periodStartDate: string;
  periodEndDate: string;
  totalRegularHrs: number;
  totalOvertimeHrs: number;
  totalHours: number;
  dailyHours: number;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  statusLabel: string;
  dateCreated: string;
  dateApproved: string | null;
  approverName: string | null;
  notes: string | null;
  lines: TimesheetLine[];
  monthlySalary?: number | null;
  dailyRate?: number | null;
  absentDeduction?: number | null;
  amountDue?: number | null;
  standardDays?: number | null;
  daysWorked?: number | null;
  absentDays?: number | null;
  currencyCode: string;
  currencySymbol: string;
}

export interface TimesheetPagedDto {
  items: Timesheet[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const TimesheetStatusMap = {
  Draft: 0,
  Submitted: 1,
  Approved: 2,
  Rejected: 3,
} as const;

export type TimesheetStatusKey = keyof typeof TimesheetStatusMap;