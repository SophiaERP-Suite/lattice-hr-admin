import {
    Blocks,
    BriefcaseBusiness,
    CheckCheck,
    ChevronRight,
    CircleCheck,
    Eye,
    FolderOpen,
    GlobeLock,
    Layers,
    LocateFixed,
    Mail,
    MapPinHouse,
    Phone,
    Plus,
    TrendingUp,
    VectorSquare,
    X,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import { addNewROfficer, fetchEmployerById } from "../../utils/EmployerRequests";
import Tippy from "@tippyjs/react";
import { fetchAllJobs, updateJob } from "../../utils/JobRequests";
import { toast, ToastContainer } from "react-toastify";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { fetchAllOfficers } from "../../utils/OfficerRequests";
import { useForm, useWatch } from "react-hook-form";
import Modal from 'react-modal';
import { addNewWorker, fetchAllWorkers } from "../../utils/WorkerRequests";
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";
import type { JobOfferListItem } from "../../types/JobOffer";
import { GetAllEmployerOffers, GetEmployerOffers } from "../../utils/JobOfferRequest";
import dayjs from "dayjs";

interface EmployerData {
    employerId: number;
    businessName: string;
    jobSectorId: string;
    jobSector: string;
    companySize: string;
    registrationNo: string;
    websiteUrl: string;
    employerLogo: string;
    countryId: string;
    country: string;
    packageId: string;
    package: string;
    packageItemReference: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    address: string;
    postCode: string;
    companyMail: string;
    companyPhone: string;
    dateCreated: string;
    officers: string;
    jobsPosted: string;
}

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
    published: boolean
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

interface ROfficerRegister {
    Email: string;
    FirstName: string;
    LastName: string;
    Phone: string;
    Position: string;
    Password: string;
    ConfirmPassword: string;
    Gender: string;
    DateOfBirth: string;
    ProfilePhoto: string;
}

interface WorkerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    designation: string;
    email: string;
    phone: string;
    profilePhoto: string;
    joinDate: string;
    countryId: string;
    country: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    dateCreated: string;
    userId: number;
    workerId: number;
    employer: string;
    employerId: number;
    employerLogo: string;
}

interface WorkerFilterData {
    UserName: string;
}

interface WorkerRegister {
    FirstName: string
    LastName: string
    Email: string
    Phone: string
    Address: string
    CountryId: string
    StateId: string
    CityId: string
    PostCode: string
    Password: string
    Gender: string
    ProfilePhoto: string
    DateOfBirth: string
    EmployerId: string
    Designation: string
    JoinDate: string
    ConfirmPassword: string;
}

interface CountryData {
    countryId: number;
    name: string;
    code: string;
}

interface StateData {
    stateId: number;
    name: string;
    code: string;
}

interface CityData {
    cityId: number;
    name: string;
    code: string;
}

export default function ClientDetails() {
    const { id } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [employerDetails, setEmployerDetails] = useState<EmployerData | null>(null);
    const [totalJobs, setTotalJobs] = useState(0);
    const [jobPageNumber, setJobPageNumber] = useState(1);
    const jobLimit = 10
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [totalOfficers, setTotalOfficers] = useState(0);
    const [officePageNumber, setOfficePageNumber] = useState(1);
    const officerLimit = 10;
    const [officers, setOfficers] = useState<OfficerData[]>([]);
    const {
        register,
        formState,
        handleSubmit,
        reset,
        control
    } = useForm<ROfficerRegister>()
    const { errors } = formState;
    const [addModalState, setAddModalState] = useState(false);
    const password = useWatch({
        control,
        name: 'Password',
    });
    const [workers, setWorkers] = useState<WorkerData[]>([]);
    const [workerPageNumber, setWorkerPageNumber] = useState(1);
    const workerLimit = 10;
    const { register: filterRegister, control: filterControl } = useForm<WorkerFilterData>();
    const filters = useWatch({ control: filterControl })
    const [totalWorkers, setTotalWorkers] = useState(0);
    const [workModalState, setWorkerModalState] = useState(false);
    const {
        setValue,
        control: workerControl,
        register: workerRegister,
        formState: { errors: workerErrors, isValid },
        handleSubmit: handleWorkerSubmit,
        reset: resetWorker
    } = useForm<WorkerRegister>();
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);
    const selectedCountry = useWatch({
        control: workerControl,
        name: 'CountryId',
    });
    const selectedState = useWatch({
        control: workerControl,
        name: 'StateId',
    });
    const workerPassword = useWatch({
        control: workerControl,
        name: 'Password',
    });

    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const [offers, setOffers] = useState<JobOfferListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalOffers, setTotalOffers] = useState(0);
    const [SentOffers, setSentOffers] = useState(0);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [acceptanceRate, setAcceptanceRate] = useState(0);

    useEffect(() => {
        fetchEmployerById(hashedId)
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            console.log(data);
                            setEmployerDetails(data.data);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [hashedId]);

    useEffect(() => {
        fetchAllJobs({
            pageNumber: jobPageNumber,
            limit: jobLimit,
            employerId: hashedId
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            setJobs(data.data.jobs);
                            setTotalJobs(data.data.totalCount);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [jobPageNumber, jobLimit, hashedId]);

    useEffect(() => {
        fetchAllOfficers({
            pageNumber: officePageNumber,
            limit: officerLimit,
            employerId: hashedId
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            setOfficers(data.data.officers);
                            setTotalOfficers(data.data.totalCount);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [officePageNumber, officerLimit, hashedId]);

    useEffect(() => {
        fetchCountries()
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            setCountries(data.data);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
            .catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        if (!selectedCountry || selectedCountry == '') {
            setStates([]);
            setValue('StateId', '');
            setValue('CityId', '')
            return;
        }
        fetchStatesByCountryId(Number(selectedCountry))
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            setStates(data.data);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
            .catch((err) => console.log(err))
    }, [selectedCountry, setValue]);

    useEffect(() => {
        if (!selectedState || selectedState == '') {
            setCities([]);
            setValue('CityId', '')
            return;
        }
        fetchCitiesByStateId(Number(selectedState))
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            console.log(data)
                            setCities(data);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
            .catch((err) => console.log(err))
    }, [selectedState, setValue]);

    const submitWorker = async (data: WorkerRegister) => {
        if (isValid && hashedId) {
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append("FirstName", data.FirstName);
            formData.append("LastName", data.LastName);
            formData.append("Email", data.Email);
            formData.append("Phone", data.Phone);
            formData.append("Address", data.Address);
            formData.append("CountryId", data.CountryId);
            formData.append("StateId", data.StateId);
            formData.append("CityId", data.CityId);
            formData.append("PostCode", data.PostCode);
            formData.append("Password", data.Password);
            formData.append("Gender", data.Gender);
            formData.append("ProfilePhoto", data.ProfilePhoto[0]);
            formData.append("DateOfBirth", data.DateOfBirth);
            formData.append("EmployerId", `${hashedId}`);
            formData.append("Designation", data.Designation);
            formData.append("JoinDate", data.JoinDate);
            const res = await addNewWorker(formData);
            handleCreateEmployee(res, loader, text, { toast }, resetWorker)
                .finally(() => {
                    setWorkerModalState(false);
                    refetchWorkers();
                })
        }
    }

    useEffect(() => {
        fetchAllWorkers({
            pageNumber: workerPageNumber,
            limit: workerLimit,
            ...filters,
            EmployerId: hashedId
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            console.log(data);
                            setWorkers(data.data.workers);
                            setTotalWorkers(data.data.totalCount);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [workerPageNumber, workerLimit, filters, hashedId]);

    const refetchWorkers = async () => {
        const res = await fetchAllWorkers({
            pageNumber: workerPageNumber,
            limit: workerLimit,
            ...filters,
            EmployerId: hashedId
        });
        if (res.status === 200 || res.status === 201) {
            const data = await res.json();
            setWorkers(data.data.workers);
            setTotalWorkers(data.data.totalCount);
        } else {
            const data = await res.text();
            console.log(JSON.parse(data));
        }
    }

    const refetchJobs = async () => {
        try {
            const res = await fetchAllJobs({
                pageNumber: jobPageNumber,
                limit: jobLimit,
                employerId: hashedId
            });
            if (res.status === 200) {
                const data = await res.json()
                setJobs(data.data.jobs);
                setTotalJobs(data.data.totalCount);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const refetchOfficers = async () => {
        try {
            const res = await fetchAllOfficers({
                pageNumber: officePageNumber,
                limit: officerLimit,
                employerId: hashedId
            });
            if (res.status === 200) {
                const data = await res.json()
                setOfficers(data.data.officers);
                setTotalOfficers(data.data.totalCount);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };


    const loadOffers = async () => {
        setLoading(true);
        setError(null);

        try {
            let statusString: string | undefined = undefined;
            if (statusFilter) {
                statusString = statusFilter;
            }

            const response = await GetEmployerOffers(
                search || "",
                statusString,
                pagination.pageNumber,
                pagination.pageSize,
                hashedId
            );

            console.log('GetEmployerOffers API response:', response);

            if (response.statusCode === 200) {
                const data = response.data;
                setOffers(data);
                setPagination({
                    pageNumber: data.pageNumber,
                    pageSize: data.pageSize,
                    totalCount: data.totalCount,
                    totalPages: data.totalPages
                });


            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to load offers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadAllOffers = async () => {
        setStatsLoading(true);
        try {
            const response = await GetAllEmployerOffers(hashedId);
            console.log("load", response)
            if (response.statusCode === 200) {
                const data = response;
                calculateStats(data?.data || [], data?.data.length || 0);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to load all offers');
            console.error(err);
        } finally {
            setStatsLoading(false);
        }
    };

    const calculateStats = (items: JobOfferListItem[], total: number) => {
        setTotalOffers(total);

        // Add safety check for items array
        const Sent = (items || []).filter(o => o.offerStatus === "Sent").length;
        const accepted = (items || []).filter(o => o.offerStatus === "Accepted").length;

        setSentOffers(Sent);
        // setAcceptedOffers(accepted);

        const decidedOffers = (items || []).filter(o =>
            o.offerStatus === "Accepted" ||
            o.offerStatus === "Declined"
        ).length;

        if (decidedOffers > 0) {
            setAcceptanceRate(Math.round((accepted / decidedOffers) * 100));
        } else {
            setAcceptanceRate(0);
        }
    };

    useEffect(() => {
        loadOffers();
        loadAllOffers();
    }, [pagination.pageNumber, pagination.pageSize, search, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPagination(prev => ({ ...prev, pageNumber: 1 }));
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPagination(prev => ({ ...prev, pageNumber: 1 }));
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPagination(prev => ({
            ...prev,
            pageSize: parseInt(e.target.value),
            pageNumber: 1
        }));
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, pageNumber: page }));
    };


    const updateJobStatus = async (jobId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("Published", String(status));
        const res = await updateJob(jobId, formData);
        handleCreateEmployee(res, null, null, { toast }, null)
            .finally(async () => {
                await refetchJobs();
            });
    }

    const submitOfficer = async (data: ROfficerRegister) => {
        if (!errors.FirstName && !errors.LastName &&
            !errors.ProfilePhoto && !errors.Phone &&
            !errors.Email && !errors.DateOfBirth &&
            !errors.Gender && !errors.Password &&
            !errors.Position
        ) {
            const loader = document.getElementById('query-loader');
            const text = document.getElementById('query-text');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append('FirstName', data.FirstName);
            formData.append('LastName', data.LastName);
            formData.append('ProfilePhoto', data.ProfilePhoto[0]);
            formData.append('Phone', data.Phone);
            formData.append('Email', data.Email);
            formData.append('DateOfBirth', data.DateOfBirth);
            formData.append('Gender', data.Gender);
            formData.append('Position', data.Position);
            formData.append('Password', data.Password);
            formData.append('EmployerId', `${hashedId}`);
            const res = await addNewROfficer(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
                .finally(() => {
                    setAddModalState(false);
                    refetchOfficers();
                })
        }
    }

    return (
        <div className="container-fluid">
            <ToastContainer />
            <Modal isOpen={addModalState} onRequestClose={() => { setAddModalState(false); }}
                style={{
                    content: {
                        width: 'fit-content',
                        height: 'fit-content',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgb(255 255 255)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)'
                    }
                }}
            >

                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                    <form noValidate onSubmit={handleSubmit(submitOfficer)}>
                        <div className="d-flex justify-content-between border-bottom">
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Responsibility Officer</h1>
                            <button type="button" className="btn-close" onClick={() => setAddModalState(false)}></button>
                        </div>
                        <div className="mt-4">
                            <div className="row gy-15">
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">First Name</label>
                                    <input type="text" className="form-control" placeholder="First Name"
                                        {
                                        ...register('FirstName',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.FirstName?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" placeholder="Last Name"
                                        {
                                        ...register('LastName',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.LastName?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Email</label>
                                    <input type="text" className="form-control" placeholder="Email"
                                        {
                                        ...register('Email',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.Email?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Phone</label>
                                    <input type="text" className="form-control" placeholder="Phone"
                                        {
                                        ...register('Phone',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.Phone?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="logo" className="form-label">Profile Photo</label>
                                    <input type="file" className="form-control" id="logo" placeholder="Profile Photo"
                                        {
                                        ...register('ProfilePhoto',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.ProfilePhoto?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <div>
                                        <label htmlFor="jobSector" className="form-label">Gender</label>
                                        <select className="form-select" id="jobSector" {
                                            ...register('Gender',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <p className='error-msg'>{errors.Gender?.message}</p>
                                    </div>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Position</label>
                                    <input type="text" className="form-control" placeholder="Position"
                                        {
                                        ...register('Position',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.Position?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Date Of Birth</label>
                                    <input type="date" className="form-control" placeholder="Date Of Birth"
                                        {
                                        ...register('DateOfBirth',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.DateOfBirth?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Password</label>
                                    <input type="password" className="form-control" placeholder="Password"
                                        {
                                        ...register('Password',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{errors.Password?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" placeholder="Confirm Password"
                                        {...register('ConfirmPassword', {
                                            required: 'Confirm your password',
                                            validate: (value) =>
                                                value === password || 'Passwords do not match',
                                        })}
                                    />
                                    <p className='error-msg'>{errors.ConfirmPassword?.message}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" onClick={() => setAddModalState(false)}>
                                    <X size={18} className="mr-2" /> Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    <div className="dots" id="query-loader">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <span id="query-text">
                                        <CheckCheck size={18} className="mr-2" />
                                        Add Officer
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal isOpen={workModalState} onRequestClose={() => { setWorkerModalState(false); }}
                style={{
                    content: {
                        width: 'fit-content',
                        height: 'fit-content',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgb(255 255 255)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)'
                    }
                }}
            >

                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                    <form noValidate onSubmit={handleWorkerSubmit(submitWorker)}>
                        <div className="d-flex justify-content-between border-bottom">
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Worker</h1>
                            <button type="button" className="btn-close" onClick={() => setWorkerModalState(false)}></button>
                        </div>
                        <div className="mt-4">
                            <div className="row gy-15">

                                <div className="col-xl-6 text-start">
                                    <label htmlFor="fullName" className="form-label">First Name</label>
                                    <input type="text" className="form-control" placeholder="First Name"
                                        {
                                        ...workerRegister('FirstName',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.FirstName?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="fullName" className="form-label">Last Name</label>
                                    <input type="text" className="form-control" placeholder="Last Name"
                                        {
                                        ...workerRegister('LastName',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.LastName?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label"> E-Mail</label>
                                    <input type="text" className="form-control" placeholder=" E-Mail"
                                        {
                                        ...workerRegister('Email',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.Email?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Phone</label>
                                    <input type="text" className="form-control" placeholder="Phone"
                                        {
                                        ...workerRegister('Phone',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.Phone?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="fullName" className="form-label">Date Of Birth</label>
                                    <input type="Date" className="form-control" placeholder="Date Of Birth"
                                        {
                                        ...workerRegister('DateOfBirth',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.DateOfBirth?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="logo" className="form-label">Profile Photo</label>
                                    <input type="file" className="form-control" id="logo" placeholder="Profile Photo"
                                        {
                                        ...workerRegister('ProfilePhoto',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.ProfilePhoto?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <div>
                                        <label htmlFor="country" className="form-label">Gender</label>
                                        <select className="form-select" id="country"
                                            {
                                            ...workerRegister('Gender',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                            }
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <p className='error-msg'>{workerErrors.Gender?.message}</p>
                                    </div>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="fullName" className="form-label">Join Date</label>
                                    <input type="date" className="form-control" placeholder="Join Date"
                                        {
                                        ...workerRegister('JoinDate',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.JoinDate?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="fullName" className="form-label">Designation</label>
                                    <input type="text" className="form-control" placeholder="Designation"
                                        {
                                        ...workerRegister('Designation',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.Designation?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <div>
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <select className="form-select" id="country"
                                            {
                                            ...workerRegister('CountryId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                            }
                                        >
                                            <option value="">Select Country</option>
                                            {
                                                countries.map((data, index) => (
                                                    <option key={index} value={data.countryId}>{data.name}</option>
                                                ))
                                            }
                                        </select>
                                        <p className='error-msg'>{workerErrors.CountryId?.message}</p>
                                    </div>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <div>
                                        <label htmlFor="state" className="form-label">State</label>
                                        <select className="form-select" id="state" disabled={states.length === 0}
                                            {
                                            ...workerRegister('StateId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                            }
                                        >
                                            <option value="">Select State</option>
                                            {
                                                states.map((data, index) => (
                                                    <option key={index} value={data.stateId}>{data.name}</option>
                                                ))
                                            }
                                        </select>
                                        <p className='error-msg'>{workerErrors.StateId?.message}</p>
                                    </div>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <div>
                                        <label htmlFor="city" className="form-label">City</label>
                                        <select className="form-select" id="city" disabled={cities.length === 0}
                                            {
                                            ...workerRegister('CityId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                            }
                                        >
                                            <option value="">Select City</option>
                                            {
                                                cities.map((data, index) => (
                                                    <option key={index} value={data.cityId}>{data.name}</option>
                                                ))
                                            }
                                        </select>
                                        <p className='error-msg'>{workerErrors.CityId?.message}</p>
                                    </div>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="postcode" className="form-label">PostCode</label>
                                    <input type="text" className="form-control" id="postcode" placeholder="PostCode" {
                                        ...workerRegister('PostCode',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                    } />

                                    <p className='error-msg'>{workerErrors.PostCode?.message}</p>
                                </div>
                                <div className="col-xl-12 text-start">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea className="form-control" id="address" placeholder="Address" {
                                        ...workerRegister('Address',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                    }>
                                    </textarea>
                                    <p className='error-msg'>{workerErrors.Address?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Password</label>
                                    <input type="password" className="form-control" placeholder="Password"
                                        {
                                        ...workerRegister('Password',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                        } />
                                    <p className='error-msg'>{workerErrors.Password?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="regsitrationNo" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" placeholder="Confirm Password"
                                        {...workerRegister('ConfirmPassword', {
                                            required: 'Confirm your password',
                                            validate: (value) =>
                                                value === workerPassword || 'Passwords do not match',
                                        })}
                                    />
                                    <p className='error-msg'>{workerErrors.ConfirmPassword?.message}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" onClick={() => setWorkerModalState(false)}>
                                    <X size={18} className="mr-2" /> Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    <div className="dots" id="query-loader-1">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <span id="query-text-1">
                                        <CheckCheck size={18} className="mr-2" /> Add Worker
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Client Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/ClientMgt/${id}`}>
                                        Client Details
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/ClientMgt">
                                        Client Management
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
                {
                    employerDetails && (
                        <>
                            <div className="col-xxl-3 col-xl-5 col-lg-5">
                                <div className="sidebar-sticky">
                                    <div className="card">
                                        <div className="company-info">
                                            <div className="company-logo">
                                                <img src={employerDetails.employerLogo != "" ? employerDetails.employerLogo : "https://img.icons8.com/fluency/100/image--v1.png"} alt="image not found" />
                                            </div>
                                            <h2 className="company-name mb-15">{employerDetails.businessName}</h2>

                                            <div className="company-info-list mb-25">
                                                <ul>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Mail /></span> <Tippy content="Company Mail"><span style={{ textWrap: 'wrap' }}>{employerDetails.companyMail ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Phone /></span> <Tippy content="Company Phone"><span style={{ textWrap: 'wrap' }}>{employerDetails.companyPhone ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><BriefcaseBusiness /></span> <Tippy content="Job Sector"><span style={{ textWrap: 'wrap' }}>{employerDetails.jobSector}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><MapPinHouse /></span> <Tippy content="Address"><span style={{ textWrap: 'wrap' }}>{employerDetails.address && `${employerDetails.address}, `} {`${employerDetails.city}${employerDetails.city && ','} ${employerDetails.state}${employerDetails.state && ','} ${employerDetails.country}`}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><LocateFixed /></span> <Tippy content="Postcode"><span style={{ textWrap: 'wrap' }}>{employerDetails.postCode}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><GlobeLock /></span> <Tippy content="Website"><a href={employerDetails.websiteUrl} target="_blank" style={{ textWrap: 'wrap' }}>{employerDetails.websiteUrl}</a></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><VectorSquare /></span> <Tippy content="Company Size"><span style={{ textWrap: 'wrap' }}>{employerDetails.companySize}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Layers /></span> <Tippy content="Registration No"><span style={{ textWrap: 'wrap' }}>{employerDetails.registrationNo}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Blocks /></span> <Tippy content="Current Package"><span style={{ textWrap: 'wrap' }}>{employerDetails.package ?? 'No Package'}</span></Tippy></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-9 col-xl-7 col-lg-7">
                                <div className="card">
                                    <div className="tab-style-three mb-25">
                                        <ul className="nav nav-pills gap-10 b-bottom2px b-color-primary mobile-nav" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="pills-officers-tab" data-bs-toggle="pill" data-bs-target="#pills-officers" type="button" role="tab" aria-controls="pills-officers" aria-selected="false" tabIndex={1}>Responsibility Officers</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-workers-tab" data-bs-toggle="pill" data-bs-target="#pills-workers" type="button" role="tab" aria-controls="pills-workers" aria-selected="false" tabIndex={1}>Workers</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-jobs-tab" data-bs-toggle="pill" data-bs-target="#pills-jobs" type="button" role="tab" aria-controls="pills-jobs" aria-selected="false" tabIndex={1}>Jobs Posted</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-job-offers" data-bs-toggle="pill" data-bs-target="#pills-offers" type="button" role="tab" aria-controls="pills-offers" aria-selected="false" tabIndex={1}>Job Offers</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane show active" id="pills-officers" role="tabpanel" aria-labelledby="pills-officers-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Responsibility Officers ({totalOfficers})</h4>
                                                <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                                    <Plus />
                                                </button>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">S/N</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Contact</th>
                                                                <th scope="col">Position</th>
                                                                <th scope="col">Join Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                officers.map((data, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex-items gap-10">
                                                                                    <div className="avatar avatar-md radius-100">
                                                                                        <img className="radius-100" src={data.profilePhoto != "" ?
                                                                                            data.profilePhoto.startsWith('/') ? `http://localhost:5127/${data.profilePhoto}` : data.profilePhoto : "https://img.icons8.com/color/60/gender-neutral-user.png"} alt="Candidate Image" />
                                                                                    </div>
                                                                                    <h6 className="cursor-pointer">{`${data.firstName} ${data.lastName}`}</h6>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <a href={`mailto:${data.email}`} className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">{data.email}</a>
                                                                                <br />
                                                                                <span>{data.phone}</span>
                                                                            </td>
                                                                            <td>{data.position}</td>
                                                                            <td>{(new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {
                                                        officers.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                                <span className="px-6 py-4 text-left font-medium text-black">This client hasn't added any responsibility officer</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <div className="flex justify-content-center align-items-center mb-1">
                                                        <p className="text-black">
                                                            Showing {officers.length > 0 ? ((officePageNumber * officerLimit) - officerLimit) + 1 : 0} to {officers.length > 0 ? (((officePageNumber * officerLimit) - officerLimit) + 1) + (officers.length - 1) : 0} of {totalOfficers} entries
                                                        </p>
                                                    </div>
                                                    <div className="d-inline-flex flex-wrap">
                                                        {
                                                            officePageNumber > 1 && <a
                                                                href="#"
                                                                onClick={() => { if (officePageNumber > 1) { setOfficePageNumber(officePageNumber - 1); } }}
                                                                className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                                            >
                                                                Previous
                                                            </a>
                                                        }
                                                        <a
                                                            href="#"
                                                            className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                                        >
                                                            {officePageNumber}
                                                        </a>
                                                        {
                                                            (officePageNumber * officerLimit) < totalOfficers && <a
                                                                href="#"
                                                                onClick={() => { setOfficePageNumber(officePageNumber + 1); }}
                                                                className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                                            >
                                                                Next
                                                            </a>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-workers" role="tabpanel" aria-labelledby="pills-workers-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Workers ({totalWorkers})</h4>
                                                <div className="d-flex flex-wrap gap-15">
                                                    <div className="dataTables-sorting-control ">
                                                        <input type="text" className="form-control" placeholder="Search by Workers Name" {
                                                            ...filterRegister('UserName')
                                                        } />
                                                    </div>
                                                    <button type="button" className="btn btn-success" onClick={() => setWorkerModalState(true)}>
                                                        <Plus />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">
                                                                    S/N
                                                                </th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Contact</th>
                                                                <th scope="col">Designation</th>
                                                                <th scope="col">Join Date</th>
                                                                <th scope="col">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                workers.map((data, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>
                                                                                {index + 1}
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex-items gap-10">
                                                                                    <div className="avatar avatar-xs radius-100">
                                                                                        <img className="radius-100" src={data.profilePhoto != null ? data.profilePhoto : "https://img.icons8.com/color/48/gender-neutral-user.png"} alt="image not found" />
                                                                                    </div>
                                                                                    <h6 className="cursor-pointer">{`${data.firstName} ${data.lastName}`}</h6>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <p style={{ marginBottom: '5px' }}>{data.email}</p>
                                                                                <p>{data.phone}</p>
                                                                            </td>
                                                                            <td>{data.designation}</td>
                                                                            <td>{new Date(data.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                                            <td>
                                                                                <div className="d-flex-items gap-10">
                                                                                    <button className="btn-icon btn-info-light" type="button">
                                                                                        <a><Eye /></a>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {
                                                        workers.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                                <span className="px-6 py-4 text-left font-medium text-black">This client hasn't added any worker</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <div className="flex justify-content-center align-items-center mb-1">
                                                        <p className="text-black">
                                                            Showing {workers.length > 0 ? ((workerPageNumber * workerLimit) - workerLimit) + 1 : 0} to {workers.length > 0 ? (((workerPageNumber * workerLimit) - workerLimit) + 1) + (workers.length - 1) : 0} of {totalWorkers} entries
                                                        </p>
                                                    </div>
                                                    <div className="d-inline-flex flex-wrap">
                                                        {
                                                            workerPageNumber > 1 && <a
                                                                href="#"
                                                                onClick={() => { if (workerPageNumber > 1) { setWorkerPageNumber(workerPageNumber - 1); } }}
                                                                className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                                            >
                                                                Previous
                                                            </a>
                                                        }
                                                        <a
                                                            href="#"
                                                            className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                                        >
                                                            {workerPageNumber}
                                                        </a>
                                                        {
                                                            (workerPageNumber * workerLimit) < totalWorkers && <a
                                                                href="#"
                                                                onClick={() => { setWorkerPageNumber(workerPageNumber + 1); }}
                                                                className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                                            >
                                                                Next
                                                            </a>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-jobs" role="tabpanel" aria-labelledby="pills-jobs-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Jobs Posted ({totalJobs})</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    S/N
                                                                </th>
                                                                <th>Title</th>
                                                                <th>Published</th>
                                                                <th>Location</th>
                                                                <th>Date Created</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                jobs.map((data, index) => {
                                                                    return (
                                                                        <tr key={data.jobId ?? index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{data.jobTitle}</td>
                                                                            <td>
                                                                                <div
                                                                                    className={`toggle-switch ${data.published ? 'on' : ''}`}
                                                                                    onClick={() => updateJobStatus(data.jobId, !data.published)}
                                                                                >
                                                                                    <div className="toggle-knob" />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ maxWidth: '200px', textWrap: 'wrap' }}>
                                                                                <p>{`${data.city} ${data.city && ','} ${data.state} ${data.state && ','} ${data.country}`}</p>
                                                                            </td>
                                                                            <td>{(new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                                            <td>
                                                                                <div className="d-flex-items gap-10">
                                                                                    <Tippy content="Preview Job">
                                                                                        <NavLink className="btn-icon btn-info-light" to={`/JobMgt/${hashIds.encode(data.jobId)}`}>
                                                                                            <a><Eye /></a>
                                                                                        </NavLink>
                                                                                    </Tippy>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {
                                                        jobs.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                                <span className="px-6 py-4 text-left font-medium text-black">This client hasn't added any job</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <div className="flex justify-content-center align-items-center mb-1">
                                                        <p className="text-black">
                                                            Showing {jobs.length > 0 ? ((jobPageNumber * jobLimit) - jobLimit) + 1 : 0} to {jobs.length > 0 ? (((jobPageNumber * jobLimit) - jobLimit) + 1) + (jobs.length - 1) : 0} of {totalJobs} entries
                                                        </p>
                                                    </div>
                                                    <div className="d-inline-flex flex-wrap">
                                                        {
                                                            jobPageNumber > 1 && <a
                                                                href="#"
                                                                onClick={() => { if (jobPageNumber > 1) { setJobPageNumber(jobPageNumber - 1); } }}
                                                                className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                                            >
                                                                Previous
                                                            </a>
                                                        }
                                                        <a
                                                            href="#"
                                                            className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                                        >
                                                            {jobPageNumber}
                                                        </a>
                                                        {
                                                            (jobPageNumber * jobLimit) < totalJobs && <a
                                                                href="#"
                                                                onClick={() => { setJobPageNumber(jobPageNumber + 1); }}
                                                                className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                                            >
                                                                Next
                                                            </a>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-offers" role="tabpanel" aria-labelledby="pills-job-offers" tabIndex={1}>

                                            <div className="card-body pt-15">
                                                <div className="row">
                                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                                                        <div className="card">
                                                            <div className="card-body mini-card-body d-flex align-center gap-16">
                                                                <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                                                    <FolderOpen size={40} />
                                                                </div>
                                                                <div className="card-content">
                                                                    <span className="d-block fs-16 mb-5">Total Offers</span>
                                                                    <h2 className="mb-5">{totalOffers}</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                                                        <div className="card">
                                                            <div className="card-body mini-card-body d-flex align-center gap-16">
                                                                <div className="avatar avatar-xl bg-slateblue-transparent text-slateblue">
                                                                    <TrendingUp size={40} />
                                                                </div>
                                                                <div className="card-content">
                                                                    <span className="d-block fs-16 mb-5">Offer Acceptance</span>
                                                                    <h2 className="mb-5">{acceptanceRate}%</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                                                        <div className="card">
                                                            <div className="card-body mini-card-body d-flex align-center gap-16">
                                                                <div className="avatar avatar-xl bg-teal-transparent text-teal">
                                                                    <CircleCheck size={40} />
                                                                </div>
                                                                <div className="card-content">
                                                                    <span className="d-block fs-16 mb-5">Sent Offers</span>
                                                                    <h2 className="mb-5">{SentOffers}</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="col-xl-12">
                                                        <div className="gap-15">
                                                            <div className="justify-between">
                                                                {/* <h4 className="d-flex-items gap-10">Job Offers</h4> */}
                                                                <div className="d-flex flex-wrap gap-15">
                                                                    <div className="d-none dataTables-sorting-control ">
                                                                        <select className="form-select sorting-dropdown">
                                                                            <option value="">Sort By:</option>
                                                                            <option value="date_newest">Date: Newest First</option>
                                                                            <option value="date_oldest">Date: Oldest First</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="job-filter-container mt-15">
                                                                <h6>Filter by:</h6>

                                                                <div className="row mt-10">
                                                                    <div className="col-md-6">
                                                                        <form onSubmit={handleSearch} className="d-flex gap-2">
                                                                            <input
                                                                                type="text"
                                                                                id="offerFilter"
                                                                                className="form-control"
                                                                                placeholder="Search by candidate or job title"
                                                                                value={searchInput}
                                                                                onChange={(e) => setSearchInput(e.target.value)}
                                                                            />
                                                                            <button type="submit" className="btn btn-info">Search</button>
                                                                        </form>
                                                                    </div>

                                                                    {/* Offer Status Filter */}
                                                                    <div className="col-md-6 mt-sm-15 mt-md-0">
                                                                        <select
                                                                            id="offerStatusFilter"
                                                                            className="form-select"
                                                                            value={statusFilter}
                                                                            onChange={handleStatusFilter}
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

                                                            <div className="job-search-heading mt-15">
                                                                <div className="d-none job-result-size">
                                                                    <label>
                                                                        Show{" "}
                                                                        <select
                                                                            name="dataTableDefault_length"
                                                                            aria-controls="dataTableDefault"
                                                                            className="form-select form-select-sm"
                                                                            value={pagination.pageSize}
                                                                            onChange={handlePageSizeChange}
                                                                        >
                                                                            <option value="10">10</option>
                                                                            <option value="25">25</option>
                                                                            <option value="50">50</option>
                                                                            <option value="100">100</option>
                                                                        </select>{" "}
                                                                        entries
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="card-body pt-15">
                                                                {error && (
                                                                    <div className="alert alert-danger" role="alert">
                                                                        {error}
                                                                    </div>
                                                                )}

                                                                {loading ? (
                                                                    <div className="text-center py-5">
                                                                        <div className="spinner-border text-primary" role="status">
                                                                            <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="table-responsive">
                                                                        <table
                                                                            id="dataTableDefault"
                                                                            className="table text-nowrap w-100"
                                                                        >
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Candidate</th>
                                                                                    <th>Job Title</th>
                                                                                    <th>Offer Date</th>
                                                                                    <th>Status</th>
                                                                                    <th>Rates offered</th>
                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {offers.length === 0 ? (
                                                                                    <tr>
                                                                                        <td colSpan={6} className="text-center py-4">
                                                                                            No job offers found
                                                                                        </td>
                                                                                    </tr>
                                                                                ) : (
                                                                                    offers.map((offer) => (
                                                                                        <tr key={offer.jobOfferId}>
                                                                                            <td>
                                                                                                <div className="d-flex-items gap-10">
                                                                                                    <div className="avatar radius-100">
                                                                                                        <img
                                                                                                            src={`${import.meta.env.BASE_URL}${offer.jobSeeker.profilePhoto}` || "https://img.icons8.com/color/48/gender-neutral-user.png/Employer/assets/images/avatar/avatar-thumb-dummy.png"}
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
                                                                                            <td><NavLink to={`/job-offer/${offer.jobOfferId}`}>{offer.job.jobTitle}</NavLink></td>
                                                                                            <td>{dayjs(offer.offerDate).format('MMM D, YYYY')}</td>
                                                                                            <td>
                                                                                                {offer.offerStatus}
                                                                                            </td>
                                                                                            <td>{offer.job.currency}{offer.grossAnnualSalary}</td>
                                                                                            <td className="offer-actions">
                                                                                                <div className="d-flex-items gap-10 align-items-end">
                                                                                                    <NavLink
                                                                                                        className="btn-icon btn-info-light"
                                                                                                        to={`/jobOfferDetails/${hashIds.encode(String(offer.jobApplicationId))}`}
                                                                                                        data-bs-placement="top"
                                                                                                        data-bs-title="View Offer"
                                                                                                    >
                                                                                                        <i className="ri-eye-line"></i>
                                                                                                    </NavLink>

                                                                                                    {offer.offerStatus === "Accepted" && (
                                                                                                        <a
                                                                                                            className="btn-icon btn-success-light"
                                                                                                            href="javascript:void(0);"
                                                                                                            data-bs-placement="top"
                                                                                                            data-bs-toggle="modal"
                                                                                                            data-bs-title="Send Contract"
                                                                                                            data-bs-target="#addNewEmployee"
                                                                                                        >
                                                                                                            <i className="ri-file-text-line"></i>
                                                                                                        </a>
                                                                                                    )}

                                                                                                    <a
                                                                                                        className="d-none btn-icon btn-danger-light"
                                                                                                        href="javascript:void(0);"
                                                                                                        data-bs-toggle="tooltip"
                                                                                                        data-bs-placement="top"
                                                                                                        data-bs-title="Delete Offer"
                                                                                                    >
                                                                                                        <i className="ri-delete-bin-line"></i>
                                                                                                    </a>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}

                                                                {!loading && offers.length > 0 && (
                                                                    <div className="table-footer mt-15 d-flex-between flex-wrap gap-10">
                                                                        <div
                                                                            className="d-none dataTables_info"
                                                                            id="dataTableDefault_info"
                                                                            role="status"
                                                                            aria-live="polite"
                                                                        >
                                                                            Showing {((pagination.pageNumber - 1) * pagination.pageSize) + 1} to {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} entries
                                                                        </div>
                                                                        <div></div>
                                                                        <div
                                                                            className="dataTables_paginate paging_simple_numbers"
                                                                            id="dataTableDefault_paginate"
                                                                        >
                                                                            <ul className="pagination">
                                                                                <li
                                                                                    className={`paginate_button page-item previous ${pagination.pageNumber === 1 ? 'disabled' : ''}`}
                                                                                    id="dataTableDefault_previous"
                                                                                >
                                                                                    <a
                                                                                        href="#"
                                                                                        aria-controls="dataTableDefault"
                                                                                        data-dt-idx="0"
                                                                                        tabIndex={0}
                                                                                        className="page-link"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            if (pagination.pageNumber > 1) {
                                                                                                handlePageChange(pagination.pageNumber - 1);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        Previous
                                                                                    </a>
                                                                                </li>

                                                                                {[...Array(pagination.totalPages)].map((_, i) => (
                                                                                    <li
                                                                                        key={i + 1}
                                                                                        className={`paginate_button page-item ${pagination.pageNumber === i + 1 ? 'active' : ''}`}
                                                                                    >
                                                                                        <a
                                                                                            href="#"
                                                                                            aria-controls="dataTableDefault"
                                                                                            data-dt-idx={i + 1}
                                                                                            tabIndex={0}
                                                                                            className="page-link"
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault();
                                                                                                handlePageChange(i + 1);
                                                                                            }}
                                                                                        >
                                                                                            {i + 1}
                                                                                        </a>
                                                                                    </li>
                                                                                ))}

                                                                                <li
                                                                                    className={`paginate_button page-item next ${pagination.pageNumber === pagination.totalPages ? 'disabled' : ''}`}
                                                                                    id="dataTableDefault_next"
                                                                                >
                                                                                    <a
                                                                                        href="#"
                                                                                        aria-controls="dataTableDefault"
                                                                                        data-dt-idx={pagination.totalPages + 1}
                                                                                        tabIndex={0}
                                                                                        className="page-link"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            if (pagination.pageNumber < pagination.totalPages) {
                                                                                                handlePageChange(pagination.pageNumber + 1);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        Next
                                                                                    </a>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    )
}