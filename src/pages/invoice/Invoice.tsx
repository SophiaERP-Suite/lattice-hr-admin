import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  FileText, CheckCircle, Clock, XCircle,
  Filter, AlertCircle, Eye, MoreVertical, FileCog2
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import type { SalesOrderResponse } from "../../types/salesOrder";
import { getAllInvoices } from "../../api/SalesOrderApi";
import Hashids from "hashids";

type PaymentStatusFilter = "" | "Unpaid" | "Paid" | "HalfPaid";

const getPaymentStatusValue = (status: PaymentStatusFilter): number | undefined => {
  switch (status) {
    case "Unpaid": return 0;
    case "Paid": return 1;
    case "HalfPaid": return 2;
    default: return undefined;
  }
};

const getPaymentStatusString = (status: number): string => {
  switch (status) {
    case 0: return "Unpaid";
    case 1: return "Paid";
    case 2: return "HalfPaid";
    default: return "Unpaid";
  }
};

// Skeleton Loader
const InvoiceSkeleton = () => (
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

// Payment Badge Component
const PaymentBadge = ({ status }: { status: number | string }) => {
  const statusNum = typeof status === "string" ? parseInt(status, 10) : status;
  const statusStr = getPaymentStatusString(statusNum);

  const config: Record<string, { cls: string; Icon: any; text: string }> = {
    Unpaid: { cls: "bg-label-danger", Icon: XCircle, text: "Unpaid" },
    HalfPaid: { cls: "bg-label-warning", Icon: Clock, text: "Part paid" },
    Paid: { cls: "bg-label-success", Icon: CheckCircle, text: "Paid" },
  };

  const cfg = config[statusStr] ?? config.Unpaid;

  return (
    <span className={`badge ${cfg.cls}`}>
      <cfg.Icon size={12} className="me-1" />
      {cfg.text}
    </span>
  );
};

// Money Formatter
const fmtMoney = (n: number, symbol = "") =>
  `${symbol} ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`.trim();

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// Main Component
function AllInvoices() {
  const [invoices, setInvoices] = useState<SalesOrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

  const handleStatusFilterChange = (val: PaymentStatusFilter) => {
    setStatusFilter(val);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchInvoices(pagination.page);
  }, [statusFilter, pagination.page, search]);

  const fetchInvoices = async (page: number) => {
    setLoading(true);
    try {
      const statusValue = getPaymentStatusValue(statusFilter);

      const data = await getAllInvoices(
        page,
        pagination.pageSize,
        statusValue !== undefined ? String(statusValue) : undefined
      );

      console.log("Fetched invoices:", data);

      if (data?.items) {
        setInvoices(data.items);
        setPagination(prev => ({
          ...prev,
          page: data.page,
          totalCount: data.totalCount,
          totalPages: data.totalPages,
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = useMemo(() => {
    if (!search) return invoices;

    const s = search.toLowerCase();

    return invoices.filter(i =>
      i.employerName?.toLowerCase().includes(s) ||
      i.invoiceReference?.toLowerCase().includes(s)
    );
  }, [invoices, search]);

  const stats = useMemo(() => {
    const total = pagination.totalCount;
    const currentUnpaid = invoices.filter(i => Number(i.paymentStatus) === 0).length;
    const currentHalfPaid = invoices.filter(i => Number(i.paymentStatus) === 2).length;
    const currentPaid = invoices.filter(i => Number(i.paymentStatus) === 1).length;

    return {
      total,
      unpaid: currentUnpaid,
      halfPaid: currentHalfPaid,
      paid: currentPaid,
    };
  }, [invoices, pagination.totalCount]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearch("");
    handleStatusFilterChange("");
  };

  const startItem = ((pagination.page - 1) * pagination.pageSize) + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.totalCount);

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">
        <ToastContainer />

        {/* Header */}
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1 d-flex align-items-center gap-2">
                <FileText size={24} className="text-info" />
                All Invoices
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">
                    <NavLink to="/invoices">Invoices</NavLink>
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
            { label: "Total", value: stats.total, color: "info", Icon: FileText },
            { label: "Unpaid", value: stats.unpaid, color: "danger", Icon: XCircle },
            { label: "Part paid", value: stats.halfPaid, color: "warning", Icon: Clock },
            { label: "Paid", value: stats.paid, color: "success", Icon: CheckCircle },
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
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      placeholder="Search employer or invoice reference..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => handleStatusFilterChange(e.target.value as PaymentStatusFilter)}
                    >
                      <option value="">All Statuses</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="HalfPaid">Part paid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-info w-100"
                      onClick={clearFilters}
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
                <h5 className="mb-0">Invoice Records</h5>
                <small className="text-muted">
                  Showing {filteredInvoices.length} of {pagination.totalCount} record{pagination.totalCount !== 1 ? "s" : ""}
                </small>
              </div>
              <div className="card-body mt-15">
                {loading ? (
                  <InvoiceSkeleton />
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead>
                          <tr>
                            <th>S/N</th>
                            <th>Reference</th>
                            <th>Employer</th>
                            <th>Due Date</th>
                            <th>Total Amount</th>
                            <th>Amount Due</th>
                            <th>Status</th>
                            <th>DateCreated</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInvoices.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="text-center py-5 text-muted">
                                <AlertCircle size={40} className="mb-3 d-block mx-auto" />
                                <h6>No invoices found</h6>
                                <p className="small mb-0">Try adjusting your filters</p>
                              </td>
                            </tr>
                          ) : (
                            filteredInvoices.map((inv, index) => (
                              <tr key={inv.salesOrderId}>
                                <td>{index + 1}</td>
                                <td>
                                  <span className="fw-medium text-info">{inv.invoiceReference}</span>
                                </td>
                                <td>{inv.employerName}</td>

                                <td>{fmt(inv.dueDate)}</td>
                                <td className="fw-medium">{fmtMoney(inv.totalAmount, inv.currencySymbol)}</td>
                                <td>
                                  <span className={inv.amountDue > 0 ? "text-danger fw-medium" : "text-success fw-medium"}>
                                    {fmtMoney(inv.amountDue ?? (inv.totalAmount - inv.amountPaid), inv.currencySymbol)}
                                  </span>
                                </td>
                                <td><PaymentBadge status={inv.paymentStatus} /></td>
                                <td><small>{fmt(inv.dateCreated)}</small></td>
                                <td className="text-end">
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-sm btn-outline-info"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                      <li>
                                        <NavLink
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          to={`/InvoiceDetails/${hashIds.encode(inv.invoiceId)}`}
                                        >
                                          <Eye size={15} className="text-info" /> View Details
                                        </NavLink>
                                      </li>
                                      {Number(inv.paymentStatus) === 0 && (
                                        <>
                                          <li><hr className="dropdown-divider" /></li>
                                          <li>
                                            <button
                                              className="dropdown-item d-flex align-items-center gap-2"
                                              onClick={() => {
                                                // Handle payment collection
                                                toast.info("Payment collection coming soon");
                                              }}
                                            >
                                              <FileCog2 size={15} className="text-warning" /> Record Payment
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
                          Showing {startItem}–{endItem} of {pagination.totalCount} entries
                        </small>
                        <nav>
                          <ul className="pagination mb-0">
                            <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                              >
                                Previous
                              </button>
                            </li>
                            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                              let pageNum;
                              if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (pagination.page >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }
                              return (
                                <li key={pageNum} className={`page-item ${pagination.page === pageNum ? "active" : ""}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              );
                            })}
                            <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
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

      {/* Detail Modal */}
      {/* {showDetailModal && selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={closeDetailModal}
          onPaymentRecord={() => {
            // Handle payment recording
            toast.info("Payment collection feature coming soon");
          }}
        />
      )} */}
    </div>
  );
}

export default AllInvoices;