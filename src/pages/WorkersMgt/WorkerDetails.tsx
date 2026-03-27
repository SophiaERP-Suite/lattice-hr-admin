import {
    Building,
    Cake,
    CalendarClock,
    Mail,
    MapPinHouse,
    Phone,
    Venus,
    CreditCard,
    MapPin,
    Layers,
    Tag,
    User,
    AlertCircle,
    ChevronRight,
    Globe,
    MapPinned,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getBankDetails, getJobSeekerInfo } from "../../api/JobSeekerApi";
import "react-toastify/dist/ReactToastify.css";

// ─── Types ──

interface JobSeekerDto {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    profilePhoto: string;
    dateOfBirth: string;
    dateCreated: string;
    jobSeekerId: number;
    jobSector: string;
    jobCategory: string;
    address: string;
    country: string;
    state: string;
    city: string;
    countryId: number;
    stateId: number;
    cityId: number;
    jobCategoryId: number;
    jobSectorId: number;
    jobSeekerDate: string;
}

interface BankDetailDto {
    bankDetailId: number;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
    routingNumber: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const calculateAge = (dateOfBirth: Date): string => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const birthdayPassed =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!birthdayPassed) age--;
    return age > 1 ? `${age} Years` : `${age} Year`;
};

const fmtDate = (d: string): string =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '—';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
    }
    return phone;
};

// ─── UI Components ─────

const InfoRow = ({ icon, label, value, highlight = false }: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    highlight?: boolean;
}) => (
    <div className="d-flex align-items-start gap-3 py-2 border-bottom border-light">
        <span className="text-black" style={{ minWidth: 20 }}>{icon}</span>
        <div className="flex-grow-1">
            <span className="text-black d-block" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </span>
            <span className={`fw-medium ${highlight ? 'text-primary' : ''}`}>
                {value || '—'}
            </span>
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="card-header bg-white border-bottom-0 pt-4 px-4">
        <h5 className="mb-0 d-flex align-items-center gap-2">

            {title}
        </h5>
    </div>
);

const LoadingSkeleton = () => (
    <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12 mb-4">
                <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-4">
                <div className="card mb-3">
                    <div className="card-body text-center">
                        <div className="skeleton rounded-circle mx-auto mb-3" style={{ width: '88px', height: '88px' }}></div>
                        <div className="skeleton mb-2" style={{ height: '24px', width: '70%', margin: '0 auto' }}></div>
                        <div className="skeleton mb-3" style={{ height: '20px', width: '50%', margin: '0 auto' }}></div>
                        <hr />
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="skeleton mb-3" style={{ height: '40px', width: '100%' }}></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="col-xxl-9 col-xl-8 col-lg-8">
                <div className="skeleton" style={{ height: '300px', width: '100%' }}></div>
            </div>
        </div>
    </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <AlertCircle size={48} className="text-danger mb-3" />
                        <h5 className="mb-2">Failed to Load Worker Details</h5>
                        <p className="text-black mb-3">{message}</p>
                        <button className="btn btn-primary" onClick={onRetry}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// ─── Main Component ────

export default function WorkerDetails() {
    const { jobSeekerId, clientId } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const decodedJobSeekerId = jobSeekerId ? Number(hashIds.decode(jobSeekerId)[0]) : 0;

    const [worker, setWorker] = useState<JobSeekerDto | null>(null);
    const [bankDetail, setBankDetail] = useState<BankDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (decodedJobSeekerId) {
            loadAllData();
        } else if (jobSeekerId) {
            setError("Invalid worker ID");
            setLoading(false);
        } else {
            setError("No worker ID provided");
            setLoading(false);
        }
    }, [decodedJobSeekerId, jobSeekerId]);

    const loadAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([fetchUser(), fetchBank()]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load worker details");
            toast.error("Failed to load worker details");
        } finally {
            setLoading(false);
        }
    };

    const fetchBank = async () => {
        try {
            const res = await getBankDetails(decodedJobSeekerId);
            if (res) {
                setBankDetail(res);
            }
        } catch (error) {
            console.error("Failed to load bank details:", error);
        }
    };

    const fetchUser = async () => {
        const response = await getJobSeekerInfo(decodedJobSeekerId);
        if (response?.result) {
            setWorker(response.result);
        } else {
            throw new Error("Worker not found");
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={loadAllData} />;
    if (!worker) return <ErrorState message="Worker not found" onRetry={loadAllData} />;

    return (
        <div className="container-fluid">
            <ToastContainer position="top-right" autoClose={5000} />

            {/* Custom CSS for skeleton loading */}
            <style>{`
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 4px;
                }
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .hover-lift {
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .card-modified {
                    background-color: var(--color-card-bg);
                    padding: 25px 25px !important;
                    box-shadow: var(--shadow) !important;
                    border-radius: 6px !important;
                    position: relative !important;
                    margin-bottom: 0px !important;
                    border: none !important;
                }
            `}</style>

            {/* Breadcrumb */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Worker Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    Worker Details
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/ClientMgt/${clientId}`}>Client Details</NavLink>
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
                {/* Left Column - Profile & Bank Details */}
                <div className="col-xxl-3 col-xl-4 col-lg-4">
                    {/* Profile Card */}
                    <div className="card hover-lift mb-4">
                        <div className="card-body text-center pt-4">
                            <div className="mb-3 position-relative d-inline-block">
                                <img
                                    src={
                                        worker.profilePhoto
                                            ? worker.profilePhoto.startsWith('/')
                                                ? `http://localhost:5127${worker.profilePhoto}`
                                                : worker.profilePhoto
                                            : 'https://ui-avatars.com/api/?background=4f46e5&color=fff&bold=true&name=' +
                                            encodeURIComponent(`${worker.firstName} ${worker.lastName}`)
                                    }
                                    alt={`${worker.firstName} ${worker.lastName}`}
                                    className="rounded-circle border border-3 border-primary"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://ui-avatars.com/api/?background=4f46e5&color=fff&bold=true&name=${worker.firstName}+${worker.lastName}`;
                                    }}
                                />
                            </div>

                            <h4 className="mb-1">{worker.firstName} {worker.lastName}</h4>
                            <div className="gap-2 mb-3">
                                <div>
                                    <span className="badge bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill">
                                        {worker.jobSector || 'No Sector'}
                                    </span>
                                </div>
                                <div className="mt-15">

                                    {worker.jobCategory && (
                                        <span className="badge bg-secondary bg-opacity-10 text-white px-3 py-2 rounded-pill">
                                            {worker.jobCategory}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <hr className="my-3" />

                            <div className="text-start">
                                <InfoRow icon={<Mail size={16} />} label="Email" value={worker.email} />
                                <InfoRow icon={<Phone size={16} />} label="Phone" value={formatPhoneNumber(worker.phone)} />
                                <InfoRow
                                    icon={<Cake size={16} />}
                                    label="Date of Birth"
                                    value={
                                        worker.dateOfBirth
                                            ? `${fmtDate(worker.dateOfBirth)} (${calculateAge(new Date(worker.dateOfBirth))})`
                                            : undefined
                                    }
                                />
                                <InfoRow icon={<Venus size={16} />} label="Gender" value={worker.gender} />
                                <InfoRow icon={<CalendarClock size={16} />} label="Member Since" value={fmtDate(worker.dateCreated)} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - Additional Details */}
                <div className="col-xxl-9 col-xl-8 col-lg-8">
                    <div className="row g-4">
                        {/* Location Card */}
                        <div className="col-md-6">
                            <div className="card hover-lift h-100">
                                <SectionHeader title="Location Information" />
                                <div className="card-body pt-0 px-4 pb-4">
                                    {worker.address && (
                                        <InfoRow icon={<MapPinHouse size={16} />} label="Address" value={worker.address} />
                                    )}
                                    <InfoRow icon={<MapPinned size={16} />} label="City" value={worker.city} />
                                    <InfoRow icon={<MapPin size={16} />} label="State/Province" value={worker.state} />
                                    <InfoRow icon={<Globe size={16} />} label="Country" value={worker.country} />
                                </div>
                            </div>
                        </div>

                        {/* Professional Card */}
                        <div className="col-md-6">
                            <div className="card hover-lift h-100">
                                <SectionHeader title="Professional Information" />
                                <div className="card-body pt-0 px-4 pb-4">
                                    <InfoRow icon={<Layers size={16} />} label="Job Sector" value={worker.jobSector} />
                                    <InfoRow icon={<Tag size={16} />} label="Job Category" value={worker.jobCategory} />
                                    {worker.jobSeekerDate && (
                                        <InfoRow icon={<CalendarClock size={16} />} label="Job Seeker Since" value={fmtDate(worker.jobSeekerDate)} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats Card - Optional */}
                        <div className="col-12 mb-0">
                            <div className="card-modified bg-gradient-primary mb-0 bg-opacity-5" style={{ marginBottom: "0px" }}>
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-sm-4 mb-3 mb-sm-0">
                                            <div className="display-6 fw-bold text-primary">
                                                {calculateAge(new Date(worker.dateOfBirth))}
                                            </div>
                                            <div className="text-black small">Age</div>
                                        </div>
                                        <div className="col-sm-4 mb-3 mb-sm-0">
                                            <div className="display-6 fw-bold text-primary">
                                                {fmtDate(worker.dateCreated)}
                                            </div>
                                            <div className="text-black small">Member Since</div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="display-6 fw-bold text-primary">
                                                {worker.gender || '—'}
                                            </div>
                                            <div className="text-black small">Gender</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">

                            {/* Bank Details Card */}
                            {bankDetail && (
                                <div className="card hover-lift">
                                    <SectionHeader title="Bank Details" />
                                    <div className="card-body pt-0 px-4 pb-4">
                                        <InfoRow icon={<Building size={16} />} label="Bank Name" value={bankDetail.bankName} />
                                        <InfoRow icon={<User size={16} />} label="Account Holder" value={bankDetail.accountHolderName} />
                                        <InfoRow icon={<CreditCard size={16} />} label="Account Number" value={bankDetail.accountNumber} highlight />
                                        {bankDetail.swiftCode && (
                                            <InfoRow icon={<Tag size={16} />} label="Swift Code" value={bankDetail.swiftCode} />
                                        )}
                                        {bankDetail.routingNumber && (
                                            <InfoRow icon={<Tag size={16} />} label="Routing Number" value={bankDetail.routingNumber} />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}