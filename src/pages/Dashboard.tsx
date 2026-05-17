import {
    FolderOpenDot,
    Briefcase,
    UserPlus,
    ChevronDown,
    BanknoteArrowUp,
    Handshake,
    FolderKanban,
    AlertCircle,
    CalendarDays,
    CheckCheck,
    MoreVertical,
    XCircle,
    Clock,
    CheckCircle,
    Timer,
} from "lucide-react";
import ApexCharts from "apexcharts";
import { useEffect, useState, useRef } from "react";
import latty_mini from "../assets/images/latty_mini.png";
import { NavLink } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { fetchAdminData } from "../utils/AdminDataRequests";
import { fetchCurrencies } from "../utils/CurrencyRequests";
import type { RecentJobs } from "../types/jobData";
import { GetRecentJobs } from "../api/JobApi";
import Hashids from "hashids";
import type { RecentEmployers } from "../types/employer";
import { getRecentEmployers } from "../api/EmployerApi";
import type { Timesheet, TimesheetPagedDto } from "../types/timesheet";
import { getAllTimesheetsForAdmin, reviewTimesheet } from "../api/TimesheetApi";
import { fmt, fmtNaira } from "../helpers/formatter";
import { toast, ToastContainer } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5127";

type ModalType = "approve" | "reject" | null;

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

// ── Timesheet Table Skeleton ──────────────────────────────────────────────────

const TimesheetSkeleton = () => (
    <div className="placeholder-glow">
        <table className="table">
            <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                            <td key={col}><span className="placeholder col-12" /></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ── Stat Card Skeleton ────────────────────────────────────────────────────────

const StatCardSkeleton = () => (
    <div className="card">
        <div className="card-body d-flex align-center gap-16 placeholder-glow">
            <div className="avatar avatar-xl placeholder rounded-circle" />
            <div className="flex-grow-1">
                <span className="placeholder col-8 d-block mb-2" />
                <span className="placeholder col-4 d-block" style={{ height: "2rem" }} />
            </div>
        </div>
    </div>
);

// ── Chart options (defined outside component to avoid re-creation) ────────────

const makeSparklineOptions = (color: string, data: number[]) => ({
    series: [{ name: "series1", data }],
    chart: {
        height: 161, width: "100%", type: "area", offsetY: 2,
        toolbar: { show: false }, zoom: { enabled: false },
        sparkline: { enabled: true },
    },
    colors: [color],
    fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.5, stops: [0, 90, 100] },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { curve: "smooth" },
    xaxis: {
        type: "datetime",
        categories: [
            "2025-09-19T00:00:00.000Z", "2025-09-19T01:30:00.000Z",
            "2025-09-19T02:30:00.000Z", "2025-09-19T03:30:00.000Z",
            "2025-09-19T04:30:00.000Z", "2025-09-19T05:30:00.000Z",
            "2025-09-19T06:30:00.000Z",
        ],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { show: false }, crosshairs: { show: false },
        tooltip: { enabled: false },
    },
    yaxis: { show: false },
    tooltip: { x: { format: "dd/MM/yy HH:mm" } },
    grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
});

const sparklineConfigs = [
    { id: "widgetChartYear", color: "#4F46E5", data: [80, 50, 60, 95, 85, 95, 50] },
    { id: "widgetChartYear2", color: "#FEBB7B", data: [80, 50, 60, 95, 85, 95, 50] },
    { id: "widgetChartYear3", color: "#35BE5E", data: [50, 80, 70, 90, 85, 95, 90] },
    { id: "widgetChartYear4", color: "#93E7FE", data: [50, 80, 70, 90, 85, 95, 90] },
    { id: "widgetChartYear5", color: "#F991DC", data: [50, 80, 70, 90, 85, 95, 90] },
];

interface CurrencyFilterForm { Currency: string; }

interface PaymentThusFarData { month: string; totalRevenue: number; }

interface CurrencyData {
    currencyId: number; name: string; code: string;
    symbol: string; isActive: boolean; dateCreated: string;
}

function Dashboard() {
    const { register, control, setValue } = useForm<CurrencyFilterForm>();
    const selectedCurrency = useWatch({ control, name: "Currency" });

    // ── Stats ─────────────────────────────────────────────────────────────────
    const [statsLoading, setStatsLoading] = useState(false);
    const [totalPackages, setTotalPackages] = useState(0);
    const [totalEmployers, setTotalEmployers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalWorkers, setTotalWorkers] = useState(0);
    const [totalContracts, setTotalContracts] = useState(0);
    const [paymentData, setPaymentData] = useState<PaymentThusFarData[]>([]);
    const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);

    // ── Timesheets ────────────────────────────────────────────────────────────
    const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
    const [tsLoading, setTsLoading] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [tsPagination, setTsPagination] = useState({
        page: 1, pageSize: 10, totalCount: 0, totalPages: 1,
    });

    // ── Recent data ───────────────────────────────────────────────────────────
    const [recentEmployersData, setRecentEmployers] = useState<RecentEmployers[]>([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [employersLoading, setEmployersLoading] = useState(false);
    const [jobs, setJobs] = useState<RecentJobs[]>([]);

    const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

    // ── Revenue chart ref (so we can destroy before re-render) ────────────────
    const revenueChartRef = useRef<ApexCharts | null>(null);

    // ── Currencies ────────────────────────────────────────────────────────────
    useEffect(() => {
        fetchCurrencies()
            .then(res => {
                if (res.status === 200) {
                    res.json().then((data) => setCurrencyData(data.data));
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (currencyData.length > 0) {
            setValue("Currency", currencyData.find(d => d.code === "NGN")?.code ?? currencyData[0].code);
        }
    }, [setValue, currencyData]);

    // ── Admin stats ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!selectedCurrency) return;
        setStatsLoading(true);
        fetchAdminData({ Currency: selectedCurrency })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setTotalPackages(data.data.totalPackages);
                        setTotalEmployers(data.data.totalEmployers);
                        setPaymentData(data.data.paymentThusFar);
                        setTotalRevenue(data.data.totalRevenue);
                        setTotalCandidates(data.data.totalCandidates);
                        setTotalWorkers(data.data.totalWorkers);
                        setTotalContracts(data.data.totalContracts);
                    });
                }
            })
            .finally(() => setStatsLoading(false));
    }, [selectedCurrency]);


    useEffect(() => {
        if (paymentData.length === 0) return;

        if (revenueChartRef.current) {
            revenueChartRef.current.destroy();
            revenueChartRef.current = null;
        }

        const el = document.querySelector("#revenueProfitChart");
        if (!el) return;

        const options = {
            series: [{ name: "Revenue", type: "area", data: paymentData.map(i => i.totalRevenue) }],
            chart: {
                toolbar: { show: false }, height: 350, stacked: false,
                dropShadow: { enabled: true, top: 7, left: 1, blur: 3, color: ["transparent", "#000"], opacity: 0.2 },
            },
            stroke: { width: [1.5], curve: "smooth" },
            colors: ["var(--color-primary)"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100],
                    colorStops: [[
                        { offset: 0, color: "rgba(var(--success-rgb),0.15)", opacity: 1 },
                        { offset: 75, color: "rgba(var(--success-rgb),0.15)", opacity: 1 },
                        { offset: 100, color: "rgba(var(--success-rgb),0.15)", opacity: 1 },
                    ]],
                },
            },
            labels: paymentData.map(i => i.month),
            markers: { size: 0 },
            xaxis: {
                type: "month",
                labels: { style: { colors: "var(--color-body)", fontSize: "12px", fontFamily: "var(--ff-body)", fontWeight: 400 } },
            },
            yaxis: {
                min: 0,
                labels: { style: { colors: "var(--color-body)", fontSize: "12px", fontFamily: "var(--ff-body)", fontWeight: 400 } },
            },
            tooltip: {
                shared: true, intersect: false,
                y: {
                    formatter: (y: number | undefined) =>
                        typeof y !== "undefined" ? `${selectedCurrency} ${y.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : y,
                },
            },
            legend: {
                position: "top", fontSize: "14px",
                markers: { radius: 12 },
                itemMargin: { horizontal: 10, vertical: 5 },
                labels: { colors: "var(--color-body)" },
            },
        };

        const chart = new ApexCharts(el, options);
        chart.render();
        revenueChartRef.current = chart;

        return () => {
            chart.destroy();
            revenueChartRef.current = null;
        };
    }, [paymentData, selectedCurrency]);


    useEffect(() => {
        const cleanups: (() => void)[] = [];
        sparklineConfigs.forEach(({ id, color, data }) => {
            const el = document.querySelector(`#${id}`);
            if (!el) return;
            const chart = new ApexCharts(el, makeSparklineOptions(color, data));
            chart.render();
            cleanups.push(() => chart.destroy());
        });
        return () => cleanups.forEach(fn => fn());
    }, []);

    // ── Timesheets ────────────────────────────────────────────────────────────
    const fetchAllTimesheets = async (page = 1) => {
        setTsLoading(true);
        try {
            const response: TimesheetPagedDto = await getAllTimesheetsForAdmin(
                page,
                tsPagination.pageSize,
                "Submitted",
                "",
            );
            if (response?.items) {
                setTimesheets(response.items);
                setTsPagination(prev => ({
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
            setTsLoading(false);
        }
    };

    useEffect(() => { fetchAllTimesheets(1); }, []);

    const handleReview = async (timesheetId: number, action: "approved" | "rejected") => {
        setModalLoading(true);
        setProcessingId(timesheetId);
        try {
            const res = await reviewTimesheet(
                timesheetId,
                action === "approved" ? "Approved" : "Rejected",
                "",
            );
            if (res.ok) {
                toast.success(`Timesheet ${action} successfully`);
                await fetchAllTimesheets(tsPagination.page);
                setShowDetailModal(false);
                setSelectedTimesheet(null);
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

    // ── Recent jobs & employers ───────────────────────────────────────────────
    useEffect(() => {
        setJobsLoading(true);
        GetRecentJobs(5)
            .then(res => setJobs(res.data))
            .catch(() => console.error("Cannot fetch recent jobs"))
            .finally(() => setJobsLoading(false));

        setEmployersLoading(true);
        getRecentEmployers(5)
            .then(res => setRecentEmployers(res.data))
            .catch(() => console.error("Cannot fetch recent employers"))
            .finally(() => setEmployersLoading(false));
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const resolveImg = (path: string | undefined | null, fallback = latty_mini) => {
        if (!path) return fallback;
        return path.startsWith("http") ? path : `${BASE_URL}${path}`;
    };

    const statCards = [
        { label: "Total Packages", value: totalPackages, color: "primary", Icon: FolderOpenDot },
        { label: "Total Revenue", value: `${selectedCurrency ?? ""} ${totalRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, color: "warning", Icon: BanknoteArrowUp },
        { label: "Total Contracts", value: totalContracts, color: "info", Icon: Handshake },
        { label: "Total Employers", value: totalEmployers, color: "purple", Icon: Briefcase },
        { label: "Total Candidates", value: totalCandidates, color: "success", Icon: UserPlus },
        { label: "Total Workers", value: totalWorkers, color: "slateblue", Icon: FolderKanban },
    ];

    return (
        <div className="container-fluid">
            <ToastContainer />

            <div className="row mb-4">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15 py-3">
                        <div>
                            <h1 className="page-title fs-24 mb-5">
                                {/* {dashboardData.welcome.greeting} */}
                                Welcome
                                {/* {user?.lastName} */}
                            </h1>
                            <p className="text-muted">
                                Here's what needs your attention today
                            </p>
                        </div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard">Dashboard</a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>


            <div className="row">

                {/* ── Page title ── */}
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Dashboard</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="breadcrumb-item">
                                    <NavLink to="/Dashboard">Dashboard</NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* ── Currency selector ── */}
                <div className="col-12 d-flex justify-content-end mb-4 gap-4">
                    <div className="dataTables-sorting-control">
                        <select className="form-select sorting-dropdown" style={{ width: "100px" }} {...register("Currency")}>
                            {currencyData.map((d, i) => (
                                <option key={i} value={d.code}>{d.code}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Stat cards ── */}
                {statCards.map(({ label, value, color, Icon }) => (
                    <div key={label} className="col-12 col-lg-4 col-md-6">
                        {statsLoading ? <StatCardSkeleton /> : (
                            <div className="card">
                                <div className="card-body d-flex align-center gap-16">
                                    <div className={`avatar avatar-xl bg-${color}-transparent text-${color}`}>
                                        <Icon size={42} />
                                    </div>
                                    <div className="card-content">
                                        <span className="d-block fs-16 mb-5">{label}</span>
                                        <h2 className="mb-5">{typeof value === "number" ? value.toLocaleString("en-NG") : value}</h2>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* ── Revenue chart ── */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4>Revenue Report</h4>
                        </div>
                        <div className="card-body mini-card-body pt-15">
                            {statsLoading
                                ? <div className="placeholder-glow"><span className="placeholder col-12" style={{ height: 350 }} /></div>
                                : <div id="revenueProfitChart" />
                            }
                        </div>
                    </div>
                </div>

                {/* ── Timesheets table ── */}
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Pending Timesheets</h5>
                            <NavLink to="/timesheets" className="btn btn-sm btn-outline-info">
                                View All
                            </NavLink>
                        </div>
                        <div className="card-body mt-15">
                            {tsLoading ? <TimesheetSkeleton /> : (
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
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {timesheets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={8} className="text-center py-5 text-muted">
                                                            <AlertCircle size={40} className="mb-3 d-block mx-auto" />
                                                            <h6>No pending timesheets</h6>
                                                            <p className="small mb-0">All timesheets have been reviewed</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    timesheets.map((ts) => (
                                                        <tr key={ts.timesheetId}>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <img
                                                                        src={resolveImg(ts.employeeAvatar)}
                                                                        alt={ts.employeeName}
                                                                        className="img-fluid rounded-circle"
                                                                        width="30" height="30"
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
                                                                <span className="badge bg-label-primary">
                                                                    {ts.totalRegularHrs.toFixed(1)}h
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {ts.totalOvertimeHrs > 0
                                                                    ? <span className="badge bg-label-warning">{ts.totalOvertimeHrs.toFixed(1)}h</span>
                                                                    : <span className="text-muted">—</span>}
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
                                                                ) : <span className="text-muted small">—</span>}
                                                            </td>
                                                            <td><StatusBadge status={ts.status} /></td>
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
                                    {tsPagination.totalPages > 1 && (
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <small className="text-muted">
                                                Showing {((tsPagination.page - 1) * tsPagination.pageSize) + 1}–
                                                {Math.min(tsPagination.page * tsPagination.pageSize, tsPagination.totalCount)} of{" "}
                                                {tsPagination.totalCount} entries
                                            </small>
                                            <nav>
                                                <ul className="pagination mb-0">
                                                    <li className={`page-item ${tsPagination.page === 1 ? "disabled" : ""}`}>
                                                        <button className="page-link" onClick={() => fetchAllTimesheets(tsPagination.page - 1)}>
                                                            Previous
                                                        </button>
                                                    </li>
                                                    {[...Array(tsPagination.totalPages)].map((_, i) => (
                                                        <li key={i + 1} className={`page-item ${tsPagination.page === i + 1 ? "active" : ""}`}>
                                                            <button className="page-link" onClick={() => fetchAllTimesheets(i + 1)}>
                                                                {i + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${tsPagination.page === tsPagination.totalPages ? "disabled" : ""}`}>
                                                        <button className="page-link" onClick={() => fetchAllTimesheets(tsPagination.page + 1)}>
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

                {/* ── Recent Jobs & Employers ── */}
                <div className="col-lg-6 col-12">
                    <div className="card height-equal">
                        <div className="card-header justify-between">
                            <h4>Recent Jobs</h4>
                        </div>
                        <div className="card-body pt-15">
                            {jobsLoading ? (
                                <div className="placeholder-glow">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="d-flex align-items-center gap-3 mb-3">
                                            <span className="placeholder rounded-circle" style={{ width: 40, height: 40, flexShrink: 0 }} />
                                            <div className="flex-grow-1">
                                                <span className="placeholder col-7 d-block mb-1" />
                                                <span className="placeholder col-4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ul className="list-unstyled mb-0">
                                    {jobs.map(data => (
                                        <li key={data.jobId} className="newListing">
                                            <a href={`JobMgt/${hashIds.encode(String(data.jobId))}/${hashIds.encode(String(data.employerId))}`} className="d-flex-between mb-15">
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-md radius-100">
                                                        <img className="radius-100" src={resolveImg(data.jobPhoto)} alt={data.jobTitle} />
                                                    </div>
                                                    <div className="text-start">
                                                        <h6 className="mb-0">{data.jobTitle}</h6>
                                                        <span className="text-info">{data.employer}</span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fs-16 fw-6">{data.totalApplications}</div>
                                                    <span className="fs-14 text-info">Applicants</span>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4>New Clients</h4>
                        </div>
                        <div className="card-body pt-15">
                            {employersLoading ? (
                                <div className="placeholder-glow">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="d-flex align-items-center gap-3 mb-3">
                                            <span className="placeholder rounded-circle" style={{ width: 40, height: 40, flexShrink: 0 }} />
                                            <div className="flex-grow-1">
                                                <span className="placeholder col-6 d-block mb-1" />
                                                <span className="placeholder col-8" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bd-progress-wrapper">
                                    {recentEmployersData.map(data => (
                                        <li key={data.employerId} className="newListing">
                                            {/* FIX: was incorrectly using employerName as image path */}
                                            <a href={`EmployerMgt/${hashIds.encode(String(data.employerId))}`} className="d-flex-between mb-15">
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-md radius-100">
                                                        <img className="radius-100" src={resolveImg(data.employerLogo)} alt={data.employerName} />
                                                    </div>
                                                    <div className="text-start">
                                                        <h6 className="mb-0">{data.employerName}</h6>
                                                        <span className="text-info">
                                                            Joined: {new Date(data.dateCreated).toLocaleDateString("en-GB", {
                                                                day: "2-digit", month: "short", year: "numeric",
                                                            })} | Workers: {data.totalWorkers}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fs-16 fw-6">{data.totalJobs}</div>
                                                    <span className="fs-14 text-info">Total Jobs</span>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Approve confirmation modal ── */}
            {modalType === "approve" && selectedTimesheet && (
                <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", inset: 0, zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Approve Timesheet</h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to approve this timesheet? This cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={() => { setModalType(null); setSelectedTimesheet(null); }}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success btn-sm"
                                    disabled={modalLoading}
                                    onClick={() => handleReview(selectedTimesheet.timesheetId, "approved")}
                                >
                                    {modalLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <CheckCheck size={14} className="me-1" />}
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Reject confirmation modal ── */}
            {modalType === "reject" && selectedTimesheet && (
                <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", inset: 0, zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reject Timesheet</h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to reject this timesheet? This cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={() => { setModalType(null); setSelectedTimesheet(null); }}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    disabled={modalLoading}
                                    onClick={() => handleReview(selectedTimesheet.timesheetId, "rejected")}
                                >
                                    {modalLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <XCircle size={14} className="me-1" />}
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Detail modal ── */}
            {showDetailModal && selectedTimesheet && (
                <div className="modal show fade" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", inset: 0, zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title mb-0">Timesheet Detail</h5>
                                    <small className="text-muted">{selectedTimesheet.employeeName} · {selectedTimesheet.employerName}</small>
                                </div>
                                <button type="button" className="btn-close" onClick={() => { setShowDetailModal(false); setSelectedTimesheet(null); }} />
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr><td width="120"><strong>Employee:</strong></td><td>{selectedTimesheet.employeeName}</td></tr>
                                                <tr><td><strong>Employer:</strong></td><td>{selectedTimesheet.employerName}</td></tr>
                                                <tr><td><strong>Status:</strong></td><td><StatusBadge status={selectedTimesheet.status} /></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <td width="120"><strong>Period:</strong></td>
                                                    <td>{fmt(selectedTimesheet.periodStartDate)} — {fmt(selectedTimesheet.periodEndDate)}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Days Worked:</strong></td>
                                                    <td>{selectedTimesheet.daysWorked ?? "—"} / {selectedTimesheet.standardDays ?? "—"} scheduled</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Total Hours:</strong></td>
                                                    <td><span className="badge bg-label-info">{selectedTimesheet.totalHours.toFixed(1)}h</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row g-3 mb-3">
                                    {[
                                        { label: "Regular Hours", value: selectedTimesheet.totalRegularHrs, color: "info" },
                                        { label: "Overtime Hours", value: selectedTimesheet.totalOvertimeHrs, color: "warning" },
                                        { label: "Total Hours", value: selectedTimesheet.totalHours, color: "dark" },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="col-md-4">
                                            <div className="card border mb-0">
                                                <div className="card-body p-3 text-center">
                                                    <small className="d-block mb-1 text-muted">{label}</small>
                                                    <h4 className={`mb-0 text-${color}`}>{value.toFixed(1)}h</h4>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {selectedTimesheet.amountDue != null && (
                                    <div className="d-flex justify-content-end">
                                        <div className="border rounded p-2" style={{ minWidth: 260 }}>
                                            {(selectedTimesheet.absentDays ?? 0) > 0 && (
                                                <small className="text-danger d-flex justify-content-between">
                                                    <span>Absent deduction:</span>
                                                    <span>− {selectedTimesheet.currencyCode} {fmtNaira(selectedTimesheet.absentDeduction ?? 0)}</span>
                                                </small>
                                            )}
                                            <div className="d-flex justify-content-between border-top pt-1 mt-1">
                                                <span className="fw-medium">Amount Due:</span>
                                                <span className="fw-bold text-success">
                                                    {selectedTimesheet.currencyCode} {fmtNaira(selectedTimesheet.amountDue)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-dark btn-sm" onClick={() => { setShowDetailModal(false); setSelectedTimesheet(null); }}>
                                    Close
                                </button>
                                {selectedTimesheet.status === "Submitted" && (
                                    <>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            disabled={processingId === selectedTimesheet.timesheetId}
                                            onClick={() => handleReview(selectedTimesheet.timesheetId, "rejected")}
                                        >
                                            {processingId === selectedTimesheet.timesheetId
                                                ? <span className="spinner-border spinner-border-sm me-1" />
                                                : <XCircle size={14} className="me-1" />}
                                            Reject
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm"
                                            disabled={processingId === selectedTimesheet.timesheetId}
                                            onClick={() => handleReview(selectedTimesheet.timesheetId, "approved")}
                                        >
                                            {processingId === selectedTimesheet.timesheetId
                                                ? <span className="spinner-border spinner-border-sm me-1" />
                                                : <CheckCheck size={14} className="me-1" />}
                                            Approve
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .newListing:hover { transition: transform 0.2s; background-color: #e5e7eb; }
                .newListing { padding: 5px 15px; border-radius: 5px; list-style: none; }
            `}</style>
        </div>
    );
}

export default Dashboard;