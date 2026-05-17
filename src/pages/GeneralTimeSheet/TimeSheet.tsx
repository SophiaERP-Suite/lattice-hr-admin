import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, Filter, AlertCircle,
  MoreVertical, CheckCheck, X, CalendarDays, Timer, DollarSign,
  User, CircleDollarSign, FileCog2, Users
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import type { Timesheet, TimesheetPagedDto } from "../../types/timesheet";
import { fmt, fmtNaira, fmtTime } from "../../helpers/formatter";
import Modal from "../../components/modal";
import { getAllTimesheetsForAdmin, reviewTimesheet } from "../../api/TimesheetApi";
import InvoiceModal from "../../components/InvoiceModal"; // IMPORT THE INVOICE MODAL

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalType = "approve" | "reject" | null;
type StatusFilter = "" | "Draft" | "Submitted" | "Approved" | "Rejected";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

// ── Skeleton ──────────────────────────────────────────────────────────────────

const TimesheetSkeleton = () => (
  <div className="card">
    <div className="card-body">
      <div className="placeholder-glow">
        <div className="row g-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="d-flex align-center gap-16">
                <div className="avatar avatar-xl placeholder rounded-circle" />
                <div className="flex-grow-1">
                  <span className="placeholder col-8 mb-2" />
                  <h2 className="placeholder col-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <table className="table">
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <td key={col}><span className="placeholder col-12" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Timesheet["status"] }) => {
  const config = {
    Draft: { cls: "bg-label-secondary", Icon: Timer, text: "Draft" },
    Submitted: { cls: "bg-label-warning", Icon: Clock, text: "Submitted" },
    Approved: { cls: "bg-label-success", Icon: CheckCircle, text: "Approved" },
    Rejected: { cls: "bg-label-danger", Icon: XCircle, text: "Rejected" },
  };
  const { cls, Icon, text } = config[status] ?? config.Draft;
  return (
    <span className={`badge ${cls}`}>
      <Icon size={12} className="me-1" />{text}
    </span>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

function AllEmployeeTimesheets() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false); // STATE FOR INVOICE MODAL
  const [invoicePreselected, setInvoicePreselected] = useState<Timesheet | null>(null); // FOR SINGLE MODE
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1, pageSize: 10, totalCount: 0, totalPages: 1,
  });

  const handleStatusFilterChange = (val: StatusFilter) => {
    setStatusFilter(val);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchAllTimesheets(pagination.page);
  }, [statusFilter, pagination.page, search]);

  const fetchAllTimesheets = async (page: number) => {
    setLoading(true);
    try {
      const response: TimesheetPagedDto = await getAllTimesheetsForAdmin(
        page,
        pagination.pageSize,
        statusFilter || undefined,
        search || undefined,
      );

      console.log("res ==> ", response)
      if (response?.items) {
        setTimesheets(response.items);
        setPagination(prev => ({
          ...prev,
          page: response.page,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
      toast.error("Failed to load timesheets");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (timesheetId: number, action: "approved" | "rejected") => {
    setModalLoading(true);
    setProcessingId(timesheetId);
    try {
      const res = await reviewTimesheet(
        timesheetId,
        action === "approved" ? "Approved" : "Rejected",
        reviewNotes || undefined,
      );
      if (res.ok) {
        toast.success(`Timesheet ${action} successfully`);
        await fetchAllTimesheets(pagination.page);
        setShowDetailModal(false);
        setSelectedTimesheet(null);
        setReviewNotes("");
      }
    } catch (error) {
      console.error("Failed to review timesheet:", error);
      toast.error("Failed to update timesheet");
    } finally {
      setProcessingId(null);
      setModalLoading(false);
      setModalType(null);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTimesheet(null);
    setReviewNotes("");
  };

  const approvedTimesheets = useMemo(
    () => timesheets.filter(t => t.status === "Approved"),
    [timesheets]
  );

  const stats = useMemo(() => ({
    total: pagination.totalCount,
    submitted: timesheets.filter(t => t.status === "Submitted").length,
    approved: timesheets.filter(t => t.status === "Approved").length,
    rejected: timesheets.filter(t => t.status === "Rejected").length,
  }), [timesheets, pagination.totalCount]);

  const handleInvoiceSuccess = (invoice: any) => {
    console.log("Invoice created successfully:", invoice);
    toast.success(`Invoice ${invoice.invoiceReference} created successfully`);
  };

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">
        <ToastContainer />

        {/* ── Approve Modal ── */}
        <Modal
          isOpen={modalType === "approve"}
          title="Approve Timesheet"
          message="Are you sure you want to approve this timesheet? This action cannot be undone."
          confirmText="Approve"
          cancelText="Cancel"
          confirmColor="success"
          buttonIcon={<CheckCheck size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={modalLoading}
          onConfirm={() => { if (selectedTimesheet) handleReview(selectedTimesheet.timesheetId, "approved"); }}
          onCancel={() => { setModalType(null); setSelectedTimesheet(null); }}
        />

        {/* ── Reject Modal ── */}
        <Modal
          isOpen={modalType === "reject"}
          title="Reject Timesheet"
          message="Are you sure you want to reject this timesheet? This action cannot be undone."
          confirmText="Reject"
          cancelText="Cancel"
          confirmColor="danger"
          buttonIcon={<XCircle size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={modalLoading}
          onConfirm={() => { if (selectedTimesheet) handleReview(selectedTimesheet.timesheetId, "rejected"); }}
          onCancel={() => { setModalType(null); setSelectedTimesheet(null); }}
        />

        {/* ── INVOICE MODAL ── */}
        <InvoiceModal
          show={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoicePreselected(null);
          }}
          preselected={invoicePreselected}
          approvedTimesheets={approvedTimesheets}
          onSuccess={handleInvoiceSuccess}
        />

        {/* Header */}
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1 d-flex align-items-center gap-2">
                <User size={24} className="text-info" />
                General Timesheets
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">
                    <NavLink to="/Timesheet">General Timesheets</NavLink>
                  </li>
                  <li className="breadcrumb-item">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-2">
          {[
            { label: "Total", value: stats.total, color: "info", Icon: CalendarDays },
            { label: "Submitted", value: stats.submitted, color: "warning", Icon: Clock },
            { label: "Approved", value: stats.approved, color: "success", Icon: CheckCircle },
            { label: "Rejected", value: stats.rejected, color: "danger", Icon: XCircle },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className={`avatar avatar-xl bg-${color}-transparent text-${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">{label}</span>
                    <h2 className="mb-5">{value}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="row mb-2">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      placeholder="Search employer or employee…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => handleStatusFilterChange(e.target.value as StatusFilter)}
                    >
                      <option value="">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-info w-100"
                      onClick={() => { setSearch(""); handleStatusFilterChange(""); }}
                    >
                      <Filter size={16} className="me-1" /> Clear Filters
                    </button>
                  </div>
                  <div className="col-md-2">
                    <NavLink className="btn btn-success w-100" to="/payslips">
                      <CircleDollarSign size={16} className="me-1" /> All Payslips
                    </NavLink>
                  </div>
                  {/* Bulk invoice button — only shown when approved timesheets exist */}
                  {approvedTimesheets.length > 0 && (
                    <div className="col-md-2">
                      <button
                        className="btn btn-warning w-100"
                        onClick={() => {
                          setInvoicePreselected(null); // null = bulk mode
                          setShowInvoiceModal(true); // OPEN INVOICE MODAL
                        }}
                      >
                        <FileCog2 size={16} className="me-1" />
                        Bulk Invoice ({approvedTimesheets.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Records</h5>
                <small className="text-muted">
                  Showing {timesheets.length} of {pagination.totalCount} record{pagination.totalCount !== 1 ? "s" : ""}
                </small>
              </div>
              <div className="card-body mt-15">
                {loading ? <TimesheetSkeleton /> : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Period</th>
                            <th>Regular Hrs</th>
                            <th>Total Hrs</th>
                            <th>Est. Amount Due</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timesheets.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center py-5 text-muted">
                                <AlertCircle size={40} className="mb-3 d-block mx-auto" />
                                <h6>No timesheets found</h6>
                                <p className="small mb-0">Try adjusting your filters</p>
                              </td>
                            </tr>
                          ) : (
                            timesheets.map((ts) => (
                              <tr key={ts.timesheetId}>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <img
                                      src={`${BASE_URL}${ts.employeeAvatar}`}
                                      alt={ts.employeeName}
                                      className="img-fluid rounded-circle"
                                      width="30"
                                      height="30"
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                    <div>
                                      <div className="fw-medium">{ts.employeeName}</div>
                                      <small className="text-muted">{ts.employerName}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>{fmt(ts.periodStartDate)}</div>
                                  <small className="text-muted">to {fmt(ts.periodEndDate)}</small>
                                </td>
                                <td>
                                  <span className="badge bg-label-info">
                                    {ts.totalRegularHrs.toFixed(1)}h
                                  </span>
                                </td>
                                <td>
                                  <span className="fw-medium">{ts.totalHours.toFixed(1)}h</span>
                                </td>
                                <td>
                                  {ts.amountDue != null ? (
                                    <div>
                                      <span className="fw-medium text-success">
                                        {ts.currencyCode} {fmtNaira(ts.amountDue)}
                                      </span>
                                      {(ts.absentDays ?? 0) > 0 && (
                                        <div>
                                          <small className="text-danger">
                                            -{ts.currencyCode} {fmtNaira(ts.absentDeduction ?? 0)} ({ts.absentDays} absent)
                                          </small>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted small">—</span>
                                  )}
                                </td>
                                <td><StatusBadge status={ts.status} /></td>
                                <td>
                                  <div>{fmt(ts.dateCreated)}</div>
                                </td>
                                <td className="text-end">
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      disabled={processingId === ts.timesheetId}
                                    >
                                      {processingId === ts.timesheetId
                                        ? <span className="spinner-border spinner-border-sm" />
                                        : <MoreVertical size={16} />}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={() => { setSelectedTimesheet(ts); setShowDetailModal(true); }}
                                        >
                                          <CalendarDays size={15} className="text-info" /> View Details
                                        </button>
                                      </li>
                                      {ts.status === "Submitted" && (
                                        <>
                                          <li><hr className="dropdown-divider" /></li>
                                          <li>
                                            <button
                                              className="dropdown-item d-flex align-items-center gap-2"
                                              onClick={() => { setSelectedTimesheet(ts); setModalType("approve"); }}
                                            >
                                              <CheckCheck size={15} className="text-success" /> Approve
                                            </button>
                                          </li>
                                          <li>
                                            <button
                                              className="dropdown-item d-flex align-items-center gap-2"
                                              onClick={() => { setSelectedTimesheet(ts); setModalType("reject"); }}
                                            >
                                              <XCircle size={15} className="text-danger" /> Reject
                                            </button>
                                          </li>
                                        </>
                                      )}
                                      {ts.status === "Approved" && (
                                        <>
                                          <li><hr className="dropdown-divider" /></li>
                                          <li>
                                            <button
                                              className="dropdown-item d-flex align-items-center gap-2"
                                              onClick={() => {
                                                setInvoicePreselected(ts); // Set for single mode
                                                setShowInvoiceModal(true); // OPEN INVOICE MODAL
                                              }}
                                            >
                                              <FileCog2 size={15} className="text-warning" /> Generate Invoice
                                            </button>
                                          </li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <small className="text-muted">
                          Showing {((pagination.page - 1) * pagination.pageSize) + 1}–
                          {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{" "}
                          {pagination.totalCount} entries
                        </small>
                        <nav>
                          <ul className="pagination mb-0">
                            <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                              <button className="page-link"
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>
                                Previous
                              </button>
                            </li>
                            {[...Array(pagination.totalPages)].map((_, i) => (
                              <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? "active" : ""}`}>
                                <button className="page-link"
                                  onClick={() => setPagination(p => ({ ...p, page: i + 1 }))}>
                                  {i + 1}
                                </button>
                              </li>
                            ))}
                            <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                              <button className="page-link"
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── (keeping your existing detail modal) */}
      {showDetailModal && selectedTimesheet && (
        <div
          className="modal show fade"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div className="modal-content">
              <div className="modal-header pb-0">
                <div>
                  <h5 className="modal-title mb-0">Timesheet Detail</h5>
                  <small className="text-muted">Employee time tracking</small>
                </div>
                <button type="button" className="btn-close" onClick={closeDetailModal} />
              </div>

              <div className="modal-body">
                {/* Employee & period info */}
                <div className="row g-3 mb-2">
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td width="130"><strong>EMPLOYEE:</strong></td>
                          <td>{selectedTimesheet.employeeName}</td>
                        </tr>
                        <tr>
                          <td><strong>SUPERVISOR:</strong></td>
                          <td>{selectedTimesheet.approverName || "—"}</td>
                        </tr>
                        <tr>
                          <td><strong>STATUS:</strong></td>
                          <td><StatusBadge status={selectedTimesheet.status} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td width="130"><strong>PERIOD:</strong></td>
                          <td>{fmt(selectedTimesheet.periodStartDate)} — {fmt(selectedTimesheet.periodEndDate)}</td>
                        </tr>
                        <tr>
                          <td><strong>DAYS WORKED:</strong></td>
                          <td>
                            {selectedTimesheet.daysWorked ?? "—"} / {selectedTimesheet.standardDays ?? "—"} scheduled
                            {(selectedTimesheet.absentDays ?? 0) > 0 && (
                              <span className="badge bg-label-danger ms-2">
                                {selectedTimesheet.absentDays} absent
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>TOTAL HOURS:</strong></td>
                          <td>
                            <span className="badge bg-label-info">
                              {selectedTimesheet.totalHours.toFixed(1)}h
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hours summary cards */}
                <div className="row g-3 mb-2">
                  {[
                    { label: "Regular Hours", value: selectedTimesheet.totalRegularHrs, color: "info" },
                    { label: "Overtime Hours", value: selectedTimesheet.totalOvertimeHrs, color: "warning" },
                    { label: "Total Hours", value: selectedTimesheet.totalHours, color: "dark" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="col-md-4">
                      <div className="card border">
                        <div className="card-body p-3 text-center">
                          <small className="d-block mb-1 text-muted">{label}</small>
                          <h3 className={`mb-0 text-${color}`}>{value.toFixed(1)}h</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daily lines table */}
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>Finish Time</th>
                        <th>Regular Hrs</th>
                        <th>Overtime</th>
                        <th>Total Hours</th>
                        <th>Time-off</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTimesheet.lines.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center text-muted py-4">No daily records found</td>
                        </tr>
                      ) : (
                        selectedTimesheet.lines.map((line) => (
                          <tr
                            key={line.lineId}
                            className={
                              line.isHoliday ? "table-warning bg-opacity-10" :
                                line.isLeaveDay ? "table-info bg-opacity-10" : ""
                            }
                          >
                            <td>
                              <div>{fmt(line.workDate)}</div>
                              <small className="text-muted">{line.dayName}</small>
                            </td>
                            <td>{fmtTime(line.clockIn)}</td>
                            <td>{fmtTime(line.clockOut)}</td>
                            <td className={line.regularHrs > 0 ? "fw-medium" : "text-muted"}>
                              {line.regularHrs > 0 ? `${line.regularHrs.toFixed(1)}h` : "—"}
                            </td>
                            <td>
                              {line.overtimeHrs > 0 ? (
                                <span className="badge bg-label-warning">{line.overtimeHrs.toFixed(1)}h</span>
                              ) : "—"}
                            </td>
                            <td>
                              <span className="fw-medium badge bg-info bg-opacity-10">
                                {line.totalHrs.toFixed(1)}h
                              </span>
                            </td>
                            <td>
                              {line.isHoliday
                                ? <span className="badge bg-label-warning">Holiday</span>
                                : line.isLeaveDay
                                  ? <span className="badge bg-label-info">{line.leaveType ?? "Leave"}</span>
                                  : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {selectedTimesheet.lines.length > 0 && (
                      <tfoot className="table-light fw-bold">
                        <tr>
                          <td colSpan={3} className="text-end text-uppercase">Total Hours</td>
                          <td>{selectedTimesheet.totalRegularHrs.toFixed(1)}h</td>
                          <td>{selectedTimesheet.totalOvertimeHrs.toFixed(1)}h</td>
                          <td>{selectedTimesheet.totalHours.toFixed(1)}h</td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>

                {/* Amount summary */}
                {selectedTimesheet.amountDue != null && (
                  <div className="d-flex justify-content-end mt-2">
                    <div className="p-2 rounded" style={{ maxWidth: "400px" }}>
                      <small className="text-muted d-flex justify-content-between">
                        <span>Regular rate:</span>
                        <span className="fw-medium ms-3">
                          {selectedTimesheet.currencyCode} {fmtNaira(
                            selectedTimesheet.dailyRate && selectedTimesheet.dailyHours
                              ? selectedTimesheet.dailyRate / selectedTimesheet.dailyHours
                              : 0
                          )}/hr
                        </span>
                      </small>
                      {(selectedTimesheet.absentDays ?? 0) > 0 && (
                        <small className="text-danger d-flex justify-content-between">
                          <span>Absent deduction:</span>
                          <span className="fw-medium ms-3">
                            − {selectedTimesheet.currencyCode} {fmtNaira(selectedTimesheet.absentDeduction ?? 0)}
                          </span>
                        </small>
                      )}
                      <div className="d-flex justify-content-between mt-1 border-top pt-1">
                        <span className="fw-medium">Amount Due:</span>
                        <span className="fw-bold text-success ms-3">
                          {selectedTimesheet.currencyCode} {fmtNaira(selectedTimesheet.amountDue)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review notes (only for Submitted) */}
                {selectedTimesheet.status === "Submitted" && (
                  <div className="mt-4 p-3 rounded border">
                    <label className="form-label fw-medium">Review Notes (optional)</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Add notes before approving or rejecting..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </div>
                )}

                {/* Approval status banner */}
                {selectedTimesheet.status === "Approved" && selectedTimesheet.approverName && (
                  <div className="alert alert-success mt-4 mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        ✓ Approved by <strong>{selectedTimesheet.approverName}</strong>
                        {selectedTimesheet.dateApproved && ` on ${fmt(selectedTimesheet.dateApproved)}`}
                      </span>
                      <span className="badge bg-success">Approved</span>
                    </div>
                  </div>
                )}

                {selectedTimesheet.status === "Rejected" && (
                  <div className="alert alert-danger mt-4 mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        ✗ Rejected
                        {selectedTimesheet.approverName && <> by <strong>{selectedTimesheet.approverName}</strong></>}
                        {selectedTimesheet.dateApproved && ` on ${fmt(selectedTimesheet.dateApproved)}`}
                      </span>
                      <span className="badge bg-danger">Rejected</span>
                    </div>
                    {selectedTimesheet.notes && (
                      <p className="mb-0 mt-2 small"><strong>Reason:</strong> {selectedTimesheet.notes}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-dark" onClick={closeDetailModal}>
                  <X size={16} className="me-1" /> Close
                </button>
                {selectedTimesheet.status === "Submitted" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleReview(selectedTimesheet.timesheetId, "rejected")}
                      disabled={processingId === selectedTimesheet.timesheetId}
                    >
                      {processingId === selectedTimesheet.timesheetId
                        ? <span className="spinner-border spinner-border-sm me-2" />
                        : <XCircle size={16} className="me-1" />}
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleReview(selectedTimesheet.timesheetId, "approved")}
                      disabled={processingId === selectedTimesheet.timesheetId}
                    >
                      {processingId === selectedTimesheet.timesheetId
                        ? <span className="spinner-border spinner-border-sm me-2" />
                        : <CheckCheck size={16} className="me-1" />}
                      Approve
                    </button>
                  </>
                )}
                {selectedTimesheet.status === "Approved" && (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      setInvoicePreselected(selectedTimesheet);
                      setShowDetailModal(false);
                      setShowInvoiceModal(true); // OPEN INVOICE MODAL FROM DETAIL MODAL
                    }}
                  >
                    <FileCog2 size={16} className="me-1" /> Generate Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllEmployeeTimesheets;