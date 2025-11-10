import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Eye,
  Flag,
  FolderOpenDot,
  LayoutList,
  ListChecks,
  OctagonX,
} from "lucide-react";

import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function ComplianceMgt() {
  const [records] = useState([
    {
      company: "Linda Park",
      checkType: "DBS Check",
      status: "Pending",
      expiry: "—",
    },
    {
      company: "Ngozi Eze",
      checkType: "Criminal Record",
      status: "Valid",
      expiry: "2026-04-12",
    },
    {
      company: "Michael Brown",
      checkType: "Document Verification",
      status: "Expiring Soon",
      expiry: "2025-12-01",
    },
  ]);

  return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1">Compliance Management</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="active breadcrumb-item" aria-current="page">
                    <NavLink to="/ComplianceMgt">
                        Compliance Management
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <ChevronRight size={15} />
                  </li>
                  <li className="breadcrumb-item">
                      <NavLink to="/Dashboard">
                          Dashboard
                      </NavLink>
                    </li>
                </ol>
              </nav>
            </div>
          </div>
        {/* Summary Cards */}
        <div className="col-12 col-lg-3 col-md-6 col-12">
          <div className="card">
            <div className="card-body mini-card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-info-transparent text-info">
                <LayoutList size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Pending Checks</span>
                <h2 className="mb-5">12</h2>
                <span className="text-info">
                  +5% <ArrowUp size={12} className="ri-arrow-up-line"/>
                </span>
                <span className="fs-12 text-muted ml-5">vs. last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body mini-card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-danger-transparent text-danger">
                <OctagonX size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Non Compliant</span>
                <h2 className="mb-5">42</h2>
                <span className="text-danger">
                  +5% <ArrowDown size={12} className="ri-arrow-up-line"/>
                </span>
                <span className="fs-12 text-muted ml-5">vs. last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body mini-card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-warning-transparent text-warning">
                <FolderOpenDot size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Expiring Soon</span>
                <h2 className="mb-5">28</h2>
                <span className="text-warning">
                  +3 New
                  <ArrowUp size={12} className="ri-arrow-up-line"/>
                </span>
                <span className="fs-12 text-muted ml-5">this week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body mini-card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-success-transparent text-success">
                <ListChecks size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Fully Compliant</span>
                <h2 className="mb-5">156</h2>
                <span className="text-success">
                  +3 New
                  <ArrowUp size={12} className="ri-arrow-up-line"/>
                </span>
                <span className="fs-12 text-muted ml-5">this week</span>
              </div>
            </div>
          </div>
        </div>

          {/* Compliance Table */}
          <div className="card shadow-sm">
            <div className="card-header fw-bold">
              Compliance Records
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-start">
                <thead className="table-light">
                  <tr>
                    <th>Worker</th>
                    <th>Check Type</th>
                    <th>Status</th>
                    <th>Expiry Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={idx}>
                      <td>{rec.company}</td>
                      <td>{rec.checkType}</td>
                      <td>
                        {rec.status === "Pending" && (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        )}
                        {rec.status === "Valid" && (
                          <span className="badge bg-success">Valid</span>
                        )}
                        {rec.status === "Expiring Soon" && (
                          <span className="badge bg-info text-dark">
                            Expiring Soon
                          </span>
                        )}
                      </td>
                      <td>{rec.expiry}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#viewModal"
                        >
                          <Eye size={16} className="me-1" />
                          View
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <Flag size={16} className="me-1" />
                          Flag
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for Details */}
          <div
            className="modal fade"
            id="viewModal"
            tabIndex={-1}
            aria-labelledby="viewModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="viewModalLabel">
                    Compliance Record Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Worker:</strong> Linda Park
                  </p>
                  <p>
                    <strong>Check Type:</strong> DBS Check
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-warning text-dark">Pending</span>
                  </p>
                  <p>
                    <strong>Expiry Date:</strong> —
                  </p>
                  <p className="text-muted">
                    Notes: Awaiting document verification from HR.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Mark as Reviewed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
