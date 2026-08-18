import { CircleCheck, Eye, FolderOpen, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";
import Hashids from "hashids";
import dayjs from "dayjs";
import type { JobOfferListItem } from "../types/JobOffer";

interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

interface Props {
    offers: JobOfferListItem[];
    loading: boolean;
    error: string | null;
    totalOffers: number;
    sentOffers: number;
    acceptanceRate: number;
    pagination: Pagination;
    searchInput: string;
    statusFilter: string;
    clientId: string | undefined;
    onSearchInputChange: (val: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

const statCards = (totalOffers: number, acceptanceRate: number, sentOffers: number) => [
    {
        icon: <FolderOpen size={40} />,
        iconClass: "avatar avatar-xl bg-warning-transparent text-warning",
        label: "Total Offers",
        value: totalOffers,
    },
    {
        icon: <TrendingUp size={40} />,
        iconClass: "avatar avatar-xl bg-slateblue-transparent text-slateblue",
        label: "Offer Acceptance",
        value: `${acceptanceRate}%`,
    },
    {
        icon: <CircleCheck size={40} />,
        iconClass: "avatar avatar-xl bg-teal-transparent text-teal",
        label: "Sent Offers",
        value: sentOffers,
    },
];

export default function OffersTab({
    offers, loading, error,
    totalOffers, sentOffers, acceptanceRate,
    pagination, searchInput, statusFilter,
    clientId,
    onSearchInputChange, onSearchSubmit,
    onStatusFilterChange, onPageChange,
}: Props) {
    return (
        <div className="card-body pt-15">
            {/* Stats row */}
            <div className="row mb-15">
                {statCards(totalOffers, acceptanceRate, sentOffers).map((card, i) => (
                    <div key={i} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-15">
                        <div className="card mb-0">
                            <div className="card-body mini-card-body d-flex align-center gap-16">
                                <div className={card.iconClass}>{card.icon}</div>
                                <div className="card-content">
                                    <span className="d-block fs-16 mb-5">{card.label}</span>
                                    <h2 className="mb-5">{card.value}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="job-filter-container mb-15">
                <h6>Filter by:</h6>
                <div className="row mt-10 gy-10">
                    <div className="col-md-6 col-12">
                        <form onSubmit={onSearchSubmit} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by candidate or job title"
                                value={searchInput}
                                onChange={(e) => onSearchInputChange(e.target.value)}
                            />
                            <button type="submit" className="btn btn-info">Search</button>
                        </form>
                    </div>
                    <div className="col-md-6 col-12">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={onStatusFilterChange}
                        >
                            <option value="">All Status</option>
                            <option value="Sent">Sent</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Declined">Declined</option>
                            <option value="Expired">Expired</option>
                            <option value="Draft">Draft</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Negotiation">Negotiation</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Table */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table text-nowrap w-100">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Job Title</th>
                                <th>Offer Date</th>
                                <th>Status</th>
                                <th>Rates Offered</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No job offers found</td>
                                </tr>
                            ) : (
                                offers.map((offer) => (
                                    <tr key={offer.jobOfferId}>
                                        <td>
                                            <div className="d-flex-items gap-10">
                                                <div className="avatar radius-100">
                                                    <img
                                                        src={`http://localhost:5127/${offer.jobSeeker.profilePhoto}` || "https://img.icons8.com/color/48/gender-neutral-user.png"}
                                                        alt={offer.jobSeeker.firstName}
                                                        className="radius-100"
                                                    />
                                                </div>
                                                <div>
                                                    <h6>
                                                        <a href="#">{offer.jobSeeker.firstName} {offer.jobSeeker.lastName}</a>
                                                    </h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <NavLink to={`/job-offer/${offer.jobOfferId}`}>
                                                {offer.job.jobTitle}
                                            </NavLink>
                                        </td>
                                        <td>{dayjs(offer.offerDate).format("MMM D, YYYY")}</td>
                                        <td>{offer.offerStatus}</td>
                                        <td>
                                            {offer.currencySymbol}
                                            {new Intl.NumberFormat(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(offer.grossAnnualSalary)}
                                        </td>
                                        <td>
                                            <div className="d-flex-items gap-10">
                                                <NavLink
                                                    className="btn-icon btn-info-light"
                                                    to={`/JobOfferDetails/${hashIds.encode(String(offer.jobApplicationId))}/${clientId}`}
                                                >
                                                    <Eye size={14} />
                                                </NavLink>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && offers.length > 0 && (
                <div className="table-footer mt-15 d-flex justify-content-between flex-wrap gap-10 align-items-center">
                    <p className="mb-0 text-muted">
                        Showing {(pagination.pageNumber - 1) * pagination.pageSize + 1} to{" "}
                        {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of{" "}
                        {pagination.totalCount} entries
                    </p>
                    <ul className="pagination mb-0">
                        <li className={`paginate_button page-item previous ${pagination.pageNumber === 1 ? "disabled" : ""}`}>
                            <a href="#" className="page-link"
                                onClick={(e) => { e.preventDefault(); if (pagination.pageNumber > 1) onPageChange(pagination.pageNumber - 1); }}>
                                Previous
                            </a>
                        </li>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <li key={i + 1} className={`paginate_button page-item ${pagination.pageNumber === i + 1 ? "active" : ""}`}>
                                <a href="#" className="page-link"
                                    onClick={(e) => { e.preventDefault(); onPageChange(i + 1); }}>
                                    {i + 1}
                                </a>
                            </li>
                        ))}
                        <li className={`paginate_button page-item next ${pagination.pageNumber === pagination.totalPages ? "disabled" : ""}`}>
                            <a href="#" className="page-link"
                                onClick={(e) => { e.preventDefault(); if (pagination.pageNumber < pagination.totalPages) onPageChange(pagination.pageNumber + 1); }}>
                                Next
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
