import { useState, useEffect, useCallback } from "react";
import {
  FileCog2, X, CalendarDays, Search, ChevronLeft, ChevronRight,
  Building2, Users, Clock, DollarSign, CheckCircle, AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { createManualInvoice } from "../api/SalesOrderApi";
import { fmt, fmtNaira } from "../helpers/formatter";
import type { SalesOrderResponse } from "../types/salesOrder";
import type { Timesheet } from "../types/timesheet";

type PeriodType = "month" | "custom";

interface CompanySummary {
  employerId: number;
  employerName: string;
  timesheetIds: number[];
  workerCount: number;
  totalHours: number;
  totalAmount: number;
  timesheets: Timesheet[];
}

export interface InvoiceModalProps {
  show: boolean;
  onClose: () => void;
  preselected: Timesheet | null;
  approvedTimesheets: Timesheet[];
  onSuccess?: (invoice: SalesOrderResponse) => void;
}

const InvoiceModal = ({
  show,
  onClose,
  preselected,
  approvedTimesheets,
  onSuccess,
}: InvoiceModalProps) => {
  // Step management
  const [step, setStep] = useState<1 | 2>(1);

  // Period selection
  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Company selection
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Invoice details
  const [dueInDays, setDueInDays] = useState(14);
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Filter timesheets by period
  const filterTimesheetsByPeriod = useCallback((timesheets: Timesheet[]) => {
    if (periodType === "month") {
      const [year, month] = selectedMonth.split("-");
      return timesheets.filter(ts => {
        const tsDate = new Date(ts.periodStartDate);
        return tsDate.getFullYear() === parseInt(year) &&
          tsDate.getMonth() + 1 === parseInt(month);
      });
    } else {
      if (!customStart || !customEnd) return timesheets;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      return timesheets.filter(ts => {
        const tsDate = new Date(ts.periodStartDate);
        return tsDate >= start && tsDate <= end;
      });
    }
  }, [periodType, selectedMonth, customStart, customEnd]);

  // Group timesheets by company
  const groupByCompany = useCallback((timesheets: Timesheet[]): CompanySummary[] => {
    const companyMap = new Map<number, CompanySummary>();

    timesheets.forEach(ts => {
      if (!companyMap.has(ts.employerId)) {
        companyMap.set(ts.employerId, {
          employerId: ts.employerId,
          employerName: ts.employerName,
          timesheetIds: [],
          workerCount: 0,
          totalHours: 0,
          totalAmount: 0,
          timesheets: []
        });
      }

      const company = companyMap.get(ts.employerId)!;
      company.timesheetIds.push(ts.timesheetId);
      company.timesheets.push(ts);
      company.workerCount++;
      company.totalHours += ts.totalHours;
      company.totalAmount += ts.amountDue || 0;
    });

    return Array.from(companyMap.values());
  }, []);

  // Load companies based on selected period
  const loadCompanies = useCallback(() => {
    if (preselected) return; // Single mode doesn't need company list

    setLoadingCompanies(true);
    try {
      const filtered = filterTimesheetsByPeriod(approvedTimesheets);
      const companyList = groupByCompany(filtered);
      // Sort by total amount descending
      companyList.sort((a, b) => b.totalAmount - a.totalAmount);
      setCompanies(companyList);
      setCurrentPage(1);
      setSelectedCompanyIds(new Set());
    } finally {
      setLoadingCompanies(false);
    }
  }, [approvedTimesheets, filterTimesheetsByPeriod, groupByCompany, preselected]);

  // Reset when modal opens or period changes
  useEffect(() => {
    if (!show) return;

    if (preselected) {
      // Single mode - skip to step 2
      setStep(2);
    } else {
      // Bulk mode - start with period selection
      setStep(1);
      setSelectedCompanyIds(new Set());
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [show, preselected]);

  // Load companies when period is selected (step 1 complete)
  useEffect(() => {
    if (show && !preselected && step === 2) {
      loadCompanies();
    }
  }, [show, preselected, step, loadCompanies]);

  const handlePeriodContinue = () => {
    if (periodType === "custom" && (!customStart || !customEnd)) {
      toast.warning("Please select both start and end dates");
      return;
    }
    setStep(2);
  };

  const handlePeriodBack = () => {
    setStep(1);
    setCompanies([]);
    setSelectedCompanyIds(new Set());
  };

  const toggleCompany = (employerId: number) => {
    setSelectedCompanyIds(prev => {
      const next = new Set(prev);
      if (next.has(employerId)) {
        next.delete(employerId);
      } else {
        next.add(employerId);
      }
      return next;
    });
  };

  const toggleAllCompanies = () => {
    if (selectedCompanyIds.size === filteredCompanies.length) {
      setSelectedCompanyIds(new Set());
    } else {
      setSelectedCompanyIds(new Set(filteredCompanies.map(c => c.employerId)));
    }
  };

  const dueDateIso = (): string => {
    const d = new Date();
    d.setDate(d.getDate() + dueInDays);
    return d.toISOString().split("T")[0];
  };

  const validate = (): string | null => {
    if (!preselected && selectedCompanyIds.size === 0) {
      return "Please select at least one company.";
    }
    return null;
  };

  const handleGenerate = async () => {
    const err = validate();
    if (err) { toast.warning(err); return; }

    setSubmitting(true);
    try {
      if (preselected) {
        const invoice = await createManualInvoice({
          employerId: preselected.employerId,
          timesheetIds: [preselected.timesheetId],
          dueDate: dueDateIso(),
          currencyCode: "NGN",
          currencySymbol: "₦",
          defaultHourlyRate: 0,
          hourlyRates: {},
          // notes: invoiceNotes || undefined,
        });

        toast.success(`Invoice ${invoice.invoiceReference} created successfully`);
        onSuccess?.(invoice);
        onClose();
      } else {
        const selectedCompanies = companies.filter(c => selectedCompanyIds.has(c.employerId));

        const promises = selectedCompanies.map(company =>
          createManualInvoice({
            employerId: company.employerId,
            timesheetIds: company.timesheetIds,
            dueDate: dueDateIso(),
            currencyCode: "NGN",
            currencySymbol: "₦",
            defaultHourlyRate: 0,
            hourlyRates: {},
            taxRateId: 0,
            // notes: invoiceNotes || undefined,
          })
        );

        const results = await Promise.all(promises);

        toast.success(
          `${results.length} invoice${results.length > 1 ? "s" : ""} created for ${selectedCompanies.length} compan${selectedCompanies.length > 1 ? "ies" : "y"}`
        );

        if (results[0]) onSuccess?.(results[0]);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate invoice(s)";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter companies by search term
  const filteredCompanies = companies.filter(company =>
    (company.employerName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedCompanies = companies.filter(c => selectedCompanyIds.has(c.employerId));
  const totalWorkers = selectedCompanies.reduce((sum, c) => sum + c.workerCount, 0);
  const totalAmount = selectedCompanies.reduce((sum, c) => sum + c.totalAmount, 0);

  if (!show) return null;

  // Single mode (preselected)
  if (preselected) {
    return (
      <div
        className="modal show fade"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060,
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title mb-0 d-flex align-items-center gap-2">
                  <FileCog2 size={18} className="text-warning" />
                  Generate Invoice
                </h5>
                <small className="text-black">Single worker invoice</small>
              </div>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="alert alert-light border mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-medium">{preselected.employeeName}</span>
                    <small className="text-black ms-2">
                      {fmt(preselected.periodStartDate)} – {fmt(preselected.periodEndDate)}
                    </small>
                    <div className="mt-1">
                      <small className="text-black">{preselected.employerName}</small>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-label-success d-block mb-1">
                      {preselected.totalHours.toFixed(1)} hours
                    </span>
                    {preselected.amountDue && (
                      <span className="fw-bold text-success">
                        ₦{fmtNaira(preselected.amountDue)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Payment Due</label>
                  <select
                    className="form-select"
                    value={dueInDays}
                    onChange={(e) => setDueInDays(Number(e.target.value))}
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Invoice Notes (optional)</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Add notes to this invoice..."
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={onClose}>
                <X size={16} className="me-1" /> Cancel
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleGenerate}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <FileCog2 size={16} className="me-1" />
                )}
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bulk mode - Step 1: Period Selection
  if (step === 1) {
    return (
      <div
        className="modal show fade"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060,
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title mb-0 d-flex align-items-center gap-2">
                  <FileCog2 size={18} className="text-warning" />
                  Generate Invoices - Step 1 of 2
                </h5>
                <small className="text-black">Select the period for invoicing</small>
              </div>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-4">
                <label className="form-label fw-medium">Invoice Period</label>
                <div className="d-flex gap-3 mb-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="periodMonth"
                      checked={periodType === "month"}
                      onChange={() => setPeriodType("month")}
                    />
                    <label className="form-check-label" htmlFor="periodMonth">
                      Full Month
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="periodCustom"
                      checked={periodType === "custom"}
                      onChange={() => setPeriodType("custom")}
                    />
                    <label className="form-check-label" htmlFor="periodCustom">
                      Custom Range
                    </label>
                  </div>
                </div>

                {periodType === "month" ? (
                  <input
                    type="month"
                    className="form-control"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                ) : (
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Start date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="End date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="alert alert-info">
                <Clock size={16} className="me-2" />
                This will show all companies with approved timesheets in the selected period.
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={onClose}>
                <X size={16} className="me-1" /> Cancel
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handlePeriodContinue}
              >
                Continue <ChevronRight size={16} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bulk mode - Step 2: Company Selection
  return (
    <div
      className="modal show fade"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-0 d-flex align-items-center gap-2">
                <FileCog2 size={18} className="text-warning" />
                Generate Invoices - Step 2 of 2
              </h5>
              <small className="text-black">
                Period: {periodType === "month" ? selectedMonth : `${customStart} to ${customEnd}`}
              </small>
            </div>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* Search and Actions Bar */}
            <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
              <div className="position-relative" style={{ flex: 1, maxWidth: "300px" }}>
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-black" />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleAllCompanies}
                  disabled={filteredCompanies.length === 0}
                >
                  {selectedCompanyIds.size === filteredCompanies.length && filteredCompanies.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {/* Companies Table */}
            {loadingCompanies ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" />
                <p className="mt-2 text-black">Loading companies...</p>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle size={48} className="text-black mb-3" />
                <h6>No companies found</h6>
                <p className="text-black small">
                  {companies.length === 0
                    ? `No approved timesheets found for the selected period.`
                    : `No companies match "${searchTerm}"`}
                </p>
                {companies.length === 0 && (
                  <button
                    className="btn btn-sm btn-outline-warning mt-2"
                    onClick={handlePeriodBack}
                  >
                    ← Change Period
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "40px" }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedCompanyIds.size === filteredCompanies.length}
                            onChange={toggleAllCompanies}
                          />
                        </th>
                        <th>Company</th>
                        <th className="text-center">Workers</th>
                        <th className="text-center">Total Hours</th>
                        <th className="text-end">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCompanies.map((company) => (
                        <tr
                          key={company.employerId}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleCompany(company.employerId)}
                          className={selectedCompanyIds.has(company.employerId) ? "table-warning" : ""}
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedCompanyIds.has(company.employerId)}
                              onChange={() => toggleCompany(company.employerId)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Building2 size={16} className="text-black" />
                              <span className="fw-medium">{company.employerName}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-label-info">
                              <Users size={12} className="me-1" />
                              {company.workerCount}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-label-secondary">
                              <Clock size={12} className="me-1" />
                              {company.totalHours.toFixed(1)}h
                            </span>
                          </td>
                          <td className="text-end">
                            <span className="fw-bold text-success">
                              ₦{fmtNaira(company.totalAmount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-black">
                      Showing {((currentPage - 1) * itemsPerPage) + 1}–
                      {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length} companies
                    </small>
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>
                            <ChevronLeft size={16} />
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>
                            <ChevronRight size={16} />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}

            {/* Invoice Settings */}
            {selectedCompanyIds.size > 0 && (
              <>
                <hr className="my-4" />
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Payment Due</label>
                    <select
                      className="form-select"
                      value={dueInDays}
                      onChange={(e) => setDueInDays(Number(e.target.value))}
                    >
                      <option value={7}>7 days from now</option>
                      <option value={14}>14 days from now</option>
                      <option value={30}>30 days from now</option>
                      <option value={60}>60 days from now</option>
                    </select>
                    <small className="text-black">Due: {fmt(dueDateIso())}</small>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">
                      Invoice Notes <small className="text-black">(optional - applies to all invoices)</small>
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="e.g., Monthly invoice for staffing services"
                      value={invoiceNotes}
                      onChange={(e) => setInvoiceNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="border rounded p-3 mt-3">
                  <h6 className="mb-2">Summary</h6>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="d-flex justify-content-between">
                        <span className="text-black">Companies:</span>
                        <span className="fw-medium">{selectedCompanyIds.size}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex justify-content-between">
                        <span className="text-black">Total Workers:</span>
                        <span className="fw-medium">{totalWorkers}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex justify-content-between">
                        <span className="text-black">Total Amount:</span>
                        <span className="fw-bold text-success">₦{fmtNaira(totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-warning" onClick={handlePeriodBack}>
              <ChevronLeft size={16} className="me-1" /> Back
            </button>
            <button type="button" className="btn btn-dark" onClick={onClose}>
              <X size={16} className="me-1" /> Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleGenerate}
              disabled={submitting || selectedCompanyIds.size === 0}
            >
              {submitting ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <FileCog2 size={16} className="me-1" />
              )}
              Generate {selectedCompanyIds.size} Invoice{selectedCompanyIds.size !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;