import {
    BriefcaseBusiness,
    ChevronRight,
    Plus,
    FolderOutput,
    UserStar,
    X,
    CheckCheck,
    PenLine,
    CalendarClock,
    Eye
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Modal from 'react-modal';
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { createJob, fetchAllJobs, updateJob } from "../../utils/JobRequests";
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";
import { fetchAllEmployers } from "../../utils/EmployerRequests";
import { fetchJobSectors } from "../../utils/JobSetorRequests";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { toast, ToastContainer } from 'react-toastify';
import RichTextEditor from "../../layout/RichTextEditor";
import Tippy from "@tippyjs/react";
import Hashids from "hashids";
import { fetchJobTypes } from "../../utils/JobTypeRequests";
import { fetchJobCategories } from "../../utils/JobCategoryRequests";
import { fetchWorkModes } from "../../utils/WorkModeRequests";
import ShiftSelectorPanel from "../../components/ShiftCard";
import type { EmployerData } from "../../components/ClientSidebar";
import type { JobFormData, JobData, JobFilter, JobCategoryData, JobSectorData, JobTypeData, WorkModeData } from "../../types/jobData";
import type { CountryData, StateData, CityData } from "../../types/location";

export default function JobMgt() {
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const { register, reset, handleSubmit, formState, control, setValue } = useForm<JobFormData>();
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalApps, setTotalApps] = useState(0);
    const [totalExpired, setTotalExpired] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [jobs, setJobs] = useState<JobData[]>([]);
    const { register: filterRegister, control: filterControl } = useForm<JobFilter>();
    const filters = useWatch({ control: filterControl });
    const [employers, setEmployers] = useState<EmployerData[]>([]);
    const [jobCategories, setJobCategories] = useState<JobCategoryData[]>([]);
    const limit = 10;
    const { errors } = formState;
    const {
        register: regEdit,
        reset: resetEdit,
        handleSubmit: submitEdit,
        formState: editFormState,
        control: editControl,
        setValue: editSetValue,
    } = useForm<JobFormData>();
    const { errors: editErrors } = editFormState;
    const [jobEdit, setJobEdit] = useState<JobData | null>(null);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);
    const [editState, setEditState] = useState<StateData[]>([]);
    const [editCity, setEditCities] = useState<CityData[]>([]);
    const [jobSectors, setJobSectors] = useState<JobSectorData[]>([]);
    const [editJobCategories, setEditJobCategories] = useState<JobCategoryData[]>([]);
    const [jobTypes, setJobTypes] = useState<JobTypeData[]>([]);
    const [workModes, setWorkModes] = useState<WorkModeData[]>([]);
    const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
    const [selectedJob, setSelectedJob] = useState<JobData>();
    const [editSelectedShifts, setEditSelectedShifts] = useState<number[]>([]);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

    const selectedCountry = useWatch({ control, name: 'CountryId' });
    const selectedSector = useWatch({ control, name: 'JobSectorId' });
    const selectedState = useWatch({ control, name: 'StateId' });
    const selectedJobTypeId = useWatch({ control, name: 'JobTypeId' });
    const editSelectedCountry = useWatch({ control: editControl, name: 'CountryId' });
    const editSelectedState = useWatch({ control: editControl, name: 'StateId' });
    const editSelectedSector = useWatch({ control: editControl, name: 'JobSectorId' });
    const editSelectedJobTypeId = useWatch({ control: editControl, name: 'JobTypeId' });

    const shiftTypeId = jobTypes.find(t => t.typeName.toLowerCase() === 'shift')?.jobTypeId;

    const isPopulatingEdit = useRef(false);

    // ─── Data Fetching ────────────────────────────────────────────────────────

    useEffect(() => {
        fetchAllJobs({ pageNumber, limit, ...filters })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        console.log("job oo", data.data)
                        setJobs(data.data.jobs);
                        setTotalJobs(data.data.totalCount);
                        setTotalExpired(data.data.totalExpired);
                        setTotalApps(data.data.totalApplications);
                    });
                } else {
                    res.text().then(data => console.log(JSON.parse(data)));
                }
            });
    }, [pageNumber, limit, filters]);

    useEffect(() => {
        if (!jobEdit) return;

        const populate = async () => {
            isPopulatingEdit.current = true;

            try {
                let statesData: StateData[] = [];
                if (jobEdit.countryId) {
                    const res = await fetchStatesByCountryId(Number(jobEdit.countryId));
                    if (res.status === 200) {
                        const data = await res.json();
                        statesData = data.data ?? [];
                        setEditState(statesData);
                    }
                }

                let citiesData: CityData[] = [];
                if (jobEdit.stateId) {
                    const res = await fetchCitiesByStateId(Number(jobEdit.stateId));
                    if (res.status === 200) {
                        const data = await res.json();
                        citiesData = data ?? [];
                        setEditCities(citiesData);
                    }
                }

                let categoriesData: JobCategoryData[] = [];
                if (jobEdit.jobSectorId) {
                    const res = await fetchJobCategories(Number(jobEdit.jobSectorId));
                    if (res.status === 200) {
                        const data = await res.json();
                        categoriesData = data.data ?? [];
                        setEditJobCategories(categoriesData);
                    }
                }

                editSetValue('JobTitle', jobEdit.jobTitle);
                editSetValue('JobSectorId', String(jobEdit.jobSectorId));
                editSetValue('JobTypeId', String(jobEdit.jobTypeId));
                editSetValue('JobDescription', jobEdit.jobDescription);
                editSetValue('CountryId', String(jobEdit.countryId));
                editSetValue('StateId', String(jobEdit.stateId));
                editSetValue('CityId', String(jobEdit.cityId));
                editSetValue('JobCategoryId', String(jobEdit.jobCategoryId));
                editSetValue('JobViewScope', jobEdit.jobViewScope);
                editSetValue('Grade', jobEdit.grade);
                editSetValue('JobAmount', jobEdit.jobAmount);
                editSetValue('JobResponsibility', jobEdit.jobResponsibility);
                editSetValue('JobRequirement', jobEdit.jobRequirement);
                editSetValue('WorkModeId', String(jobEdit.workModeId));
                editSetValue('IsPaid', jobEdit.isPaid);
                editSetValue('HasInterview', jobEdit.hasInterview);
                if (jobEdit.jobExpiration) {
                    editSetValue('JobExpiration', jobEdit.jobExpiration.split('T')[0]);
                }
            } catch (err) {
                console.error('Error pre-filling edit form:', err);
            } finally {
                setTimeout(() => { isPopulatingEdit.current = false; }, 0);
            }
        };

        populate();
    }, [jobEdit]);

    useEffect(() => {
        fetchJobSectors()
            .then(res => {
                if (res.status === 200) res.json().then(data => setJobSectors(data.data));
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchJobTypes()
            .then(res => {
                if (res.status === 200) res.json().then(data => setJobTypes(data.data));
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchWorkModes()
            .then(res => {
                if (res.status === 200) res.json().then(data => setWorkModes(data));
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchAllEmployers({ pageNumber: 1, limit: 1000 })
            .then(res => {
                if (res.status === 200) res.json().then(data => setEmployers(data.data.employers));
            });
    }, []);

    useEffect(() => {
        fetchCountries()
            .then(res => {
                if (res.status === 200) res.json().then(data => setCountries(data.data));
            })
            .catch(err => console.log(err));
    }, []);

    // Add-form: country → states
    useEffect(() => {
        if (!selectedCountry || selectedCountry == '') {
            setStates([]);
            setValue('StateId', '');
            setValue('CityId', '');
            return;
        }
        fetchStatesByCountryId(Number(selectedCountry))
            .then(res => {
                if (res.status === 200) res.json().then(data => {
                    setStates(data.data);
                    setValue('StateId', '');
                    setValue('CityId', '');
                });
            })
            .catch(err => console.log(err));
    }, [selectedCountry]);

    useEffect(() => {
        if (!selectedSector || selectedSector == '') {
            setJobCategories([]);
            setValue('JobCategoryId', '');
            return;
        }
        fetchJobCategories(Number(selectedSector))
            .then(res => {
                if (res.status === 200) res.json().then(data => {
                    setJobCategories(data.data);
                    setValue('JobCategoryId', '');
                });
            })
            .catch(err => console.log(err));
    }, [selectedSector]);


    useEffect(() => {
        if (!selectedState || selectedState == '') {
            setCities([]);
            setValue('CityId', '');
            return;
        }
        fetchCitiesByStateId(Number(selectedState))
            .then(res => {
                if (res.status === 200) res.json().then(data => {
                    setCities(data);
                    setValue('CityId', '');
                });
            })
            .catch(err => console.log(err));
    }, [selectedState]);

    useEffect(() => {
        if (isPopulatingEdit.current) return;
        if (!editSelectedSector || editSelectedSector == '') {
            setEditJobCategories([]);
            editSetValue('JobCategoryId', '');
            return;
        }
        fetchJobCategories(Number(editSelectedSector))
            .then(res => {
                if (res.status === 200) res.json().then(data => {
                    setEditJobCategories(data.data);
                    editSetValue('JobCategoryId', '');
                });
            })
            .catch(err => console.log(err));
    }, [editSelectedSector]);

    useEffect(() => {
        if (isPopulatingEdit.current) return;
        if (!editSelectedCountry || editSelectedCountry == '') {
            setEditState([]);
            editSetValue('StateId', '');
            editSetValue('CityId', '');
            return;
        }
        fetchStatesByCountryId(Number(editSelectedCountry))
            .then(res => {
                if (res.status === 200) res.json().then(data => {
                    setEditState(data.data);
                    editSetValue('StateId', '');
                    editSetValue('CityId', '');
                });
            })
            .catch(err => console.log(err));
    }, [editSelectedCountry]);

    useEffect(() => {

        if (isPopulatingEdit.current) return;
        if (!editSelectedState || editSelectedState == '') {
            setEditCities([]);
            editSetValue('CityId', '');
            return;
        }
        fetchCitiesByStateId(Number(editSelectedState))
            .then(res => {
                if (res.status === 200) res.json().then(data => {
                    setEditCities(data);
                    editSetValue('CityId', '');
                });
            })
            .catch(err => console.log(err));
    }, [editSelectedState]);

    const refetchJobs = async () => {
        try {
            const res = await fetchAllJobs({ pageNumber, limit, ...filters });
            if (res.status === 200) {
                const data = await res.json();
                setJobs(data.data.jobs);
                setTotalJobs(data.data.totalCount);
                setTotalExpired(data.data.totalExpired);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Submit Handlers ──────────────────────────────────────────────────────

    const submitNewJob = async (data: JobFormData) => {
        const loader = document.getElementById('query-loader');
        const text = document.getElementById('query-text');
        if (loader) loader.style.display = 'flex';
        if (text) text.style.display = 'none';

        const formData = new FormData();
        formData.append("JobTitle", data.JobTitle);
        formData.append("JobDescription", data.JobDescription);
        formData.append("JobRequirement", data.JobRequirement);
        formData.append("JobResponsibility", data.JobResponsibility);
        formData.append("JobSectorId", data.JobSectorId);
        formData.append("JobCategoryId", data.JobCategoryId);
        formData.append("JobTypeId", data.JobTypeId);
        formData.append("WorkModeId", data.WorkModeId);
        formData.append("EmployerId", data.EmployerId);
        formData.append("CountryId", data.CountryId);
        formData.append("StateId", data.StateId);
        formData.append("CityId", String(data.CityId));
        formData.append("JobViewScope", data.JobViewScope);
        formData.append("Grade", String(data.Grade));
        formData.append("JobAmount", data.JobAmount);
        formData.append("IsPaid", String(data.IsPaid ?? false));
        formData.append("HasInterview", String(data.HasInterview ?? false));
        if (data.JobExpiration) formData.append("JobExpiration", data.JobExpiration);
        if (data.JobPhoto?.[0]) formData.append("JobPhoto", data.JobPhoto[0]);
        selectedShifts.forEach(id => formData.append("ShiftIds", id.toString()));

        const res = await createJob(formData);
        handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(async () => {
                await refetchJobs();
                setAddModalState(false);
            });
    };

    const editJob = async (data: JobFormData) => {
        if (!jobEdit) return;

        const loader = document.getElementById('query-loader-1');
        const text = document.getElementById('query-text-1');
        if (loader) loader.style.display = 'flex';
        if (text) text.style.display = 'none';

        const formData = new FormData();
        formData.append("JobTitle", data.JobTitle);
        formData.append("JobDescription", data.JobDescription);
        formData.append("JobRequirement", data.JobRequirement);
        formData.append("JobResponsibility", data.JobResponsibility);
        formData.append("JobSectorId", data.JobSectorId);
        formData.append("JobCategoryId", data.JobCategoryId);
        formData.append("JobTypeId", data.JobTypeId);
        formData.append("WorkModeId", data.WorkModeId);
        formData.append("CountryId", data.CountryId);
        formData.append("StateId", data.StateId);
        formData.append("CityId", String(data.CityId));
        formData.append("JobViewScope", data.JobViewScope);
        formData.append("Grade", String(data.Grade));
        formData.append("JobAmount", data.JobAmount);
        formData.append("IsPaid", String(data.IsPaid ?? false));
        formData.append("HasInterview", String(data.HasInterview ?? false));
        if (data.JobExpiration) formData.append("JobExpiration", data.JobExpiration);
        if (data.JobPhoto?.[0]) formData.append("JobPhoto", data.JobPhoto[0]);
        editSelectedShifts.forEach(id => formData.append("ShiftIds", id.toString()));

        const res = await updateJob(jobEdit.jobId, formData);
        handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(async () => {
                await refetchJobs();
                setEditModalState(false);
            });
    };

    const updateJobStatus = async (jobId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("Published", String(status));
        const res = await updateJob(jobId, formData);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
            .finally(async () => { await refetchJobs(); });
    };

    // ─── Shared Modal Styles ──────────────────────────────────────────────────

    const modalStyle = {
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
        overlay: { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="container-fluid">
            <ToastContainer />

            {/* ── ADD MODAL ─────────────────────────────────────────────────── */}
            <Modal isOpen={addModalState} onRequestClose={() => setAddModalState(false)} style={modalStyle}>
                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '80vh' }}>
                    <form noValidate onSubmit={handleSubmit(submitNewJob)}>
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-4">
                            <h1 className="modal-title fs-16">Create New Job</h1>
                            <button type="button" className="btn-close" onClick={() => setAddModalState(false)} />
                        </div>

                        {/* ── Section: Basic Information ── */}
                        <h6 className=" text-uppercase mb-3 fs-12">Basic Information</h6>
                        <div className="row gy-15 text-start">
                            <div className="col-xl-12">
                                <label className="form-label">Job Title <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.JobTitle ? 'is-invalid' : ''}`}
                                    placeholder="e.g., Senior Software Engineer"
                                    {...register('JobTitle', { required: 'Required' })}
                                />
                                <p className="error-msg">{errors.JobTitle?.message}</p>
                            </div>
                            <div className="col-xl-12">
                                <label className="form-label">Job Description <span className="text-danger">*</span></label>
                                <Controller
                                    name="JobDescription"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <RichTextEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                <p className="error-msg">{errors.JobDescription?.message}</p>
                            </div>
                            <div className="col-xl-12">
                                <label className="form-label">Job Requirements <span className="text-danger">*</span></label>
                                <Controller
                                    name="JobRequirement"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <RichTextEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                <p className="error-msg">{errors.JobRequirement?.message}</p>
                            </div>
                            <div className="col-xl-12">
                                <label className="form-label">Job Responsibilities <span className="text-danger">*</span></label>
                                <Controller
                                    name="JobResponsibility"
                                    control={control}
                                    rules={{ required: 'Required' }}
                                    render={({ field }) => (
                                        <RichTextEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                <p className="error-msg">{errors.JobResponsibility?.message}</p>
                            </div>
                        </div>

                        {/* ── Section: Classification & Compensation ── */}
                        <h6 className=" text-uppercase mb-3 mt-4 fs-12">Classification &amp; Compensation</h6>
                        <div className="row gy-15 text-start">
                            <div className="col-xl-6">
                                <label className="form-label">Job Sector <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.JobSectorId ? 'is-invalid' : ''}`}
                                    {...register('JobSectorId', { required: 'Required' })}
                                >
                                    <option value="">Select Job Sector</option>
                                    {jobSectors.map((d, i) => (
                                        <option key={i} value={d.jobSectorId}>{d.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.JobSectorId?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Job Category <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.JobCategoryId ? 'is-invalid' : ''}`}
                                    disabled={jobCategories.length === 0}
                                    {...register('JobCategoryId', { required: 'Required' })}
                                >
                                    <option value="">
                                        {jobCategories.length === 0 ? 'Select Sector First' : 'Select Job Category'}
                                    </option>
                                    {jobCategories.map((d, i) => (
                                        <option key={i} value={d.jobCategoryId}>{d.categoryName}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.JobCategoryId?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Job Type <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.JobTypeId ? 'is-invalid' : ''}`}
                                    {...register('JobTypeId', { required: 'Required' })}
                                >
                                    <option value="">Select Job Type</option>
                                    {jobTypes.map((d, i) => (
                                        <option key={i} value={d.jobTypeId}>{d.typeName}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.JobTypeId?.message}</p>
                            </div>

                            {shiftTypeId && String(selectedJobTypeId) === String(shiftTypeId) && (
                                <div className="col-xl-12">
                                    <ShiftSelectorPanel
                                        selectedShifts={selectedShifts}
                                        setSelectedShifts={setSelectedShifts}
                                        employerId={Number(selectedJob?.employerId)}
                                    />
                                </div>
                            )}
                            <div className="col-xl-6">
                                <label className="form-label">Work Mode <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.WorkModeId ? 'is-invalid' : ''}`}
                                    {...register('WorkModeId', { required: 'Required' })}
                                >
                                    <option value="">Select Work Mode</option>
                                    {workModes.map((d, i) => (
                                        <option key={i} value={d.workModeId}>{d.modeName}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.WorkModeId?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Employer <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.EmployerId ? 'is-invalid' : ''}`}
                                    {...register('EmployerId', { required: 'Required' })}
                                >
                                    <option value="">Select Employer</option>
                                    {employers.map((d, i) => (
                                        <option key={i} value={d.employerId}>{d.businessName}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.EmployerId?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Payment Amount <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.JobAmount ? 'is-invalid' : ''}`}
                                    placeholder="e.g., 150000"
                                    min="0"
                                    step="0.01"
                                    {...register('JobAmount', { required: 'Required' })}
                                />
                                <p className="error-msg">{errors.JobAmount?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Expected Grade</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., First Class"
                                    {...register('Grade')}
                                />
                            </div>
                            <div className="col-xl-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="add-IsPaid"
                                                {...register('IsPaid')}
                                            />
                                            <label htmlFor="add-IsPaid" className="form-check-label">
                                                This is a paid position
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="add-HasInterview"
                                                {...register('HasInterview')}
                                            />
                                            <label htmlFor="add-HasInterview" className="form-check-label">
                                                Requires interview
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Location & Visibility ── */}
                        <h6 className=" text-uppercase mb-3 mt-4 fs-12">Location &amp; Visibility</h6>
                        <div className="row gy-15 text-start">
                            <div className="col-xl-4">
                                <label className="form-label">Country <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.CountryId ? 'is-invalid' : ''}`}
                                    {...register('CountryId', { required: 'Required' })}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((d, i) => (
                                        <option key={i} value={d.countryId}>{d.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.CountryId?.message}</p>
                            </div>
                            <div className="col-xl-4">
                                <label className="form-label">State <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.StateId ? 'is-invalid' : ''}`}
                                    disabled={states.length === 0}
                                    {...register('StateId', { required: 'Required' })}
                                >
                                    <option value="">Select State</option>
                                    {states.map((d, i) => (
                                        <option key={i} value={d.stateId}>{d.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.StateId?.message}</p>
                            </div>
                            <div className="col-xl-4">
                                <label className="form-label">LGA / City <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.CityId ? 'is-invalid' : ''}`}
                                    disabled={cities.length === 0}
                                    {...register('CityId', { required: 'Required' })}
                                >
                                    <option value="">Select LGA/City</option>
                                    {cities.map((d, i) => (
                                        <option key={i} value={d.cityId}>{d.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.CityId?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Job Visibility Scope <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.JobViewScope ? 'is-invalid' : ''}`}
                                    {...register('JobViewScope', { required: 'Required' })}
                                >
                                    <option value="">Select View Scope</option>
                                    <option value="Global">Global</option>
                                    <option value="Country">Country</option>
                                    <option value="State">State</option>
                                    <option value="City">City</option>
                                </select>
                                <small className="">Determines who can see this job posting</small>
                                <p className="error-msg">{errors.JobViewScope?.message}</p>
                            </div>
                            <div className="col-xl-6">
                                <label className="form-label">Job Expiration Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    {...register('JobExpiration')}
                                />
                                <small className="">Leave empty for no expiration</small>
                            </div>
                        </div>

                        {/* ── Section: Job Photo ── */}
                        <h6 className=" text-uppercase mb-3 mt-4 fs-12">Job Photo</h6>
                        <div className="row gy-15 text-start">
                            <div className="col-xl-6">
                                <label className="form-label">Upload Job Photo <span className="text-danger">*</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`form-control ${errors.JobPhoto ? 'is-invalid' : ''}`}
                                    {...register('JobPhoto', { required: 'Required' })}
                                />
                                <p className="error-msg">{errors.JobPhoto?.message}</p>
                            </div>
                        </div>

                        {/* ── Actions ── */}
                        <div className="d-flex justify-content-end gap-10 mt-20">
                            <button type="button" className="btn btn-danger" onClick={() => setAddModalState(false)}>
                                <X size={18} className="mr-2" /> Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                                <div className="dots" id="query-loader">
                                    <div className="dot" /><div className="dot" /><div className="dot" />
                                </div>
                                <span id="query-text">
                                    <CheckCheck size={18} className="mr-2" /> Add Job
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ── EDIT MODAL ────────────────────────────────────────────────── */}
            <Modal isOpen={editModalState} onRequestClose={() => setEditModalState(false)} style={modalStyle}>
                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '80vh' }}>
                    {jobEdit && (
                        <form noValidate onSubmit={submitEdit(editJob)}>
                            <div className="d-flex justify-content-between border-bottom pb-2 mb-4">
                                <h1 className="modal-title fs-16">Update Job</h1>
                                <button type="button" className="btn-close" onClick={() => setEditModalState(false)} />
                            </div>

                            {/* ── Section: Basic Information ── */}
                            <h6 className=" text-uppercase mb-3 fs-12">Basic Information</h6>
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label className="form-label">Job Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${editErrors.JobTitle ? 'is-invalid' : ''}`}
                                        placeholder="e.g., Senior Software Engineer"
                                        {...regEdit('JobTitle', { required: 'Required' })}
                                    />
                                    <p className="error-msg">{editErrors.JobTitle?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Job Description <span className="text-danger">*</span></label>
                                    <Controller
                                        name="JobDescription"
                                        control={editControl}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                            <RichTextEditor value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <p className="error-msg">{editErrors.JobDescription?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Job Requirements <span className="text-danger">*</span></label>
                                    <Controller
                                        name="JobRequirement"
                                        control={editControl}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                            <RichTextEditor value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <p className="error-msg">{editErrors.JobRequirement?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Job Responsibilities <span className="text-danger">*</span></label>
                                    <Controller
                                        name="JobResponsibility"
                                        control={editControl}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                            <RichTextEditor value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <p className="error-msg">{editErrors.JobResponsibility?.message}</p>
                                </div>
                            </div>

                            {/* ── Section: Classification & Compensation ── */}
                            <h6 className=" text-uppercase mb-3 mt-4 fs-12">Classification &amp; Compensation</h6>
                            <div className="row gy-15 text-start">
                                <div className="col-xl-6">
                                    <label className="form-label">Job Sector <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.JobSectorId ? 'is-invalid' : ''}`}
                                        {...regEdit('JobSectorId', { required: 'Required' })}
                                    >
                                        <option value="">Select Job Sector</option>
                                        {jobSectors.map((d, i) => (
                                            <option key={i} value={d.jobSectorId}>{d.name}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.JobSectorId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Category <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.JobCategoryId ? 'is-invalid' : ''}`}
                                        disabled={editJobCategories.length === 0}
                                        {...regEdit('JobCategoryId', { required: 'Required' })}
                                    >
                                        <option value="">
                                            {editJobCategories.length === 0 ? 'Select Sector First' : 'Select Job Category'}
                                        </option>
                                        {editJobCategories.map((d, i) => (
                                            <option key={i} value={d.jobCategoryId}>{d.categoryName}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.JobCategoryId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Type <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.JobTypeId ? 'is-invalid' : ''}`}
                                        {...regEdit('JobTypeId', { required: 'Required' })}
                                    >
                                        <option value="">Select Job Type</option>
                                        {jobTypes.map((d, i) => (
                                            <option key={i} value={d.jobTypeId}>{d.typeName}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.JobTypeId?.message}</p>
                                </div>
                                {/* Show shift selector only when "Shift" job type is selected */}
                                {shiftTypeId && String(editSelectedJobTypeId) === String(shiftTypeId) && (
                                    <div className="col-xl-12">
                                        <ShiftSelectorPanel
                                            selectedShifts={editSelectedShifts}
                                            setSelectedShifts={setEditSelectedShifts}
                                            employerId={Number(selectedJob?.employerId)}
                                        />
                                    </div>
                                )}
                                <div className="col-xl-6">
                                    <label className="form-label">Work Mode <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.WorkModeId ? 'is-invalid' : ''}`}
                                        {...regEdit('WorkModeId', { required: 'Required' })}
                                    >
                                        <option value="">Select Work Mode</option>
                                        {workModes.map((d, i) => (
                                            <option key={i} value={d.workModeId}>{d.modeName}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.WorkModeId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Payment Amount <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className={`form-control ${editErrors.JobAmount ? 'is-invalid' : ''}`}
                                        placeholder="e.g., 150000"
                                        min="0"
                                        step="0.01"
                                        {...regEdit('JobAmount', { required: 'Required' })}
                                    />
                                    <p className="error-msg">{editErrors.JobAmount?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Expected Grade</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g., First Class"
                                        {...regEdit('Grade')}
                                    />
                                </div>
                                <div className="col-xl-12">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="edit-IsPaid"
                                                    {...regEdit('IsPaid')}
                                                />
                                                <label htmlFor="edit-IsPaid" className="form-check-label">
                                                    This is a paid position
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="edit-HasInterview"
                                                    {...regEdit('HasInterview')}
                                                />
                                                <label htmlFor="edit-HasInterview" className="form-check-label">
                                                    Requires interview
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Location & Visibility ── */}
                            <h6 className=" text-uppercase mb-3 mt-4 fs-12">Location &amp; Visibility</h6>
                            <div className="row gy-15 text-start">
                                <div className="col-xl-4">
                                    <label className="form-label">Country <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.CountryId ? 'is-invalid' : ''}`}
                                        {...regEdit('CountryId', { required: 'Required' })}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((d, i) => (
                                            <option key={i} value={d.countryId}>{d.name}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.CountryId?.message}</p>
                                </div>
                                <div className="col-xl-4">
                                    <label className="form-label">State <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.StateId ? 'is-invalid' : ''}`}
                                        disabled={editState.length === 0}
                                        {...regEdit('StateId', { required: 'Required' })}
                                    >
                                        <option value="">Select State</option>
                                        {editState.map((d, i) => (
                                            <option key={i} value={d.stateId}>{d.name}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.StateId?.message}</p>
                                </div>
                                <div className="col-xl-4">
                                    <label className="form-label">LGA / City <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.CityId ? 'is-invalid' : ''}`}
                                        disabled={editCity.length === 0}
                                        {...regEdit('CityId', { required: 'Required' })}
                                    >
                                        <option value="">Select LGA/City</option>
                                        {editCity.map((d, i) => (
                                            <option key={i} value={d.cityId}>{d.name}</option>
                                        ))}
                                    </select>
                                    <p className="error-msg">{editErrors.CityId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Visibility Scope <span className="text-danger">*</span></label>
                                    <select
                                        className={`form-select ${editErrors.JobViewScope ? 'is-invalid' : ''}`}
                                        {...regEdit('JobViewScope', { required: 'Required' })}
                                    >
                                        <option value="">Select View Scope</option>
                                        <option value="Global">Global</option>
                                        <option value="Country">Country</option>
                                        <option value="State">State</option>
                                        <option value="City">City</option>
                                    </select>
                                    <small className="">Determines who can see this job posting</small>
                                    <p className="error-msg">{editErrors.JobViewScope?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Move Job Expiration Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...regEdit('JobExpiration')}
                                    />
                                    <small className="">Leave empty to keep current expiration</small>
                                </div>
                            </div>

                            {/* ── Section: Job Photo ── */}
                            <h6 className=" text-uppercase mb-3 mt-4 fs-12">Job Photo</h6>
                            <div className="row gy-15 text-start">
                                <div className="col-xl-6">
                                    <label className="form-label">Upload New Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        {...regEdit('JobPhoto', { required: false })}
                                    />
                                    <small className="">Leave empty to keep current photo</small>
                                </div>
                                {jobEdit.jobPhoto && (
                                    <div className="col-xl-6">
                                        <label className="form-label">Current Photo</label>
                                        <div className="border rounded p-2">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${jobEdit.jobPhoto}`}
                                                className="img-fluid"
                                                alt="Current job"
                                                style={{ maxHeight: '150px', objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Actions ── */}
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" onClick={() => setEditModalState(false)}>
                                    <X size={18} className="mr-2" /> Cancel
                                </button>
                                <button type="submit" className="btn btn-warning">
                                    <div className="dots" id="query-loader-1">
                                        <div className="dot" /><div className="dot" /><div className="dot" />
                                    </div>
                                    <span id="query-text-1">
                                        <PenLine size={18} className="mr-2" /> Update Job
                                    </span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>

            {/* ── PAGE CONTENT ──────────────────────────────────────────────── */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Job Management</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/JobMgt">Job Management</NavLink>
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
                                <li className="breadcrumb-item">
                                    <NavLink to="/Dashboard">Dashboard</NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <BriefcaseBusiness size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Jobs</span>
                                <h2 className="mb-5">{totalJobs}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                <UserStar size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Applications</span>
                                <h2 className="mb-5">{totalApps}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-danger-transparent text-danger">
                                <CalendarClock size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Expired Jobs</span>
                                <h2 className="mb-5">{totalExpired}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job table */}
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="d-flex-items gap-10">Job List</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <div className="dataTables-sorting-control">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Title"
                                        {...filterRegister('jobTitle')}
                                    />
                                </div>
                                <div className="dataTables-sorting-control">
                                    <select className="form-select sorting-dropdown" {...filterRegister('jobSectorId')}>
                                        <option value="">All Job Sectors</option>
                                        {jobSectors.map((d, i) => (
                                            <option key={i} value={d.jobSectorId}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="dataTables-sorting-control">
                                    <select className="form-select sorting-dropdown" {...filterRegister('jobTypeId')}>
                                        <option value="">All Job Types</option>
                                        {jobTypes.map((d, i) => (
                                            <option key={i} value={d.jobTypeId}>{d.typeName}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                    <Plus size={18} /> Add New Job
                                </button>
                                <a className="btn btn-info text-white" href="javascript:void(0);">
                                    <FolderOutput size={18} /> Export As CSV
                                </a>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive">
                                <table id="dataTableDefault" className="table text-nowrap text-start">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Title</th>
                                            <th>Employer</th>
                                            <th>Job Sector</th>
                                            <th>Published</th>
                                            <th>Location</th>
                                            <th>Applications</th>
                                            <th>Date Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((data, index) => (
                                            <tr key={data.jobId ?? index}>
                                                <td>{index + 1}</td>
                                                <td>{data.jobTitle}</td>
                                                <td>{data.employer}</td>
                                                <td>{data.jobSector}</td>
                                                <td>
                                                    <div
                                                        className={`toggle-switch ${data.published ? 'on' : ''}`}
                                                        onClick={() => updateJobStatus(data.jobId, !data.published)}
                                                    >
                                                        <div className="toggle-knob" />
                                                    </div>
                                                </td>
                                                <td style={{ maxWidth: '200px', textWrap: 'wrap' }}>
                                                    <p>{`${data.city}${data.city ? ', ' : ''}${data.state}${data.state ? ', ' : ''}${data.country}`}</p>
                                                </td>
                                                <td>{data.totalApplications}</td>
                                                <td>{new Date(data.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td>
                                                    <div className="d-flex-items gap-10">
                                                        <Tippy content="Edit Job">
                                                            <button
                                                                className="btn-icon btn-warning-light"
                                                                type="button"
                                                                onClick={() => { setJobEdit(data); setEditModalState(true); setSelectedJob(data) }}
                                                            >
                                                                <PenLine />
                                                            </button>
                                                        </Tippy>
                                                        <Tippy content="Preview Job">
                                                            <NavLink
                                                                className="btn-icon btn-info-light"
                                                                to={`/JobMgt/${hashIds.encode(data.jobId)}/${hashIds.encode(data.employerId)}`}
                                                                onClick={() => setSelectedJob(data)}
                                                            >
                                                                <Eye />
                                                            </NavLink>
                                                            {/* <NavLink
                                                                className="btn-icon btn-info-light"
                                                                to={`/JobMgt/${hashIds.encode(data.jobId)}/${hashIds.encode(data.employerId)}`}
                                                            >
                                                                <Eye />
                                                            </NavLink> */}
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {jobs.length === 0 && (
                                    <div className="py-4 w-full text-center">
                                        <span className="text-black">There haven't been any jobs added yet.</span>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <p className="text-black">
                                    Showing {jobs.length > 0 ? (pageNumber * limit) - limit + 1 : 0} to{' '}
                                    {jobs.length > 0 ? (pageNumber * limit) - limit + jobs.length : 0} of {totalJobs} entries
                                </p>
                                <div className="d-inline-flex flex-wrap">
                                    {pageNumber > 1 && (
                                        <a
                                            href="#"
                                            onClick={() => setPageNumber(p => p - 1)}
                                            className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                        >
                                            Previous
                                        </a>
                                    )}
                                    <a href="#" className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer">
                                        {pageNumber}
                                    </a>
                                    {(pageNumber * limit) < totalJobs && (
                                        <a
                                            href="#"
                                            onClick={() => setPageNumber(p => p + 1)}
                                            className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                        >
                                            Next
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}