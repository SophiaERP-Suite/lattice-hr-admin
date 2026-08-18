import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
    AlertCircle, CheckCircle,
    Upload, Eye, X, Users, CalendarDays,
    Search
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllPayrollSummary, confirmPayslipPayment } from "../../api/PaymentApi";
import type { PayrollSummaryDto, PayslipDto } from "../../types/Payment";

const BASE_URL = import.meta.env.VITE_API_URL;

const fmtCurrency = (amount: number, currencyCode = "NGN") =>
    new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
    }).format(amount);

// ── Validation ────────────────────────────────────────────────────────────────

interface FormErrors {
    paymentRef?: string;
    receiptFile?: string;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const validateForm = (paymentRef: string, receiptFile: File | null): FormErrors => {
    const errors: FormErrors = {};

    if (!paymentRef.trim()) {
        errors.paymentRef = "Payment reference is required";
    } else if (paymentRef.trim().length < 3) {
        errors.paymentRef = "Reference must be at least 3 characters";
    } else if (paymentRef.trim().length > 200) {
        errors.paymentRef = "Reference must not exceed 200 characters";
    }

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

// ── Main ──────────────────────────────────────────────────────────────────────

const Payment = () => {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

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

    // View receipt modal
    const [receiptModal, setReceiptModal] = useState(false);
    const [receiptPayslip, setReceiptPayslip] = useState<PayslipDto | null>(null);

    // Generate available years (current year - 3 to current year + 1)
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 3; i <= currentYear + 1; i++) {
            years.push(i);
        }
        return years;
    }, []);

    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    useEffect(() => {
        loadSummary(1);
    }, [selectedMonth, selectedYear, statusFilter]);

    const loadSummary = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getAllPayrollSummary(
                selectedMonth,
                selectedYear,
                page,
                pagination.pageSize,
                statusFilter || undefined,
                search?.trim() || undefined
            );
            setSummary(data);
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

    const handleSearch = () => {
        loadSummary(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("");
        setSelectedMonth(now.getMonth() + 1);
        setSelectedYear(now.getFullYear());
    };

    const handleConfirmPayment = async (employerId: number) => {
        if (!selectedPayslip) return;

        setTouched({ paymentRef: true, receiptFile: true });

        const errors = validateForm(paymentRef, receiptFile);
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        setConfirming(true);
        try {
            await confirmPayslipPayment(selectedPayslip.payslipId, paymentRef, receiptFile, employerId);
            toast.success(`Payment confirmed for ${selectedPayslip.employeeName}`);
            closeConfirmModal();
            await loadSummary(pagination.page);
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

    const currencyCode = summary?.currencyCode ?? "NGN";

    return (
        <div className="app-content-wrap">
            <ToastContainer position="top-right" />
            <div className="container-fluid">
                <div className="row">

                    {/* Header */}
                    <div className="col-xl-12">
                        <div className="page-title-box d-flex-between flex-wrap gap-15">
                            <h1 className="page-title fs-18 lh-1 d-flex align-items-center gap-2">
                                <CalendarDays size={24} className="text-info" />
                                Payslips
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-example1 mb-0">
                                    <li className="breadcrumb-item active">Payslips</li>
                                    <li className="breadcrumb-item">
                                        <NavLink to="/dashboard">Home</NavLink>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    {/* Summary Cards - Hidden but kept for functionality */}
                    {summary && (
                        <div className="d-none">
                            <div className="col-xxl-3 col-xl-3 col-md-3 col-md-6">
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
                        </div>
                    )}

                    {/* Payment Table */}
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    {/* Search */}
                                    <div className="col-md-4">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Search employee..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                                        />
                                    </div>

                                    {/* Month Filter */}
                                    <div className="col-md-2">
                                        <select
                                            className="form-select w-100"
                                            style={{ width: 130 }}
                                            value={selectedMonth}
                                            onChange={e => setSelectedMonth(Number(e.target.value))}
                                        >
                                            {MONTHS.map((month, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Year Filter */}
                                    <div className="col-md-2">
                                        <select
                                            className="form-select w-100"
                                            style={{ width: 100 }}
                                            value={selectedYear}
                                            onChange={e => setSelectedYear(Number(e.target.value))}
                                        >
                                            {availableYears.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Status filter */}
                                    <div className="col-md-2">
                                        <select
                                            className="form-select w-100"
                                            style={{ width: 120 }}
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value)}
                                        >
                                            <option value="">All Status</option>
                                            <option value="0">Pending</option>
                                            <option value="1">Paid</option>
                                        </select>
                                    </div>

                                    {/* Clear Filters */}

                                    {(search || statusFilter || selectedMonth !== now.getMonth() + 1 || selectedYear !== now.getFullYear()) && (
                                        <div className="col-md-2 ">
                                            <button
                                                className="btn btn-warning w-100"
                                                onClick={handleClearFilters}
                                            >
                                                <X size={14} /> Clear
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div></div></div>


                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0 col-md-3">Employee Payslips</h5>

                            </div>

                            <div className="card-body pt-15">
                                {/* Month/Year indicator */}
                                <div className="alert alert-info bg-opacity-10 mb-3">
                                    <CalendarDays size={16} className="me-2" />
                                    Showing payslips for <strong>{MONTHS[selectedMonth - 1]} {selectedYear}</strong>
                                    {summary && (
                                        <span className="ms-2">
                                            · {summary.totalEmployees} employee{summary.totalEmployees !== 1 ? "s" : ""}
                                            · Total payroll: <strong>{fmtCurrency(summary.totalAmountDue, currencyCode)}</strong>
                                        </span>
                                    )}
                                </div>

                                {loading ? (
                                    <TableSkeleton />
                                ) : !summary || summary.payslips.length === 0 ? (
                                    <div className="text-center py-5">
                                        <AlertCircle size={48} className="mb-3 d-block mx-auto" />
                                        <h6>No payment data for {MONTHS[selectedMonth - 1]} {selectedYear}</h6>
                                        <p className="small mb-0">
                                            Payroll has not been generated yet for this period.
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
                                                        <td colSpan={7} className="text-center py-4">
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
                                                                            {p.absentDays} absent · −{fmtCurrency(p.absentDeduction, currencyCode)}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className="fw-bold text-success fs-5">
                                                                    {fmtCurrency(p.amountDue, currencyCode)}
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
                                                                    <span className="small">
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
                                                            {fmtCurrency(
                                                                filteredPayslips.reduce((s, p) => s + p.amountDue, 0),
                                                                currencyCode
                                                            )}
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
                                        <small>
                                            Showing {((pagination.page - 1) * pagination.pageSize) + 1}–
                                            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{" "}
                                            {pagination.totalCount} employees
                                        </small>
                                        <nav>
                                            <ul className="pagination mb-0">
                                                <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={() => loadSummary(pagination.page - 1)}>
                                                        Previous
                                                    </button>
                                                </li>
                                                {[...Array(pagination.totalPages)].map((_, i) => (
                                                    <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? "active" : ""}`}>
                                                        <button className="page-link" onClick={() => loadSummary(i + 1)}>
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={() => loadSummary(pagination.page + 1)}>
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
            </div>
            {/* Confirm Payment Modal */}
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
                                <div className="alert alert-info mb-4">
                                    <strong className="d-block">{selectedPayslip.employeeName}</strong>
                                    <small>
                                        {MONTHS[selectedPayslip.month - 1]} {selectedPayslip.year} ·{" "}
                                        {selectedPayslip.daysWorked}/{selectedPayslip.standardDays} days worked
                                    </small>
                                    <div className="mt-1">
                                        <strong className="text-success fs-5">
                                            {fmtCurrency(selectedPayslip.amountDue, currencyCode)}
                                        </strong>
                                    </div>
                                    {selectedPayslip.absentDays > 0 && (
                                        <small className="text-danger d-block mt-1">
                                            Includes deduction of {fmtCurrency(selectedPayslip.absentDeduction, currencyCode)} for{" "}
                                            {selectedPayslip.absentDays} absent day{selectedPayslip.absentDays !== 1 ? "s" : ""}
                                        </small>
                                    )}
                                </div>

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
                                        <small>Enter the reference from your bank transfer or payment method.</small>
                                    )}
                                </div>

                                <div className="mb-1">
                                    <label className="form-label fw-medium">
                                        Upload Receipt / Proof of Payment
                                        <span className="fw-normal ms-1">(optional)</span>
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
                                    {touched.receiptFile && formErrors.receiptFile && (
                                        <div className="invalid-feedback d-block">
                                            {formErrors.receiptFile}
                                        </div>
                                    )}
                                    {receiptFile && !formErrors.receiptFile && (
                                        <small className="text-success d-block mt-1">
                                            ✓ {receiptFile.name} ({(receiptFile.size / 1024 / 1024).toFixed(2)}MB)
                                        </small>
                                    )}
                                    {!receiptFile && !formErrors.receiptFile && (
                                        <small className="d-block mt-1">
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
                                    onClick={() => handleConfirmPayment(selectedPayslip.employerId)}
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

            {/* View Receipt Modal */}
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
                                    <small>
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
                                                    <td><strong>Amount Paid:</strong></td>
                                                    <td className="text-success fw-bold">
                                                        {fmtCurrency(receiptPayslip.amountDue, currencyCode)}
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
                                                    <td>Admin</td>
                                                    {/* <td>{receiptPayslip.paidByName ?? "—"}</td> */}
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
                                            <div className="py-4">
                                                <i className="ri-file-pdf-line fs-42 text-success d-block mb-2"></i>
                                                <a
                                                    href={`${BASE_URL}/${receiptPayslip.paymentReceiptPath}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-success"
                                                >
                                                    View Payslip
                                                </a>
                                            </div>
                                        ) : (
                                            <iframe
                                                src={`${BASE_URL}/${receiptPayslip.paymentReceiptPath}`}
                                                style={{ width: '100%', height: '600px', border: '1px solid #dee2e6', borderRadius: '4px' }}
                                                title="Payslip"
                                            />
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
                                        <i className="ri-download-2-line me-1"></i> Download
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;