import { useState, useEffect, useMemo } from "react";
import {
  AlertCircle, CheckCircle,
  Upload, Eye, X, Users
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { PayrollSummaryDto, PayslipDto } from "../../types/Payment";
import { confirmPayment, getPayrollSummary } from "../../api/PaymentApi";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

interface FormErrors {
  paymentRef?: string;
  receiptFile?: string;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const validateForm = (paymentRef: string, receiptFile: File | null): FormErrors => {
  const errors: FormErrors = {};

  // Payment reference
  if (!paymentRef.trim()) {
    errors.paymentRef = "Payment reference is required";
  } else if (paymentRef.trim().length < 3) {
    errors.paymentRef = "Reference must be at least 3 characters";
  } else if (paymentRef.trim().length > 200) {
    errors.paymentRef = "Reference must not exceed 200 characters";
  }

  // Receipt file — optional but validate if provided
  if (receiptFile) {
    if (!ALLOWED_FILE_TYPES.includes(receiptFile.type)) {
      errors.receiptFile = "Only JPG, PNG, WEBP, or PDF files are accepted";
    } else if (receiptFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errors.receiptFile = `File must not exceed ${MAX_FILE_SIZE_MB}MB`;
    }
  }

  return errors;
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const TableSkeleton = () => (
  <div className="placeholder-glow">
    {[1, 2, 3, 4, 5].map(row => (
      <div key={row} className="d-flex gap-3 mb-3 align-items-center">
        <div className="placeholder rounded-circle" style={{ width: 36, height: 36, flexShrink: 0 }} />
        <div className="flex-grow-1">
          <span className="placeholder col-3 d-block mb-1" />
          <span className="placeholder col-2" style={{ height: 10 }} />
        </div>
        <span className="placeholder col-2" />
        <span className="placeholder col-2" />
        <span className="placeholder col-1" />
      </div>
    ))}
  </div>
);

// ── Main ──────

const Payment = ({ employerId }: { employerId: number }) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [summary, setSummary] = useState<PayrollSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1, pageSize: 10, totalCount: 0, totalPages: 1,
  });

  // Confirm payment modal
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipDto | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currency, setCurrency] = useState<string>();

  // View receipt modal
  const [receiptModal, setReceiptModal] = useState(false);
  const [receiptPayslip, setReceiptPayslip] = useState<PayslipDto | null>(null);

  useEffect(() => { loadSummary(1); }, [statusFilter]);

  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    const errors = validateForm(paymentRef, receiptFile);
    setFormErrors(errors);
  }, [paymentRef, receiptFile, touched]);

  const loadSummary = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getPayrollSummary(
        currentMonth,
        currentYear,
        page,
        pagination.pageSize,
        statusFilter || undefined,
        search?.trim() || undefined,
        employerId
      );
      console.log("ooown", data)
      setSummary(data);
      setCurrency(data.currencySymbol)
      setPagination(prev => ({
        ...prev,
        page: data.page,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      }));
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayslip) return;

    setTouched({ paymentRef: true, receiptFile: true });

    const errors = validateForm(paymentRef, receiptFile);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setConfirming(true);
    try {
      const response = await confirmPayment(selectedPayslip.payslipId, paymentRef, receiptFile, employerId);
      console.log("dhhdhhdhdhdhd", response)
      toast.success(`Payment confirmed for ${selectedPayslip.employeeName}`);
      closeConfirmModal();
      await loadSummary();
    } catch {
      toast.error("Failed to confirm payment");
    } finally {
      setConfirming(false);
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal(false);
    setSelectedPayslip(null);
    setPaymentRef("");
    setReceiptFile(null);
    setFormErrors({});
    setTouched({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setReceiptFile(file);
    setTouched(prev => ({ ...prev, receiptFile: true }));
  };

  const filteredPayslips = useMemo(() => {
    if (!summary) return [];
    return summary.payslips.filter(p =>
      !search || p.employeeName.toLowerCase().includes(search.toLowerCase())
    );
  }, [summary, search]);

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" />
      <div className="row">

        {/* Header */}
        <div className="col-xl-12">
          <h1 className="fs-18 lh-1">
            Payslips — {MONTHS[currentMonth - 1]} {currentYear}
          </h1>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="d-none">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-primary-transparent text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Total Employees</span>
                    <h2>{summary.totalEmployees}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-info-transparent text-info">
                    <i className="ri-money-dollar-circle-line fs-42" />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Total Payroll</span>
                    <h2>{summary.totalAmountDue}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-warning-transparent text-warning">
                    <i className="ri-alert-line fs-42" />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Pending</span>
                    <h2>{summary.totalPending}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-success-transparent text-success">
                    <i className="ri-checkbox-circle-line fs-42" />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Paid</span>
                    <h2>{summary.totalPaid}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Table */}
        <div className="col-xl-12">
          <div className="">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0"></h5>
              <div className="d-flex gap-2 align-items-center flex-wrap">

                {/* Status filter */}
                <select
                  className="form-select form-select-sm"
                  style={{ width: 140 }}
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="0">Pending</option>
                  <option value="1">Paid</option>
                </select>

                {/* Search — fires on Enter or button click */}
                <div className="input-group input-group-sm" style={{ width: 220 }}>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search employee..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") loadSummary(1); }}
                  />
                  {/* <button
                        className="btn btn-outline-secondary"
                        onClick={() => loadSummary(1)}
                      >
                        Go
                      </button> */}
                </div>

                {/* Clear */}
                {(search || statusFilter) && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("");
                    }}
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="card-body pt-15">
              {loading ? (
                <TableSkeleton />
              ) : !summary || summary.payslips.length === 0 ? (
                <div className="text-center py-5 ">
                  <AlertCircle size={48} className="mb-3 d-block mx-auto" />
                  <h6>No payment data for this month</h6>
                  <p className="small mb-0">
                    Payroll has not been generated yet for {MONTHS[currentMonth - 1]} {currentYear}.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Days Worked</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Date</th>
                        <th>Reference</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayslips.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 ">
                            No employees match your search
                          </td>
                        </tr>
                      ) : (
                        filteredPayslips.map(p => (
                          <tr key={p.payslipId}>
                            <td>
                              <div className="d-flex align-items-center gap-10">
                                {p.employeeAvatar ? (
                                  <div className="avatar radius-100">
                                    <img
                                      src={`${BASE_URL}/${p.employeeAvatar}`}
                                      alt={p.employeeName}
                                      className="radius-100"
                                      style={{ width: 36, height: 36, objectFit: "cover" }}
                                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="avatar avatar-sm bg-primary-transparent text-primary radius-100 d-flex align-items-center justify-content-center fw-bold"
                                    style={{ width: 36, height: 36 }}
                                  >
                                    {p.employeeName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="fw-medium">{p.employeeName}</div>
                              </div>
                            </td>
                            <td>
                              <span className={p.absentDays > 0 ? "text-warning" : "text-success"}>
                                {p.daysWorked} / {p.standardDays}
                              </span>
                              {p.absentDays > 0 && (
                                <div>
                                  <small className="text-danger">
                                    {p.absentDays} absent · −{p.absentDeduction}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td>
                              <span className="fw-bold text-success fs-5">
                                {currency}{p.amountDue}
                              </span>
                            </td>
                            <td>
                              {p.status === "Paid" ? (
                                <span className="badge bg-label-success">
                                  <CheckCircle size={12} className="me-1" />Paid
                                </span>
                              ) : (
                                <span className="badge bg-label-warning">Pending</span>
                              )}
                            </td>
                            <td>
                              {p.datePaid ? (
                                <span className=" small">
                                  {new Date(p.datePaid).toLocaleDateString("en-GB", {
                                    day: "2-digit", month: "short", year: "numeric",
                                  })}
                                </span>
                              ) : "—"}
                            </td>
                            <td>
                              {p.paymentReference ? (
                                <span className="badge bg-label-info">{p.paymentReference}</span>
                              ) : "—"}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2">
                                {p.status === "Paid" && p.paymentReceiptPath && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => { setReceiptPayslip(p); setReceiptModal(true); }}
                                  >
                                    <Eye size={14} className="me-1" /> Receipt
                                  </button>
                                )}
                                {p.status === "Draft" && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => { setSelectedPayslip(p); setConfirmModal(true); }}
                                  >
                                    <Upload size={14} className="me-1" /> Upload Receipt
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {filteredPayslips.length > 0 && (
                      <tfoot className="d-none table-light fw-bold">
                        <tr>
                          <td colSpan={2} className="text-end">Total:</td>
                          <td className="text-success">

                          </td>
                          <td colSpan={4} />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <small className="">
                    Showing {((pagination.page - 1) * pagination.pageSize) + 1}–
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{" "}
                    {pagination.totalCount} employees
                  </small>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                        <button className="page-link"
                          onClick={() => loadSummary(pagination.page - 1)}>
                          Previous
                        </button>
                      </li>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <li key={i + 1}
                          className={`page-item ${pagination.page === i + 1 ? "active" : ""}`}>
                          <button className="page-link"
                            onClick={() => loadSummary(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                        <button className="page-link"
                          onClick={() => loadSummary(pagination.page + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Payment Modal ─────────────────────────────────────────── */}
      {confirmModal && selectedPayslip && (
        <div
          className="modal show fade"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Payment</h5>
                <button className="btn-close" onClick={closeConfirmModal} />
              </div>
              <div className="modal-body">

                {/* Employee + amount summary */}
                <div className="alert alert-info mb-4">
                  <strong className="d-block">{selectedPayslip.employeeName}</strong>
                  <small className="">
                    {MONTHS[selectedPayslip.month - 1]} {selectedPayslip.year} ·{" "}
                    {selectedPayslip.daysWorked}/{selectedPayslip.standardDays} days worked
                  </small>
                  <div className="mt-1">
                    <strong className="text-success fs-5">
                      {selectedPayslip.amountDue}
                    </strong>
                  </div>
                  {selectedPayslip.absentDays > 0 && (
                    <small className="text-danger d-block mt-1">
                      Includes deduction of {selectedPayslip.absentDeduction} for{" "}
                      {selectedPayslip.absentDays} absent day{selectedPayslip.absentDays !== 1 ? "s" : ""}
                    </small>
                  )}
                </div>

                {/* Payment reference */}
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Payment Reference <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${touched.paymentRef && formErrors.paymentRef ? "is-invalid" : touched.paymentRef && !formErrors.paymentRef ? "is-valid" : ""}`}
                    placeholder="e.g. bank transfer ref, cheque number..."
                    value={paymentRef}
                    onChange={e => {
                      setPaymentRef(e.target.value);
                      setTouched(prev => ({ ...prev, paymentRef: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, paymentRef: true }))}
                  />
                  {touched.paymentRef && formErrors.paymentRef ? (
                    <div className="invalid-feedback">{formErrors.paymentRef}</div>
                  ) : (
                    <small className="">
                      Enter the reference from your bank transfer or payment method.
                    </small>
                  )}
                </div>

                {/* Receipt upload */}
                <div className="mb-1">
                  <label className="form-label fw-medium">
                    Upload Receipt / Proof of Payment
                    <span className=" fw-normal ms-1">(optional)</span>
                  </label>
                  <input
                    type="file"
                    className={`form-control ${touched.receiptFile && formErrors.receiptFile
                      ? "is-invalid"
                      : touched.receiptFile && receiptFile && !formErrors.receiptFile
                        ? "is-valid"
                        : ""
                      }`}
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                  />

                  {/* Error message */}
                  {touched.receiptFile && formErrors.receiptFile && (
                    <div className="invalid-feedback d-block">
                      {formErrors.receiptFile}
                    </div>
                  )}

                  {/* Success message — file selected and valid */}
                  {receiptFile && !formErrors.receiptFile && (
                    <small className="text-success d-block mt-1">
                      ✓ {receiptFile.name} ({(receiptFile.size / 1024 / 1024).toFixed(2)}MB)
                    </small>
                  )}

                  {/* Helper text — no file selected yet */}
                  {!receiptFile && !formErrors.receiptFile && (
                    <small className=" d-block mt-1">
                      Accepts JPG, PNG, WEBP or PDF · Max {MAX_FILE_SIZE_MB}MB
                    </small>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-dark" onClick={closeConfirmModal}>
                  <X size={16} className="me-1" /> Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                >
                  {confirming ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Confirming…</>
                  ) : (
                    <><CheckCircle size={16} className="me-1" />Confirm Payment</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View Receipt Modal ────────────────────────────────────────────── */}
      {receiptModal && receiptPayslip && (
        <div
          className="modal show fade"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title mb-0">Payslip</h5>
                  <small className="">
                    {receiptPayslip.employeeName} · {MONTHS[receiptPayslip.month - 1]} {receiptPayslip.year}
                  </small>
                </div>
                <button
                  className="btn-close"
                  onClick={() => { setReceiptModal(false); setReceiptPayslip(null); }}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td width="130"><strong>Employee:</strong></td>
                          <td>{receiptPayslip.employeeName}</td>
                        </tr>
                        <tr>
                          <td><strong>Amount:</strong></td>
                          <td className="text-success fw-bold">
                            {currency}{receiptPayslip.amountDue}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Reference:</strong></td>
                          <td>{receiptPayslip.paymentReference ?? "—"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td width="130"><strong>Date Paid:</strong></td>
                          <td>
                            {receiptPayslip.datePaid
                              ? new Date(receiptPayslip.datePaid).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                              : "—"}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Confirmed By:</strong></td>
                          <td>{receiptPayslip.paidByName ?? "—"}</td>
                        </tr>
                        <tr>
                          <td><strong>Period:</strong></td>
                          <td>{MONTHS[receiptPayslip.month - 1]} {receiptPayslip.year}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {receiptPayslip.paymentReceiptPath && (
                  <div className="border rounded p-2 text-center">
                    {receiptPayslip.paymentReceiptPath.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        src={`${BASE_URL}/${receiptPayslip.paymentReceiptPath}`}
                        style={{ width: '100%', height: '600px', border: '1px solid #dee2e6', borderRadius: '4px' }}
                        title="Resume"
                      />
                    ) : (
                      <div className="py-4">
                        <i className="ri-file-pdf-line fs-42 text-success d-block mb-2" />

                        <a
                          href={`${BASE_URL}/${receiptPayslip.paymentReceiptPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-success"
                        >
                          View Payslip
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-dark"
                  onClick={() => { setReceiptModal(false); setReceiptPayslip(null); }}
                >
                  <X size={16} className="me-1" /> Close
                </button>
                {receiptPayslip.paymentReceiptPath && (
                  <a
                    href={`${BASE_URL}/${receiptPayslip.paymentReceiptPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <i className="ri-download-2-line me-1" /> Download
                  </a>
                )}
              </div>
            </div>
          </div>
        </div >
      )}
    </div>
  );
};

export default Payment;