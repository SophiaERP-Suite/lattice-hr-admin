export interface PayslipDto {
  payslipId: number;
  jobSeekerId: number;
  employerName: string;
  employerId: number;
  employeeName: string;
  employeeAvatar?: string;
  month: number;
  year: number;
  standardDays: number;
  daysWorked: number;
  absentDays: number;
  monthlySalary: number;
  dailyRate: number;
  absentDeduction: number;
  amountDue: number;
  status: string;
  statusValue: number;
  paymentReference?: string;
  paymentReceiptPath?: string;
  datePaid?: string;
  paidByName?: string;
}

export interface PayrollSummaryDto {
  month: number;
  year: number;
  totalEmployees: number;
  currency: string;
  totalAmountDue: number;
  totalPaid: number;
  totalPending: number;
  payslips: PayslipDto[];
  currencyCode: string;
  currencySymbol: string;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PreflightDto {
  isReady: boolean;
  totalEmployees: number;
  employeesWithPendingTimesheets: number;
  pendingDetails: string[];
}
