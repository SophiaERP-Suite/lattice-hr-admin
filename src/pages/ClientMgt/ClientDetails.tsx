import { ChevronRight } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import { fetchEmployerById } from "../../utils/EmployerRequests";
import { fetchAllJobs, updateJob } from "../../utils/JobRequests";
import { toast, ToastContainer } from "react-toastify";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { fetchAllOfficers } from "../../utils/OfficerRequests";
import { GetAllEmployerOffers, GetEmployerOffers } from "../../utils/JobOfferRequest";
import type { JobOfferListItem } from "../../types/JobOffer";
import type { EmployerData } from "../../components/ClientSidebar";
import ClientSidebar from "../../components/ClientSidebar";
import JobsTab from "../../components/JobsTab";
import OffersTab from "../../components/OffersTab";
import OfficersTab from "../../components/OfficersTab";
import TermsCard from "../../components/TermsCard";
import InductionDashboard from "../../components/Induction";
import WorkAttendance from "../WorkersMgt/WorkAttendance";
import Payment from "../Payslips/Payment";

interface JobData {
    jobId: number;
    jobTitle: string;
    jobDescription: string;
    employerId: string;
    employer: string;
    jobSectorId: string;
    jobSector: string;
    jobTypeId: string;
    jobType: string;
    countryId: string;
    country: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    published: boolean;
    publishedDate: string;
    dateCreated: string;
}

interface OfficerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateCreated: string;
    email: string;
    phone: string;
    gender: string;
    profilePhoto: string;
    position: string;
}

const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

