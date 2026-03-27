import {
    Briefcase,
    ChevronRight,
    MapPin,
    PenLine,
    UserPen,
    Users,
    X,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useRef, useState } from "react";
import { getJobById, updateJob } from "../../utils/JobRequests";
import HtmlRenderer from "../../layout/HTMLRenderer";
import Modal from 'react-modal';
import { Controller, useForm, useWatch } from "react-hook-form";
import { fetchJobTypes } from "../../utils/JobTypeRequests";
import { fetchJobSectors } from "../../utils/JobSetorRequests";
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { toast, ToastContainer } from 'react-toastify';
import RichTextEditor from "../../layout/RichTextEditor";
import { fetchWorkModes } from "../../utils/WorkModeRequests";
import { fetchJobCategories } from "../../utils/JobCategoryRequests";
import type { EmployerData, JobCategoryData, JobFormData, JobSectorData, JobTypeData, WorkModeData } from "../../types/jobData";
import type { CountryData, StateData, CityData } from "../../types/location";

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
    jobExpiration: string;
    jobAmount: string;
    jobResponsibility: string;
    jobRequirement: string;
    jobCategoryId: string;
    jobCategory: string;
    isPaid: string;
    workModeId: string;
    workMode: string;
    jobViewScope: string;
    grade: string;
    totalApplications: number;
    jobPhoto: string;
    hasInterview: boolean;
    employerDetails: EmployerData;
}

export default function JobDetails() {
    const { id, clientId } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;

    const [job, setJob] = useState<JobData | null>(null);
    const [editModalState, setEditModalState] = useState(false);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [editState, setEditState] = useState<StateData[]>([]);
    const [editCity, setEditCities] = useState<CityData[]>([]);
    const [jobSectors, setJobSectors] = useState<JobSectorData[]>([]);
    const [jobTypes, setJobTypes] = useState<JobTypeData[]>([]);
    const [editJobCategories, setEditJobCategories] = useState<JobCategoryData[]>([]);
    const [workModes, setWorkModes] = useState<WorkModeData[]>([]);

    const {
        register: regEdit,
        reset: resetEdit,
        handleSubmit: submitEdit,
        formState: editFormState,
        control: editControl,
        setValue: editSetValue,
    } = useForm<JobFormData>();
    const { errors: editErrors } = editFormState;

    const editSelectedCountry = useWatch({ control: editControl, name: 'CountryId' });
    const editSelectedState = useWatch({ control: editControl, name: 'StateId' });
    const editSelectedSector = useWatch({ control: editControl, name: 'JobSectorId' });

    // Guard flag: true while programmatically pre-filling the edit form.
    // Cascade useEffects check this so they don't wipe dependent values during pre-fill.
    const isPopulatingEdit = useRef(false);

    const BASE_URL = "http://localhost:5127";

    // ─── Static data fetches ──────────────────────────────────────────────────

    useEffect(() => {
        fetchJobSectors()
            .then(res => { if (res.status === 200) res.json().then(data => setJobSectors(data.data)); })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchJobTypes()
            .then(res => { if (res.status === 200) res.json().then(data => setJobTypes(data.data)); })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchWorkModes()
            .then(res => { if (res.status === 200) res.json().then(data => setWorkModes(data)); })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchCountries()
            .then(res => { if (res.status === 200) res.json().then(data => setCountries(data.data ?? [])); })
            .catch(err => console.log(err));
    }, []);

    // ─── Load job data ────────────────────────────────────────────────────────

    useEffect(() => {
        getJobById(hashedId)
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => setJob(data.data));
                } else {
                    res.text().then(data => console.log(JSON.parse(data)));
                }
            });
    }, [hashedId]);

    const refetchJob = async () => {
        try {
            const res = await getJobById(hashedId);
            if (res.status === 200) {
                const data = await res.json();
                setJob(data.data);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Edit form pre-fill ───────────────────────────────────────────────────
    // Runs whenever `job` is set (initial load) or whenever the edit modal is opened.
    // Loads dependent data (states, cities, categories) FIRST, then sets all field
    // values at once so the cascade watchers below don't wipe them out.

    const populateEditForm = async (jobData: JobData) => {
        isPopulatingEdit.current = true;

        try {
            if (jobData.countryId) {
                const res = await fetchStatesByCountryId(Number(jobData.countryId));
                if (res.status === 200) {
                    const data = await res.json();
                    setEditState(data.data ?? []);
                }
            }

            if (jobData.stateId) {
                const res = await fetchCitiesByStateId(Number(jobData.stateId));
                if (res.status === 200) {
                    const data = await res.json();
                    setEditCities(data ?? []);
                }
            }

            if (jobData.jobSectorId) {
                const res = await fetchJobCategories(Number(jobData.jobSectorId));
                if (res.status === 200) {
                    const data = await res.json();
                    setEditJobCategories(data.data ?? []);
                }
            }

            editSetValue('JobTitle', jobData.jobTitle);
            editSetValue('JobSectorId', String(jobData.jobSectorId));
            editSetValue('JobTypeId', String(jobData.jobTypeId));
            editSetValue('JobDescription', jobData.jobDescription);
            editSetValue('CountryId', String(jobData.countryId));
            editSetValue('StateId', String(jobData.stateId));
            editSetValue('CityId', String(jobData.cityId));
            editSetValue('JobCategoryId', String(jobData.jobCategoryId));
            editSetValue('JobViewScope', jobData.jobViewScope);
            editSetValue('Grade', jobData.grade);
            editSetValue('JobAmount', jobData.jobAmount);
            editSetValue('JobResponsibility', jobData.jobResponsibility);
            editSetValue('JobRequirement', jobData.jobRequirement);
            editSetValue('WorkModeId', String(jobData.workModeId));
            editSetValue('IsPaid', jobData.isPaid);
            editSetValue('HasInterview', jobData.hasInterview);
            if (jobData.jobExpiration) {
                editSetValue('JobExpiration', jobData.jobExpiration.split('T')[0]);
            }
        } catch (err) {
            console.error('Error pre-filling edit form:', err);
        } finally {
            setTimeout(() => { isPopulatingEdit.current = false; }, 0);
        }
    };

    // Pre-fill whenever job data arrives
    useEffect(() => {
        if (job) populateEditForm(job);
    }, [job]);

    // Also re-populate when the modal opens (in case job was already loaded)
    useEffect(() => {
        if (editModalState && job) populateEditForm(job);
    }, [editModalState]);

    // ─── Cascade useEffects ───────────────────────────────────────────────────
    // Each skips its reset logic while pre-fill is in progress.
    // Resets happen only on genuine user-driven changes.

    useEffect(() => {
        if (isPopulatingEdit.current) return;
        if (!editSelectedSector || editSelectedSector === '') {
            setEditJobCategories([]);
            editSetValue('JobCategoryId', '');
            return;
        }
        fetchJobCategories(Number(editSelectedSector))
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setEditJobCategories(data.data ?? []);
                        editSetValue('JobCategoryId', '');
                    });
                }
            })
            .catch(err => console.log(err));
    }, [editSelectedSector]);

    useEffect(() => {
        if (isPopulatingEdit.current) return;
        if (!editSelectedCountry || editSelectedCountry === '') {
            setEditState([]);
            editSetValue('StateId', '');
            editSetValue('CityId', '');
            return;
        }
        fetchStatesByCountryId(Number(editSelectedCountry))
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setEditState(data.data ?? []);
                        editSetValue('StateId', '');
                        editSetValue('CityId', '');
                    });
                }
            })
            .catch(err => console.log(err));
    }, [editSelectedCountry]);

    useEffect(() => {
        if (isPopulatingEdit.current) return;
        if (!editSelectedState || editSelectedState === '') {
            setEditCities([]);
            editSetValue('CityId', '');
            return;
        }
        fetchCitiesByStateId(Number(editSelectedState))
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setEditCities(data ?? []);
                        editSetValue('CityId', '');
                    });
                }
            })
            .catch(err => console.log(err));
    }, [editSelectedState]);

    // ─── Submit handlers ──────────────────────────────────────────────────────

    const editJob = async (data: JobFormData) => {
        if (!job) return;

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

        const res = await updateJob(job.jobId, formData);
        handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(async () => {
                await refetchJob();
                setEditModalState(false);
            });
    };

    const updateJobStatus = async (jobId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("Published", String(status));
        const res = await updateJob(jobId, formData);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
            .finally(async () => { await refetchJob(); });
    };

    // ─── Render ───────────────────────────────────────────────────────────────

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

    return (
        <div className="container-fluid">
            <ToastContainer />

            {/* ── EDIT MODAL ────────────────────────────────────────────────── */}
            <Modal isOpen={editModalState} onRequestClose={() => setEditModalState(false)} style={modalStyle}>
                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '80vh' }}>
                    {job && (
                        <form noValidate onSubmit={submitEdit(editJob)}>
                            <div className="d-flex justify-content-between border-bottom pb-2 mb-4">
                                <h1 className="modal-title fs-16">Update Job</h1>
                                <button type="button" className="btn-close" onClick={() => setEditModalState(false)} />
                            </div>

                            {/* ── Basic Information ── */}
                            <h6 className="text-muted text-uppercase mb-3 fs-12">Basic Information</h6>
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label className="form-label">Job Title <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${editErrors.JobTitle ? 'is-invalid' : ''}`}
                                        placeholder="Job Title"
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

                            {/* ── Classification & Compensation ── */}
                            <h6 className="text-muted text-uppercase mb-3 mt-4 fs-12">Classification &amp; Compensation</h6>
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
                                        placeholder="Payment Amount"
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
                                        placeholder="Expected Grade"
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

                            {/* ── Location & Visibility ── */}
                            <h6 className="text-muted text-uppercase mb-3 mt-4 fs-12">Location &amp; Visibility</h6>
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
                                    <small className="text-muted">Determines who can see this job posting</small>
                                    <p className="error-msg">{editErrors.JobViewScope?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Move Job Expiration Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...regEdit('JobExpiration')}
                                    />
                                    <small className="text-muted">Leave empty to keep current expiration</small>
                                </div>
                            </div>

                            {/* ── Job Photo ── */}
                            <h6 className="text-muted text-uppercase mb-3 mt-4 fs-12">Job Photo</h6>
                            <div className="row gy-15 text-start">
                                <div className="col-xl-6">
                                    <label className="form-label">Upload New Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        {...regEdit('JobPhoto', { required: false })}
                                    />
                                    <small className="text-muted">Leave empty to keep current photo</small>
                                </div>
                                {job.jobPhoto && (
                                    <div className="col-xl-6">
                                        <label className="form-label">Current Photo</label>
                                        <div className="border rounded p-2">
                                            <img
                                                src={
                                                    job.jobPhoto.startsWith('http')
                                                        ? job.jobPhoto
                                                        : `${BASE_URL}/${job.jobPhoto}`
                                                }
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
                        <h1 className="page-title fs-18 lh-1">Job Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/JobMgt/${id}`}>Job Details</NavLink>
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
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

                {job && (
                    <>
                        <div className="d-flex flex-wrap gap-15 justify-content-end mb-4 align-items-center">
                            <div
                                className={`toggle-switch ${job.published ? 'on' : ''}`}
                                onClick={() => updateJobStatus(job.jobId, !job.published)}
                            >
                                <div className="toggle-knob" />
                            </div>
                            <button type="button" className="btn btn-warning" onClick={() => setEditModalState(true)}>
                                <PenLine size={18} /> Update Job
                            </button>
                            <div>
                                <NavLink
                                    to={`/JobDetails/Interview/${hashIds.encode(Number(job?.jobId))}/${clientId}`}
                                    className="btn btn-success btn-md mr-15"
                                >
                                    <UserPen size={18} /> Self Interview
                                </NavLink>
                                <NavLink
                                    to={`/JobDetails/JobApplications/${id}/${clientId}`}
                                    className="btn btn-info flex-fill"
                                >
                                    <Users size={18} /> Applicants
                                </NavLink>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="mb-15">{job.jobTitle}</h2>
                                </div>
                                <div className="card-body">
                                    <div className="mt-15">
                                        <div className="d-flex align-items-center gap-4">
                                            <div className="avatar avatar-big">
                                                <img
                                                    src={
                                                        job.jobPhoto && job.jobPhoto !== ""
                                                            ? job.jobPhoto.startsWith("http")
                                                                ? job.jobPhoto
                                                                : `${BASE_URL}/${job.jobPhoto}`
                                                            : job.employerDetails?.employerLogo &&
                                                                job.employerDetails.employerLogo !== ""
                                                                ? job.employerDetails.employerLogo
                                                                : "https://img.icons8.com/fluency/48/image--v1.png"
                                                    }
                                                    alt="Company Logo"
                                                    className="radius-100"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="mb-5">{job.employer}</h4>
                                                <div className="text-black">
                                                    <span className="me-3">
                                                        <MapPin size={18} /> {`${job.city}${job.city ? ', ' : ''}${job.state}${job.state ? ', ' : ''}${job.country}`}
                                                    </span>
                                                    <span><Briefcase size={18} /> {job.jobType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body pt-15">
                                    <div className="mb-15 text-start">
                                        <h4 className="mb-15">Full Job Description</h4>
                                        <hr />
                                        <HtmlRenderer html={job.jobDescription} />
                                    </div>
                                    <div className="mb-15">
                                        <h4 className="mb-15">Job Requirements</h4>
                                        <hr />
                                        <p className="mt-15" dangerouslySetInnerHTML={{ __html: job?.jobRequirement || "" }} />
                                    </div>
                                    <div className="mb-15">
                                        <h4 className="mb-15">Job Responsibility</h4>
                                        <hr />
                                        <p className="mt-15" dangerouslySetInnerHTML={{ __html: job?.jobResponsibility || "" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-header text-start">
                                    <h4 className="mb-10">Job Summary</h4>
                                </div>
                                <div className="card-body">
                                    <div className="mt-15 text-start">
                                        {job.publishedDate && (
                                            <p className="mb-5">
                                                <strong>Posted:</strong>{' '}
                                                {new Date(job.publishedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                        <p className="mb-5">
                                            <strong>Created:</strong>{' '}
                                            {new Date(job.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                        {job.jobExpiration && (
                                            <p className="mb-5">
                                                <strong>Expiration:</strong>{' '}
                                                {new Date(job.jobExpiration).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                        <p className="mb-5"><strong>Total Applications:</strong> {job.totalApplications}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header text-start">
                                    <h4 className="mb-10">Employer</h4>
                                </div>
                                <div className="card-body">
                                    <div className="mt-15 text-start">
                                        <div className="mb-3">
                                            <p className="mb-5"><strong>{job.employer}</strong></p>
                                            <p className="mb-5">{job.employerDetails.address}</p>
                                            <p>{`${job.employerDetails.city}${job.employerDetails.city ? ', ' : ''}${job.employerDetails.state}${job.employerDetails.state ? ', ' : ''}${job.employerDetails.country}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}