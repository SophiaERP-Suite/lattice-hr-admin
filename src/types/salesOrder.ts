
export type PaymentStatus = "Unpaid" | "PartiallyPaid" | "Paid";

export interface CreateAutoInvoiceRequest {
  employerId: number;
  periodStartDate: string;
  periodEndDate: string;
  jobSeekerId?: number;
  dueDate: string;
  currencyCode?: string;
  currencySymbol?: string;
  taxRateId?: number;
  hourlyRates?: Record<number, number>;
  defaultHourlyRate: number;
}

export interface CreateManualInvoiceRequest {
  employerId: number;
  timesheetIds: number[];
  dueDate: string;
  currencyCode?: string;
  currencySymbol?: string;
  taxRateId?: number;
  hourlyRates?: Record<number, number>;
  defaultHourlyRate: number;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
  amountPaid: number;
}

export interface SalesOrderLineResponse {
  salesOrderLineId: number;
  timesheetId: number;
  jobSeekerId: number;
  jobSeekerName: string;
  description: string;
  totalHours: number;
  hourlyRate: number;
  subTotal: number;
  periodStartDate: string;
  periodEndDate: string;
}

export interface SalesOrderResponse {
  invoiceId: number;
  salesOrderId: number;
  employerId: number;
  employerName: string;
  invoiceReference: string;
  dueDate: string;
  periodStartDate?: string;
  periodEndDate?: string;
  subTotal: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  paymentProofUrl: string;
  currencyCode: string;
  publishStatus: string;
  currencySymbol: string;
  dateCreated: string;
  lines: SalesOrderLineResponse[];
}

export interface SalesOrderSummaryResponse {
  salesOrderId: number;
  invoiceReference: string;
  employerName: string;
  dueDate: string;
  totalAmount: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  currencySymbol: string;
  dateCreated: string;
  lineCount: number;
}