export default function ClientDetails() {
    const { id } = useParams();
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;

    // Employer
    const [employerDetails, setEmployerDetails] = useState<EmployerData | null>(null);

    // Officers
    const [officers, setOfficers] = useState<OfficerData[]>([]);
    const [totalOfficers, setTotalOfficers] = useState(0);
    const [officerPage, setOfficerPage] = useState(1);
    const officerLimit = 10;

    // Jobs
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [jobPage, setJobPage] = useState(1);
    const jobLimit = 10;

    // Offers
    const [offers, setOffers] = useState<JobOfferListItem[]>([]);
    const [offersLoading, setOffersLoading] = useState(false);
    const [offersError, setOffersError] = useState<string | null>(null);
    const [totalOffers, setTotalOffers] = useState(0);
    const [sentOffers, setSentOffers] = useState(0);
    const [acceptanceRate, setAcceptanceRate] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0,
    });

    // ─── Fetch employer ──
    useEffect(() => {
        fetchEmployerById(hashedId).then(res => {
            if (res.status === 200) res.json().then(d => setEmployerDetails(d.data));
        });
    }, [hashedId]);

    // ─── Fetch officers ──
    const loadOfficers = async (page = officerPage) => {
        const res = await fetchAllOfficers({ pageNumber: page, limit: officerLimit, employerId: hashedId });
        if (res.status === 200) {
            const d = await res.json();
            setOfficers(d.data.officers);
            setTotalOfficers(d.data.totalCount);
        }
    };
    useEffect(() => { loadOfficers(officerPage); }, [officerPage, hashedId]);

    // ─── Fetch jobs 
    const loadJobs = async (page = jobPage) => {
        const res = await fetchAllJobs({ pageNumber: page, limit: jobLimit, employerId: hashedId });
        if (res.status === 200) {
            const d = await res.json();
            setJobs(d.data.jobs);
            setTotalJobs(d.data.totalCount);
        }
    };
    useEffect(() => { loadJobs(jobPage); }, [jobPage, hashedId]);

    // ─── Fetch offers ────
    const loadOffers = async () => {
        setOffersLoading(true);
        setOffersError(null);
        try {
            const res = await GetEmployerOffers(
                search, statusFilter || undefined,
                pagination.pageNumber, pagination.pageSize, hashedId,
            );
            if (res.statusCode === 200) {
                const d = res.data;
                setOffers(d);
                setPagination({ pageNumber: d.pageNumber, pageSize: d.pageSize, totalCount: d.totalCount, totalPages: d.totalPages });
            } else {
                setOffersError(res.message);
            }
        } catch { setOffersError("Failed to load offers"); }
        finally { setOffersLoading(false); }
    };

    const loadAllOffers = async () => {
        try {
            const res = await GetAllEmployerOffers(hashedId);
            if (res.statusCode === 200) {
                const items: JobOfferListItem[] = res.data || [];
                setTotalOffers(items.length);
                const sent = items.filter(o => o.offerStatus === "Sent").length;
                const accepted = items.filter(o => o.offerStatus === "Accepted").length;
                const decided = items.filter(o => o.offerStatus === "Accepted" || o.offerStatus === "Declined").length;
                setSentOffers(sent);
                setAcceptanceRate(decided > 0 ? Math.round((accepted / decided) * 100) : 0);
            }
        } catch { /* silent */ }
    };

    useEffect(() => {
        loadOffers();
        loadAllOffers();
    }, [pagination.pageNumber, pagination.pageSize, search, statusFilter, hashedId]);

    // ─── Handlers ────────
    const handleTogglePublish = async (jobId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("Published", String(status));
        const res = await updateJob(jobId, formData);
        handleCreateEmployee(res, null, null, { toast }, null).finally(() => loadJobs(jobPage));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPagination(prev => ({ ...prev, pageNumber: 1 }));
    };

    return (
        <div className="container-fluid">
            <ToastContainer />

            {/* ── Page header ── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Client Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/ClientMgt/${id}`}>Client Details</NavLink>
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/ClientMgt">Client Management</NavLink>
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
                                <li className="breadcrumb-item">
                                    <NavLink to="/Dashboard">Dashboard</NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {employerDetails && (
                <div className="row">
                    {/* ── Sidebar ── */}
                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-12 mb-20">
                        <ClientSidebar employer={employerDetails} />
                    </div>

                    {/* ── Tabs panel ── */}
                    <div className="col-xxl-9 col-xl-8 col-lg-8 col-12">
                        <div className="card">
                            {/* Scrollable tab nav with overflow indicators */}
                            <div className="tab-style-three mb-25" style={{ position: "relative" }}>

                                {/* Left fade — appears after scrolling */}
                                <div id="tab-fade-left" style={{
                                    position: "absolute", left: 0, top: 0, bottom: 10, width: 40,
                                    background: "linear-gradient(to left, transparent, white 80%)",
                                    pointerEvents: "none", zIndex: 1, opacity: 0, transition: "opacity 0.2s",
                                    display: "flex", alignItems: "center",
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 12L6 8l4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Scrollable list */}
                                <div
                                    id="tab-scroll-container"
                                    style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                                >
                                    <ul
                                        className="nav nav-pills gap-10 b-bottom2px b-color-primary"
                                        id="pills-tab"
                                        role="tablist"
                                        style={{ flexWrap: "nowrap", minWidth: "max-content" }}
                                    >
                                        {[
                                            { id: "officers", label: "Responsibility Officers" },
                                            { id: "workers", label: "Workers & Attendance" },
                                            { id: "jobs", label: "Jobs Posted" },
                                            { id: "offers", label: "Job Offers" },
                                            { id: "terms", label: "Terms and Conditions" },
                                            { id: "induction", label: "Induction" },
                                            { id: "payslip", label: "Pay Slip" },
                                        ].map(({ id: tabId, label }, i) => (
                                            <li key={tabId} className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link ${i === 0 ? "active" : ""}`}
                                                    data-bs-toggle="pill"
                                                    data-bs-target={`#pills-${tabId}`}
                                                    type="button"
                                                    role="tab"
                                                >
                                                    {label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div id="tab-fade-right" style={{
                                    position: "absolute", right: 0, top: 0, bottom: 10, width: 56,
                                    background: "linear-gradient(to right, transparent, white 80%)",
                                    pointerEvents: "none", zIndex: 1,
                                    display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
                                    transition: "opacity 0.2s",
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 4l4 4-4 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                <p id="tab-scroll-hint" style={{
                                    fontSize: 11, color: "#aaa", marginTop: 4,
                                    display: "flex", alignItems: "center", gap: 4, transition: "opacity 0.3s",
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6h8M7 3l3 3-3 3" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Scroll to see more tabs
                                </p>
                            </div>

                            <div className="tab-content" id="pills-tabContent">
                                {/* Officers */}
                                <div className="tab-pane show active" id="pills-officers" role="tabpanel">
                                    <OfficersTab
                                        officers={officers}
                                        totalOfficers={totalOfficers}
                                        pageNumber={officerPage}
                                        pageLimit={officerLimit}
                                        hashedId={hashedId}
                                        onPageChange={setOfficerPage}
                                        onRefetch={() => loadOfficers(officerPage)}
                                    />
                                </div>

                                {/* Workers */}
                                <div className="tab-pane fade" id="pills-workers" role="tabpanel">
                                    <WorkAttendance employerId={hashedId} />
                                </div>

                                {/* Jobs */}
                                <div className="tab-pane fade" id="pills-jobs" role="tabpanel">
                                    <JobsTab
                                        jobs={jobs}
                                        totalJobs={totalJobs}
                                        pageNumber={jobPage}
                                        pageLimit={jobLimit}
                                        clientId={id}
                                        onPageChange={setJobPage}
                                        onTogglePublish={handleTogglePublish}
                                    />
                                </div>

                                {/* Offers */}
                                <div className="tab-pane fade" id="pills-offers" role="tabpanel">
                                    <OffersTab
                                        offers={offers}
                                        loading={offersLoading}
                                        error={offersError}
                                        totalOffers={totalOffers}
                                        sentOffers={sentOffers}
                                        acceptanceRate={acceptanceRate}
                                        pagination={pagination}
                                        searchInput={searchInput}
                                        statusFilter={statusFilter}
                                        clientId={id}
                                        onSearchInputChange={setSearchInput}
                                        onSearchSubmit={handleSearchSubmit}
                                        onStatusFilterChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setPagination(prev => ({ ...prev, pageNumber: 1 }));
                                        }}
                                        onPageChange={(page) => setPagination(prev => ({ ...prev, pageNumber: page }))}
                                        onPageSizeChange={(e) => setPagination(prev => ({
                                            ...prev,
                                            pageSize: parseInt(e.target.value),
                                            pageNumber: 1,
                                        }))}
                                    />
                                </div>

                                <div className="tab-pane fade" id="pills-terms" role="tabpanel">
                                    <TermsCard employerId={hashedId} />
                                </div>

                                <div className="tab-pane fade" id="pills-induction" role="tabpanel">
                                    <InductionDashboard employerId={hashedId} />
                                </div>

                                <div className="tab-pane fade" id="pills-payslip" role="tabpanel">
                                    <Payment employerId={hashedId} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}