import type { PagedResult } from "../types/invoice";
import type { CreateAutoInvoiceRequest, SalesOrderResponse, CreateManualInvoiceRequest, SalesOrderSummaryResponse, UpdatePaymentStatusRequest } from "../types/salesOrder";


const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

const apiUrl = (path: string) => `${BASE_URL}}`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      console.error("Failed to parse error response");
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function createAutoInvoice(
  payload: CreateAutoInvoiceRequest
): Promise<SalesOrderResponse> {
  const res = await fetch(apiUrl("/auto"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<SalesOrderResponse>(res);
}

export async function createManualInvoice(
  payload: CreateManualInvoiceRequest
): Promise<SalesOrderResponse> {
  const res = await fetch(`${BASE_URL}/invoice/manual`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<SalesOrderResponse>(res);
}

export async function getInvoiceById(
  id: number
): Promise<SalesOrderResponse> {
  const res = await fetch(`${BASE_URL}/invoice/${id}`, {
    method: "GET",
  });
  return handleResponse<SalesOrderResponse>(res);
}

export async function getAllInvoices(
  page: number = 1,
  pageSize: number = 10,
  paymentStatus?: string
): Promise<PagedResult<SalesOrderResponse>> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("pageSize", String(pageSize));
  if (paymentStatus) params.append("paymentStatus", paymentStatus);

  const res = await fetch(`${BASE_URL}/invoice/admin/all?${params.toString()}`, {
    method: "GET",
  });
  return handleResponse<PagedResult<SalesOrderResponse>>(res);
}

export async function getInvoicesByEmployer(
  employerId: number
): Promise<SalesOrderSummaryResponse[]> {
  const res = await fetch(apiUrl(`/employer/${employerId}`));
  return handleResponse<SalesOrderSummaryResponse[]>(res);
}

export async function getInvoicesByJobSeeker(
  jobSeekerId: number
): Promise<SalesOrderSummaryResponse[]> {
  const res = await fetch(apiUrl(`/jobseeker/${jobSeekerId}`));
  return handleResponse<SalesOrderSummaryResponse[]>(res);
}

export async function getUnpaidInvoicesByEmployer(
  employerId: number
): Promise<SalesOrderSummaryResponse[]> {
  const res = await fetch(apiUrl(`/employer/${employerId}/unpaid`));
  return handleResponse<SalesOrderSummaryResponse[]>(res);
}

export async function PublishInvoice(
  id: number,
) {
  const res = await fetch(`${BASE_URL}/invoice/${id}/publishInvoice/admin`, {
    method: "PATCH",
  });
  return res.json();
}

