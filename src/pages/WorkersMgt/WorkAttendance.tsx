import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Filter,
  MoreVertical,
  User,
  Eye,
} from "lucide-react";
import { getOrganizationEmployees } from "../../api/EmployerApi";
import Hashids from "hashids";

interface Employee {
  jobSeekerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  profilePhoto: string;
  address: string;
}

interface PagedResult {
  items: Employee[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface Props {
  employerId: number;
}

const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
const API_BASE = "http://localhost:5127";

// ── Bootstrap Dropdown per row ───────────
const ActionDropdown = ({ employee, clientId }: { employee: Employee, clientId: string }) => {
  const navigate = useNavigate();

  const encodedId = hashIds.encode(employee.jobSeekerId.toString());
  const encodedIdNum = hashIds.encode(employee.jobSeekerId);
  const fullName = encodeURIComponent(`${employee.firstName} ${employee.lastName}`);

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-info"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <MoreVertical size={15} />
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={() => navigate(`/ClientMgt/WorkerDetails/${encodedId}/${clientId}`)}
          >
            <Eye size={14} className="text-primary" /> View Details
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={() => navigate(`/ClientMgt/Timesheet/${encodedId}/${fullName}/${clientId}`)}
          >
            <Clock size={14} className="text-primary" /> View Timesheet
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={() => navigate(`/ClientMgt/Timesheet/${encodedId}/${fullName}/${clientId}`)}
          >
            <Clock size={14} className="text-primary" /> View Timesheet
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center gap-2"
            onClick={() => navigate(`/ClientMgt/TimeOffRequests/${encodedIdNum}/${fullName}/${clientId}`)}
          >
            <Calendar size={14} className="text-success" /> Leave Requests
          </button>
        </li>
      </ul>
    </div>
  );
};

// ── Main Component ──────────────────
const WorkAttendance = ({ employerId }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagedResult, setPagedResult] = useState<PagedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    jobSectorId: undefined as number | undefined,
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationEmployees(filters, employerId);
      console.log("rrrrr", response)
      const result: PagedResult = response.data;
      setPagedResult(result);
      setEmployees(result.items);
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const totalPages = pagedResult?.totalPages ?? 1;
  const totalCount = pagedResult?.totalCount ?? 0;
  const currentPage = filters.page;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters((prev) => ({ ...prev, page }));
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * filters.pageSize + 1;
  const showingTo = Math.min(currentPage * filters.pageSize, totalCount);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-3 align-items-center">
        <div className="col">
          <h1 className="fs-18 lh-1 mb-0">Workers &amp; Attendance</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card mb-3">
        <div className="card-body py-3">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email or phone…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="col" />

            {/* Rows per page */}
            <div className="col-auto d-flex align-items-center gap-2">
              <span className="text-muted small">Rows:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: 70 }}
                value={filters.pageSize}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, pageSize: Number(e.target.value), page: 1 }))
                }
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Clear */}
            <div className="col-auto">
              <button
                className="btn btn-sm btn-info"
                onClick={() => {
                  setSearchInput("");
                  setFilters({ page: 1, pageSize: 10, search: "", jobSectorId: undefined });
                }}
              >
                <Filter size={13} className="me-1" />
                Clear
              </button>
            </div>

            {/* Quick nav */}
            <div className="col-auto">
              <NavLink className="btn btn-sm btn-success" to={`/ClientMgt/TimeOffRequests/${hashIds.encode(employerId.toString())}`}>
                <CalendarCheck size={13} className="me-1" />
                Time-Offs
              </NavLink>
            </div>
            <div className="col-auto">
              <NavLink className="btn btn-sm btn-warning" to={`/ClientMgt/TimeSheet/${hashIds.encode(employerId.toString())}`}>
                <CalendarClock size={13} className="me-1" />
                Timesheet
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="">
        <div className="p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: 13.5 }}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: 48, paddingLeft: 16 }}>S/N</th>
                  <th style={{ minWidth: 200 }}>Employee</th>
                  <th style={{ minWidth: 200 }}>Contact</th>
                  <th style={{ minWidth: 120 }}>Gender</th>
                  <th style={{ width: 80, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2" />
                      Loading employees…
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp, idx) => (
                    <tr key={emp.jobSeekerId}>
                      {/* Row number */}
                      <td style={{ paddingLeft: 16, color: "#9ca3af" }}>
                        {showingFrom + idx}
                      </td>

                      {/* Avatar + Name */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {emp.profilePhoto ? (
                            <img
                              src={`${API_BASE}/${emp.profilePhoto}`}
                              alt={emp.firstName}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #e5e7eb",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background: "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <User size={16} color="#9ca3af" />
                            </span>
                          )}
                          <span className="fw-medium">
                            {emp.firstName} {emp.lastName}
                          </span>
                        </div>
                      </td>

                      {/* Contact — stacked lines */}
                      <td>
                        <div className="small">{emp.email}</div>
                        <div className="small text-muted">{emp.phone}</div>
                        <div
                          className="small text-muted"
                          style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          title={emp.address}
                        >
                          {emp.address || "—"}
                        </div>
                      </td>

                      {/* Gender */}
                      <td>
                        <span
                          className={`badge ${emp.gender?.toLowerCase() === "female"
                            ? "bg-danger-subtle text-danger"
                            : "bg-primary-subtle text-primary"
                            }`}
                          style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20 }}
                        >
                          {emp.gender || "—"}
                        </span>
                      </td>

                      {/* Bootstrap dropdown */}
                      <td className="text-center">
                        <ActionDropdown clientId={hashIds.encode(String(employerId))} employee={emp} />

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination footer */}
        {!loading && totalCount > 0 && (
          <div
            className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2"
            style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0" }}
          >
            <span className="">
              Showing <strong>{showingFrom} to {showingTo}</strong> of <strong>{totalCount}</strong> employees
            </span>

            <nav>
              <ul className="pagination pagination-sm mb-0 mt-40">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                    Previous
                  </button>
                </li>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <li key={`ellipsis-${i}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                      <button className="page-link" onClick={() => goToPage(p as number)}>
                        {p}
                      </button>
                    </li>
                  )
                )}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkAttendance;