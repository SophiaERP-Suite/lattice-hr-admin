import { useState, useEffect, useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, Filter, AlertCircle,
  MoreVertical, CheckCheck, X, CalendarDays, Timer, DollarSign,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import Hashids from "hashids";
import { toast, ToastContainer } from "react-toastify";
import { getAllTimesheets, reviewTimesheet } from "../../api/TimesheetApi";
import Modal from "../../components/modal";
import { fmt, fmtNaira, fmtTime } from "../../helpers/formatter";
import type { Timesheet, TimesheetPagedDto } from "../../types/timesheet";


type ModalType = "approve" | "reject" | null;

const STATUS_OPTIONS = ["", "Draft", "Submitted", "Approved", "Rejected"] as const;
type StatusFilter = typeof STATUS_OPTIONS[number];

// ── Skeleton ────

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

// ── Status Badge ──────

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

// ── Pay Breakdown ──────

const PayBreakdown = ({ ts }: { ts: Timesheet }) => {
  if (ts.monthlySalary == null) return null;

  const hourlyRate = ts.dailyRate && ts.standardDays
    ? (ts.monthlySalary / (ts.standardDays * ts.dailyHours))
    : null;

  return (
    <div className="card border mt-4" style={{ display: "none" }} >
      <div className="card-header py-2">
        <h6 className="mb-0 d-flex align-items-center gap-2">
          <DollarSign size={16} className="text-success" />
          Payroll Calculation
          <span className="badge bg-label-info ms-2 fw-normal">
            Based on {ts.standardDays ?? "—"} scheduled days
          </span>
        </h6>
      </div>
      <div className="card-body p-0">
        {/* Hourly Rate Information */}
        {hourlyRate && (
          <div className="px-3 pt-3 pb-2 border-bottom bg-opacity-25">
            <div className="row align-items-center">
              <div className="col-md-6">
                <small className="text-muted d-block">HOURLY RATE (Regular)</small>
                <span className="fw-medium fs-5">{fmtNaira(hourlyRate)}</span>
              </div>
              {/* <div className="col-md-6">
                <small className="text-muted d-block">OVERTIME RATE</small>
                <span className="fw-medium fs-5 text-warning">{fmtNaira(hourlyRate * 1.5)}</span>
                <small className="text-muted ms-2">(1.5x)</small>
              </div> */}
            </div>
          </div>
        )}

        {/* Detailed Pay Calculation Table - Matching Excel Format */}
        <table className="table table-sm mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-3">Category</th>
              <th className="text-center">Hours</th>
              <th className="text-center">Rate</th>
              <th className="text-end pe-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Regular Hours */}
            <tr>
              <td className="ps-3">Regular Hours</td>
              <td className="text-center">
                <span className="badge bg-label-primary">{ts.totalRegularHrs.toFixed(1)}h</span>
              </td>
              <td className="text-center">{fmtNaira(ts.dailyRate ? ts.dailyRate / ts.dailyHours : 0)}</td>
              <td className="text-end pe-3 fw-medium">
                {/* {fmtNaira(ts.regularPay || 0)} */}

              </td>
            </tr>

            {/* Overtime Hours */}
            {ts.totalOvertimeHrs > 0 && (
              <tr>
                <td className="ps-3">Overtime Hours</td>
                <td className="text-center">
                  <span className="badge bg-label-warning">{ts.totalOvertimeHrs.toFixed(1)}h</span>
                </td>
                <td className="text-center">{fmtNaira((ts.dailyRate ? ts.dailyRate / ts.dailyHours : 0) * 1.5)}</td>
                <td className="text-end pe-3 fw-medium text-warning">
                  {/* {fmtNaira(ts.overtimePay || 0)} */}
                </td>
              </tr>
            )}

            {/* Monthly Salary Base */}
            <tr className="border-top">
              <td className="ps-3 fw-medium">Monthly Base Salary</td>
              <td className="text-center">—</td>
              <td className="text-center">—</td>
              <td className="text-end pe-3 fw-medium">{fmtNaira(ts.monthlySalary)}</td>
            </tr>

            {/* Daily Rate Breakdown */}
            <tr>
              <td className="ps-3 text-muted">
                Daily Rate
                <small className="ms-1">(÷ {ts.standardDays} days)</small>
              </td>
              <td className="text-center text-muted">—</td>
              <td className="text-center text-muted">{fmtNaira(ts.dailyRate)}</td>
              <td className="text-end pe-3 text-muted">—</td>
            </tr>

            {/* Absent Deduction */}
            {(ts.absentDays ?? 0) > 0 && (
              <tr>
                <td className="ps-3 text-danger">
                  Absent Deduction
                  <small className="ms-1">
                    ({ts.absentDays} day{ts.absentDays !== 1 ? "s" : ""})
                  </small>
                </td>
                <td className="text-center text-danger">—</td>
                <td className="text-center text-danger">{fmtNaira(ts.dailyRate)}</td>
                <td className="text-end pe-3 text-danger">
                  − {fmtNaira(ts.absentDeduction || 0)}
                </td>
              </tr>
            )}

            {/* Final Amount Due */}
            <tr className="table-success border-top border-2">
              <td className="ps-3 fw-bold fs-6">AMOUNT DUE THIS PERIOD</td>
              <td className="text-center">—</td>
              <td className="text-center">—</td>
              <td className="text-end pe-3 fw-bold fs-5 text-success">
                {fmtNaira(ts.amountDue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Employee Signature Section - Matching Excel */}
      {(ts.status === "Approved" || ts.status === "Submitted") && (
        <div className="card-footer bg-white">
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <div className="border-top pt-2 mt-2" style={{ width: "200px" }}>
                <small className="text-muted d-block">EMPLOYEE SIGNATURE</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="border-top pt-2 mt-2">
                <small className="text-muted d-block">DATE</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-end">
                <small className="text-muted d-block">TOTAL PAY</small>
                <span className="fw-bold fs-5 text-success">{fmtNaira(ts.amountDue)}</span>
              </div>
            </div>
          </div>

          {ts.status === "Approved" && ts.approverName && (
            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <div className="border-top pt-2">
                  <small className="text-muted d-block">SUPERVISOR SIGNATURE</small>
                  <span className="fw-medium">{ts.approverName}</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="border-top pt-2">
                  <small className="text-muted d-block">DATE</small>
                  <span>{ts.dateApproved ? fmt(ts.dateApproved) : "—"}</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-end pt-2">
                  <small className="text-muted d-block">TOTAL HOURS</small>
                  <span className="fw-medium">{ts.totalHours.toFixed(1)}h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Note - Matching Excel */}
      <div className="card-footer py-2">
        <small className="text-muted d-flex align-items-center gap-1">
          <Clock size={12} />
          Regular hours are used to calculate Overtime hours. Cells with non-white background are automatically calculated.
        </small>
      </div>
    </div>
  );
};

// ── Main ───────────────

function EmployerTimesheets() {
  const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
  const { clientId } = useParams();

  const decodedEmployerId = useMemo(() => {
    if (!clientId) return null;
    const decoded = hashIds.decode(String(clientId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [clientId]);

  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
    if (decodedEmployerId) {
      fetchTimesheets(pagination.page);
    }

    console.log("emp id", decodedEmployerId)
  }, [statusFilter, pagination.page, decodedEmployerId]);

  const fetchTimesheets = async (page: number) => {
    setLoading(true);
    try {
      const response: TimesheetPagedDto = await getAllTimesheets(
        page, pagination.pageSize, statusFilter || undefined, Number(decodedEmployerId));

      console.log("res ttt", response)
      if (response?.items) {
        setTimesheets(response.items);
        setPagination(prev => ({
          ...prev,
          page: response.page,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
          decodedEmployerId
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
        Number(decodedEmployerId)
      );
      if (res.ok) {
        toast.success(`Timesheet ${action} successfully`);
        await fetchTimesheets(pagination.page);
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

  const filteredTimesheets = useMemo(() =>
    timesheets.filter(t =>
      !search || t.employeeName.toLowerCase().includes(search.toLowerCase())
    ),
    [timesheets, search]
  );

  const stats = useMemo(() => ({
    total: pagination.totalCount,
    submitted: timesheets.filter(t => t.status === "Submitted").length,
    approved: timesheets.filter(t => t.status === "Approved").length,
    rejected: timesheets.filter(t => t.status === "Rejected").length,
  }), [timesheets, pagination.totalCount]);

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">
        <ToastContainer />

        {/* Approve Modal */}
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

        {/* Reject Modal */}
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

        {/* Header */}
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1">
                Timesheets
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">General Timesheet</li>

                  <ChevronRight size={15} style={{ position: "relative", top: "3px" }} />
                  <li className="breadcrumb-item">
                    <NavLink to={`/ClientMgt/${clientId}`}>Client Mgt</NavLink>
                  </li>

                  <ChevronRight size={15} style={{ position: "relative", top: "3px" }} />
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Dashboard</NavLink></li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          {[
            { label: "Total", value: stats.total, color: "primary", Icon: CalendarDays },
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
        <div className="row mb-4">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-3 align-items-center">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search employee..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
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
                    <NavLink className="btn btn-success w-100" to={`/ClientMgt/TimeOffRequests/${clientId}`}>
                      <CalendarCheck size={16} className="me-1" /> Time-Off
                    </NavLink>
                  </div>
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
                <h5 className="mb-0">General Timesheets</h5>
                <small className="text-muted">
                  Showing {filteredTimesheets.length} of {pagination.totalCount} record{pagination.totalCount !== 1 ? "s" : ""}
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
                            <th>Overtime Hrs</th>
                            <th>Total Hrs</th>
                            <th>Est. Amount Due</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTimesheets.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="text-center py-5 text-muted">
                                <AlertCircle size={40} className="mb-3 d-block mx-auto" />
                                <h6>No timesheets found</h6>
                                <p className="small mb-0">Try adjusting your filters</p>
                              </td>
                            </tr>
                          ) : (
                            filteredTimesheets.map((ts) => (
                              <tr key={ts.timesheetId}>
                                <td>
                                  <span className="fw-medium"><NavLink to={`/ClientMgt/Timesheet/${hashIds.encode(ts.jobSeekerId.toString())}/${ts.employeeName}/${clientId}`}>{ts.employeeName}</NavLink></span>
                                </td>
                                <td>
                                  <div>{fmt(ts.periodStartDate)}</div>
                                  <small className="text-muted">to {fmt(ts.periodEndDate)}</small>
                                </td>
                                <td>
                                  <span className="badge bg-label-primary">
                                    {ts.totalRegularHrs.toFixed(1)}h
                                  </span>
                                </td>
                                <td>
                                  {ts.totalOvertimeHrs > 0 ? (
                                    <span className="badge bg-label-warning">
                                      {ts.totalOvertimeHrs.toFixed(1)}h
                                    </span>
                                  ) : <span className="text-muted">—</span>}
                                </td>
                                <td>
                                  <span className="fw-medium">{ts.totalHours.toFixed(1)}h</span>
                                </td>

                                {/* Amount due column */}
                                <td>
                                  {ts.amountDue != null ? (
                                    <div>
                                      <span className="fw-medium text-success">
                                        {ts.currencySymbol} {fmtNaira(ts.amountDue)}
                                      </span>
                                      {(ts.absentDays ?? 0) > 0 && (
                                        <div>
                                          <small className="text-danger">
                                            -{ts.currencySymbol}{fmtNaira(ts.absentDeduction)} ({ts.absentDays} absent)
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

      {/* ── Detail Modal ───── */}
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
                <div className="row g-3 mb-4">
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
                          <td>
                            {fmt(selectedTimesheet.periodStartDate)} — {fmt(selectedTimesheet.periodEndDate)}
                          </td>
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
                            <span className="badge bg-label-primary">
                              {selectedTimesheet.totalHours.toFixed(1)}h
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hours summary cards */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="card border">
                      <div className="card-body p-3 text-center">
                        <small className="d-block mb-1 text-muted">Regular Hours</small>
                        <h3 className="mb-0 text-primary">
                          {selectedTimesheet.totalRegularHrs.toFixed(1)}h
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border">
                      <div className="card-body p-3 text-center">
                        <small className="d-block mb-1 text-muted">Overtime Hours</small>
                        <h3 className="mb-0 text-warning">
                          {selectedTimesheet.totalOvertimeHrs.toFixed(1)}h
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border">
                      <div className="card-body p-3 text-center">
                        <small className="d-block mb-1 text-muted">Total Hours</small>
                        <h3 className="mb-0 text-dark">
                          {selectedTimesheet.totalHours.toFixed(1)}h
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily lines table */}
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>DATE</th>
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
                          <td colSpan={7} className="text-center text-muted py-4">
                            No daily records found
                          </td>
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
                                <span className="badge bg-label-warning">
                                  {line.overtimeHrs.toFixed(1)}h
                                </span>
                              ) : "—"}
                            </td>
                            <td>
                              <span className="fw-medium badge bg-primary bg-opacity-10">
                                {line.totalHrs.toFixed(1)}h
                              </span>
                            </td>
                            <td>
                              {line.isHoliday
                                ? <span className="badge bg-label-warning">Holiday</span>
                                : line.isLeaveDay
                                  ? <span className="badge bg-label-info">
                                    {line.leaveType ?? "Leave"}
                                  </span>
                                  : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                    {/* TOTALS SECTION WITH PAY */}
                    {selectedTimesheet.lines.length > 0 && (
                      <>
                        {/* Hours Totals Row */}
                        <tfoot className="table-light fw-bold">
                          <tr>
                            <td colSpan={3} className="text-end text-uppercase">TOTAL HOURS</td>
                            <td>{selectedTimesheet.totalRegularHrs.toFixed(1)}h</td>
                            <td>{selectedTimesheet.totalOvertimeHrs.toFixed(1)}h</td>
                            <td>{selectedTimesheet.totalHours.toFixed(1)}h</td>
                            <td />
                          </tr>
                        </tfoot>

                        {/* PAY TOTALS ROW - This is what you wanted! */}
                        {selectedTimesheet.amountDue != null && (
                          <tfoot className="table-success" style={{ borderTop: "2px solid #dee2e6" }}>
                            <tr>
                              <td colSpan={3} className="text-end text-uppercase">
                                TOTAL PAY
                              </td>
                              <td>
                                <span className="fw-medium text-success">
                                  {selectedTimesheet.currencySymbol} {fmtNaira(
                                    (selectedTimesheet.monthlySalary ?? 0)
                                  )}
                                </span>
                                <small className="text-muted d-block">Regular</small>
                              </td>
                              <td>
                                {selectedTimesheet.totalOvertimeHrs > 0 ? (
                                  <span className="fw-medium text-warning">
                                    {selectedTimesheet.currencySymbol} {/* {fmtNaira(selectedTimesheet.overtimePay || 0)} */}
                                  </span>
                                ) : "—"}
                                {selectedTimesheet.totalOvertimeHrs > 0 && (
                                  <small className="text-muted d-block">Overtime</small>
                                )}
                              </td>
                              <td colSpan={2}>
                                <span className="fw-bold fs-5 text-success">
                                  {selectedTimesheet.currencySymbol} {fmtNaira(selectedTimesheet.amountDue)}
                                </span>
                                <small className="text-muted d-block">Amount Due</small>
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </>
                    )}
                  </table>
                </div>

                {/* Optional: Add rate information below the table */}
                {selectedTimesheet.amountDue != null && (
                  <div className="d-flex justify-content-end mt-2">
                    <div className="p-2 rounded" style={{ maxWidth: "400px" }}>
                      <small className="text-muted d-flex justify-content-between">
                        <span>Regular rate:</span>
                        <span className="fw-medium ms-3">{selectedTimesheet.currencySymbol} {fmtNaira(selectedTimesheet.dailyRate ? selectedTimesheet.dailyRate / selectedTimesheet.dailyHours : 0)}/hr</span>
                      </small>
                      {/* <small className="text-muted d-flex justify-content-between">
                          <span>Overtime rate (1.5x):</span>
                          <span className="fw-medium ms-3">{fmtNaira((selectedTimesheet.dailyRate ? selectedTimesheet.dailyRate / selectedTimesheet.dailyHours : 0) * 1.5)}/hr</span>
                        </small> */}
                      {(selectedTimesheet.absentDays ?? 0) > 0 && (
                        <small className="text-danger d-flex justify-content-between">
                          <span>Absent deduction:</span>
                          <span className="fw-medium ms-3">− {selectedTimesheet.currencySymbol} {fmtNaira(selectedTimesheet.absentDeduction)}</span>
                        </small>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Pay Breakdown ── */}
                <PayBreakdown ts={selectedTimesheet} />

                {/* Review notes */}
                {/* {selectedTimesheet.status === "Submitted" && (
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
                )} */}

                {/* Approval status */}
                {selectedTimesheet.status === "Approved" && selectedTimesheet.approverName && (
                  <div className="alert alert-success mt-4 mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        ✓ Approved by <strong>{selectedTimesheet.approverName}</strong>
                        {selectedTimesheet.dateApproved &&
                          ` on ${fmt(selectedTimesheet.dateApproved)}`}
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
                        {selectedTimesheet.approverName &&
                          <> by <strong>{selectedTimesheet.approverName}</strong></>}
                        {selectedTimesheet.dateApproved &&
                          ` on ${fmt(selectedTimesheet.dateApproved)}`}
                      </span>
                      <span className="badge bg-danger">Rejected</span>
                    </div>
                    {selectedTimesheet.notes && (
                      <p className="mb-0 mt-2 small">
                        <strong>Reason:</strong> {selectedTimesheet.notes}
                      </p>
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
                      Reject Timesheet
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleReview(selectedTimesheet.timesheetId, "approved")}
                      disabled={processingId === selectedTimesheet.timesheetId}
                    >
                      {processingId === selectedTimesheet.timesheetId
                        ? <span className="spinner-border spinner-border-sm me-2" />
                        : <CheckCircle size={16} className="me-1" />}
                      Approve Timesheet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerTimesheets;