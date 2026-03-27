import { useState, useEffect, useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, Filter, AlertCircle, FileText, Eye,
  CircleCheck,
  MoreVertical,
  CheckCheck,
  X,
  ChevronRight
} from "lucide-react";
import Hashids from "hashids";
import { toast, ToastContainer } from "react-toastify";
import { getAllEmployeeLeaves, approveLeave, rejectLeave } from "../../api/LeaveApi";
import Modal from "../../components/modal";

interface LeaveRequest {
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

interface LeaveRequestsResponse {
  items: LeaveRequest[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface DepartmentStats {
  department: string;
  total: number;
  pending: number;
  approved: number;
}

type ModalType = "approve" | "reject" | null;

// --- Helpers ---
const calcDays = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
};

const fmt = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

const EmployerLeaveSkeleton = () => (
  <div className="card">
    <div className="card-body">
      <div className="placeholder-glow">
        {/* Summary Cards Skeleton */}
        <div className="row g-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="d-flex align-center gap-16">
                <div className="avatar avatar-xl  placeholder rounded-circle"></div>
                <div className="flex-grow-1">
                  <span className="placeholder col-8 mb-2"></span>
                  <h2 className="placeholder col-4"></h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="d-flex gap-3 mb-4">
          <div className="placeholder col-3"></div>
          <div className="placeholder col-2"></div>
          <div className="placeholder col-2"></div>
          <div className="placeholder col-2"></div>
        </div>

        {/* Table Skeleton */}
        <table className="table">
          <thead>
            <tr>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <th key={i} className="placeholder col-1"></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                  <td key={col}>
                    <span className="placeholder col-12"></span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: LeaveRequest["status"] }) => {
  const config = {
    Pending: { cls: "bg-label-warning", Icon: Clock, text: "Pending" },
    Approved: { cls: "bg-label-success", Icon: CheckCircle, text: "Approved" },
    Rejected: { cls: "bg-label-danger", Icon: XCircle, text: "Rejected" },
    Cancelled: { cls: "bg-label-secondary", Icon: XCircle, text: "Cancelled" },
  };
  const { cls, Icon, text } = config[status] || config.Pending;
  return (
    <span className={`badge ${cls}`}>
      <Icon size={12} className="me-1" />{text}
    </span>
  );
};

const STATUS_API_OPTIONS = ["", "Pending", "Approved", "Rejected"] as const;
type ApiStatus = typeof STATUS_API_OPTIONS[number];

function EmployeeLeaveRequests() {
  const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
  const { employeeId, employeeName, clientId } = useParams();

  const decodedEmployeeId = useMemo(() => {
    const decoded = hashIds.decode(String(employeeId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [employeeId]);

  const decodedEmployerId = useMemo(() => {
    const decoded = hashIds.decode(String(clientId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [clientId]);

  const decodedEmployeeName = decodeURIComponent(employeeName ?? "");

  const [modalType, setModalType] = useState<ModalType>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const [apiStatus, setApiStatus] = useState<ApiStatus>("");

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [pagination, setPagination] = useState({
    page: 1, pageSize: 10, totalCount: 0, totalPages: 1,
  });

  const handleApiStatusChange = (val: ApiStatus) => {
    setApiStatus(val);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    if (decodedEmployeeId && decodedEmployerId) {
      fetchLeaveRequests(pagination.page);
    }
  }, [decodedEmployeeId, apiStatus, pagination.page, decodedEmployerId]);

  const fetchLeaveRequests = async (page: number) => {
    setLoading(true);
    try {

      const response: LeaveRequestsResponse = await getAllEmployeeLeaves(
        decodedEmployeeId!,
        page,
        pagination.pageSize,
        apiStatus || undefined,
        Number(decodedEmployerId)
      );

      if (response?.items) {
        setLeaveRequests(response.items);
        setPagination(prev => ({
          ...prev,
          page: response.page,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    requestId: number,
    action: "approved" | "rejected"
  ) => {
    setModalLoading(true)
    setProcessingId(requestId);
    try {
      if (action === "approved") {
        const response = await approveLeave(requestId, Number(decodedEmployerId));
        console.log("approved", response)
        if (response.status == 200) {
          toast.success("Request approved sucessfully")
        }
      } else {
        const response = await rejectLeave(requestId, Number(decodedEmployerId));
        console.log("rejected", response)
        if (response.status == 200) {
          toast.success("Request rejected sucessfully")
        }
      }
      await fetchLeaveRequests(pagination.page);
      setShowReviewModal(false);
      setSelectedRequest(null);
      setReviewComment('');
    } catch (error) {
      console.error("Failed to update leave status:", error);
    } finally {
      setProcessingId(null);
      setModalLoading(false);
      setModalType(null)
    }
  };

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((r) => {
      if (deptFilter !== "all" && r.employeeDepartment !== deptFilter) return false;
      if (typeFilter !== "all" && r.leaveType !== typeFilter) return false;
      if (search) {
        const term = search.toLowerCase();
        if (
          !r.employeeName.toLowerCase().includes(term) &&
          !r.reason.toLowerCase().includes(term)
        ) return false;
      }
      return true;
    });
  }, [leaveRequests, deptFilter, typeFilter, search]);

  const uniqueLeaveTypes = useMemo(
    () => [...new Set(leaveRequests.map((r) => r.leaveType).filter(Boolean))],
    [leaveRequests]
  );

  const stats = useMemo(() => {
    const deptMap = new Map<string, DepartmentStats>();
    leaveRequests.forEach((r) => {
      const dept = r.employeeDepartment || "Unknown";
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { department: dept, total: 0, pending: 0, approved: 0 });
      }
      const d = deptMap.get(dept)!;
      d.total++;
      if (r.status === "Pending") d.pending++;
      if (r.status === "Approved") d.approved++;
    });
    return {
      total: pagination.totalCount,
      pending: leaveRequests.filter((r) => r.status === "Pending").length,
      approved: leaveRequests.filter((r) => r.status === "Approved").length,
      rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
      departmentStats: Array.from(deptMap.values()),
    };
  }, [leaveRequests, pagination.totalCount]);

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">
        <ToastContainer />
        <Modal
          isOpen={modalType === "reject"}
          title="Reject Request"
          message="Are you sure you want to reject this request? This action cannot be undone."
          confirmText="Reject"
          cancelText="Cancel"
          confirmColor="danger"
          buttonIcon={<XCircle size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={modalLoading}
          onConfirm={() => {
            if (selectedRequest) {
              handleStatusUpdate(Number(selectedRequest?.leaveRequestId), "rejected")
            }
          }}
          onCancel={() => { setModalType(null); setSelectedRequest(null); }}
        />

        <Modal
          isOpen={modalType === "approve"}
          title="Approve Request"
          message="Are you sure you want to accept this request? This action cannot be undone."
          confirmText="Approve"
          cancelText="Cancel"
          confirmColor="success"
          buttonIcon={<CheckCheck size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={modalLoading}
          onConfirm={() => {
            if (selectedRequest) {
              handleStatusUpdate(Number(selectedRequest?.leaveRequestId), "approved")
            }
          }}
          onCancel={() => { setModalType(null); setSelectedRequest(null); }}
        />
        {/* Header */}
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1">Time-off Management ({decodedEmployeeName})</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    {decodedEmployeeName || "Employee Details"}
                  </li>

                  <ChevronRight size={15} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item"><NavLink to={`/ClientMgt/TimeOffRequests/${clientId}`}>General Time-Off Requests</NavLink></li>

                  <ChevronRight size={15} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item">
                    <NavLink to={`/ClientMgt/${clientId}`}>Client Mgt</NavLink>
                  </li>

                  <ChevronRight size={15} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Dashboard</NavLink></li>

                </ol>
              </nav>
            </div>
          </div>
        </div>


        {/* Leave Balance Cards */}
        <div className="row mb-4">
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-primary-transparent text-primary">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Total Request</span>
                  <h2 className="mb-5">
                    {stats.total}

                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-success-transparent text-success">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Pending Requests</span>
                  <h2 className="mb-5">
                    {stats.pending}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-warning-transparent text-warning">
                  <CircleCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Approved <small>(
                    {stats.total > 0
                      ? `${((stats.approved / stats.total) * 100).toFixed(1)}% approval rate`
                      : "No data yet"}
                  </small>)</span>
                  <h2 className="mb-5">
                    {stats.approved}
                  </h2>

                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-danger-transparent text-danger">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Rejected Requests</span>
                  <h2 className="mb-5">
                    {stats.rejected}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-3 align-items-center">

                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={apiStatus}
                      onChange={(e) => handleApiStatusChange(e.target.value as ApiStatus)}
                    >
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Time-off Types</option>
                      {uniqueLeaveTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-info w-100"
                      onClick={() => {
                        setSearch("");
                        setDeptFilter("all");
                        setTypeFilter("all");
                        handleApiStatusChange("");
                      }}
                    >
                      <Filter size={16} className="me-1" /> Clear Filters
                    </button>
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
                <h5 className="mb-0">Time-off Requests</h5>
                <small className="text-muted">
                  Showing {filteredRequests.length} of {pagination.totalCount} record{pagination.totalCount !== 1 ? "s" : ""}
                </small>
              </div>
              <div className="card-body mt-15">
                {loading ? (
                  <EmployerLeaveSkeleton />
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="">
                          <tr>
                            {/* <th>Employee</th> */}
                            <th>Time-Off Type</th>
                            <th>Duration</th>
                            <th>Days</th>
                            <th>Reason</th>
                            <th>Requested</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center py-5">
                                <div className="text-muted">
                                  <AlertCircle size={40} className="mb-3 mx-auto" />
                                  <h6>No leave requests found</h6>
                                  <p className="small">Try adjusting your filters</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredRequests.map((request) => (
                              <tr key={request.leaveRequestId}>

                                <td>
                                  <span className="fw-medium">{request.leaveType}</span>
                                  <div><small className="text-muted">{request.employeeDepartment}</small></div>
                                </td>
                                <td>
                                  <div>{fmt(request.startDate)}</div>
                                  <small className="text-muted">to {fmt(request.endDate)}</small>
                                </td>
                                <td>
                                  <span className="badge bg-info">
                                    {calcDays(request.startDate, request.endDate)} days
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className="text-truncate d-inline-block"
                                    style={{ maxWidth: 150, cursor: 'pointer' }}
                                    title={request.reason}
                                  >
                                    {request.reason}
                                  </span>
                                </td>
                                <td>
                                  <div>{fmt(request.dateCreated)}</div>
                                  <small className="text-muted">
                                    {new Date(request.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </small>
                                </td>
                                <td><StatusBadge status={request.status} /></td>
                                <td className="text-end">
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      disabled={processingId === request.leaveRequestId}
                                    >
                                      {processingId === request.leaveRequestId
                                        ? <span className="spinner-border spinner-border-sm" />
                                        : <MoreVertical size={16} />}
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end">
                                      {/* View — always visible */}
                                      <li>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={() => {
                                            setSelectedRequest(request);
                                            setShowReviewModal(true);
                                          }}
                                        >
                                          <Eye size={15} className="text-info" /> View Details
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={() => {
                                            setSelectedRequest(request);
                                            setModalType("approve");
                                          }}
                                        >
                                          <CheckCheck size={15} className="text-success" /> Approve
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={() => {
                                            setSelectedRequest(request);
                                            setModalType("reject");
                                          }}
                                        >
                                          <XCircle size={15} className="text-danger" /> Reject
                                        </button>
                                      </li>

                                      {/* Pending-only actions */}
                                      {/* {request.status === "Pending" && (
                                          <>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                              <button
                                                className="dropdown-item d-flex align-items-center gap-2"
                                                onClick={() => {
                                                  setSelectedRequest(request);
                                                  setShowReviewModal(true);
                                                }}
                                              >
                                                <CheckSquare size={15} className="text-success" /> Review
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                className="dropdown-item d-flex align-items-center gap-2"
                                                onClick={() => handleStatusUpdate(request.leaveRequestId, "approved")}
                                              >
                                                <CheckCircle size={15} className="text-success" /> Approve
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                className="dropdown-item d-flex align-items-center gap-2 text-danger"
                                                onClick={() => handleStatusUpdate(request.leaveRequestId, "rejected")}
                                              >
                                                <XSquare size={15} className="text-danger" /> Reject
                                              </button>
                                            </li>
                                          </>
                                        )} */}
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
                              <button
                                className="page-link"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                              >
                                Previous
                              </button>
                            </li>
                            {[...Array(pagination.totalPages)].map((_, i) => (
                              <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? "active" : ""}`}>
                                <button
                                  className="page-link"
                                  onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                                >
                                  {i + 1}
                                </button>
                              </li>
                            ))}
                            <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                              >
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

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedRequest.status === "Pending" ? "Review Leave Request" : "Leave Request Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => { setShowReviewModal(false); setSelectedRequest(null); setReviewComment(''); }}
                />
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  {/* <div className="avatar avatar-md">
                      <img
                        src={selectedRequest.employeeAvatar || "/default-avatar.png"}
                        alt={selectedRequest.employeeName}
                        className="rounded-circle"
                        style={{ width: 48, height: 48, objectFit: "cover" }}
                      />
                    </div> */}
                  <div>
                    <h6 className="mb-0">{decodedEmployeeName}</h6>
                    <p className="text-muted mb-0 small">
                      {selectedRequest.employeeJobTitle} · {selectedRequest.employeeDepartment}
                    </p>
                  </div>
                </div>

                <div className=" p-3 rounded-3 mb-3">
                  <div className="row g-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Leave Type</small>
                      <span className="fw-medium">{selectedRequest.leaveType}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Duration</small>
                      <span className="fw-medium">
                        {calcDays(selectedRequest.startDate, selectedRequest.endDate)} days
                      </span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Start Date</small>
                      <span>{fmt(selectedRequest.startDate)}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">End Date</small>
                      <span>{fmt(selectedRequest.endDate)}</span>
                    </div>
                    <div className="col-12">
                      <small className="text-muted d-block">Reason</small>
                      <p className="mb-0">{selectedRequest.reason}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Status</small>
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Requested On</small>
                      <span className="small">{fmt(selectedRequest.dateCreated)}</span>
                    </div>
                  </div>
                </div>

                {selectedRequest.status === "Pending" && (
                  <div className="mb-3">
                    <label className="form-label">Review Comments</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Add any comments or feedback..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => { setShowReviewModal(false); setSelectedRequest(null); setReviewComment(''); }}
                >
                  <X size={16} /> {selectedRequest.status === "Pending" ? "Cancel" : "Close"}
                </button>
                {selectedRequest.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate(selectedRequest.leaveRequestId, "rejected")}
                      disabled={processingId === selectedRequest.leaveRequestId}
                    >
                      {processingId === selectedRequest.leaveRequestId ? (
                        <span className="spinner-border spinner-border-sm me-2" />
                      ) : (
                        <XCircle size={16} className="me-1" />
                      )}
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleStatusUpdate(selectedRequest.leaveRequestId, "approved")}
                      disabled={processingId === selectedRequest.leaveRequestId}
                    >
                      {processingId === selectedRequest.leaveRequestId ? (
                        <span className="spinner-border spinner-border-sm me-2" />
                      ) : (
                        <CheckCircle size={16} className="me-1" />
                      )}
                      Approve
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

export default EmployeeLeaveRequests;