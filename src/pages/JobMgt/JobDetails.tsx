import {
  Briefcase,
  ChevronRight,
  MapPin,
  PenLine,
  X,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
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

interface EmployerData {
  jobSectorId: string;
  jobSector: string;
  companySize: string;
  registrationNo: string;
  websiteUrl: string;
  employerLogo: string;
  countryId: string;
  country: string;
  packageId: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  address: string;
  postCode: string;
  dateCreated: string;
}

interface JobFormData {
  JobTitle: string;
  JobDescription: string;
  EmployerId: string;
  JobSectorId: string;
  JobTypeId: string;
  CountryId: string;
  StateId: string;
  CityId: string;
  JobExpiration: string;
  JobAmount: string;
  JobResponsibility: string;
  JobRequirement: string;
  JobCategoryId: string;
  IsPaid: string;
  WorkModeId: string;
  JobViewScope: string;
  Grade: string;
  JobPhoto: string;
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
  jobPhoto: string;
  employerDetails: EmployerData;
}

interface JobSectorData {
  jobSectorId: number;
  name: string;
}

interface JobTypeData {
  jobTypeId: number;
  typeName: string;
}

interface JobCategoryData {
  jobCategoryId: number;
  jobSector: string;
  jobSectorId: string;
  isEnabled: boolean;
  categoryName: string;
}
interface WorkModeData {
  workModeId: number;
  isEnabled: boolean;
  modeName: string;
}

export default function JobDetails() {
    const { id } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [job, setJob] = useState<JobData | null>(null);const {
        register: regEdit,
        reset: resetEdit,
        handleSubmit: submitEdit,
        formState: editFormState,
        control: editControl,
        setValue: editSetValue,
    } = useForm<JobFormData>();
    const { errors: editErrors } = editFormState;
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [editState, setEditState] = useState<StateData[]>([]);
    const [editCity, setEditCities] = useState<CityData[]>([]);
    const [jobSectors, setJobSectors] = useState<JobSectorData[]>([]);
    const [jobTypes, setJobTypes] = useState<JobTypeData[]>([]);
    const [editModalState, setEditModalState] = useState(false);
    const [editJobCategories, setEditJobCategories] = useState<JobCategoryData[]>([]);
    const [workModes, setWorkModes] = useState<WorkModeData[]>([]);
    const editSelectedCountry = useWatch({
        control: editControl,
        name: 'CountryId',
    });
    const editSelectedState = useWatch({
        control: editControl,
        name: 'StateId',
    });
    const editSelectedSector = useWatch({
        control: editControl,
        name: 'JobSectorId',
    });

    useEffect(() => {
        if (job) {
            editSetValue('JobTitle', job.jobTitle);
            editSetValue('JobSectorId', job.jobSectorId);
            editSetValue('JobTypeId', job.jobTypeId);
            editSetValue('JobDescription', job.jobDescription);
            editSetValue('CountryId', job.countryId);
            editSetValue('StateId', job.stateId);
            editSetValue('CityId', job.cityId);
            editSetValue('JobCategoryId', job.jobCategoryId);
            editSetValue('JobExpiration', job.jobExpiration);
            editSetValue('JobViewScope', job.jobViewScope);
            editSetValue('Grade', job.grade);
            editSetValue('JobAmount', job.jobAmount);
            editSetValue('JobResponsibility', job.jobResponsibility);
            editSetValue('JobRequirement', job.jobRequirement);
            editSetValue('WorkModeId', job.workModeId);
        }
    }, [job, editSetValue]);
    
    useEffect(() => {
        fetchWorkModes()
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    setWorkModes(data);
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
        if (!editSelectedSector || editSelectedSector == '') {
            setEditJobCategories([]);
            editSetValue('JobCategoryId', '');
            return;
        }
        fetchJobCategories(Number(editSelectedSector))
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setEditJobCategories(data.data);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, [editSelectedSector, editSetValue]);

    useEffect(() => {
        getJobById(hashedId)
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data);
                setJob(data.data);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
    }, [hashedId]);

    const refetchJobs = async () => {
        try {
            const res = await getJobById(hashedId);
            if (res.status === 200) {
                const data = await res.json()
                console.log(data);
                setJob(data.data);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJobSectors()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
            setJobSectors(data.data);
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
        fetchJobTypes()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
            setJobTypes(data.data);
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
        fetchCountries()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log('Country',data)
                setCountries(data.data ?? []);
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
        if (!editSelectedCountry || editSelectedCountry == '') {
            setEditState([]);
            editSetValue('StateId', '');
            editSetValue('CityId', '')
            return;
        }
        fetchStatesByCountryId(Number(editSelectedCountry))
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setEditState(data.data ?? []);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, [editSelectedCountry, editSetValue]);

    useEffect(() => {
        if (!editSelectedState || editSelectedState == '') {
            setEditCities([]);
            editSetValue('CityId', '')
            return;
        }
        fetchCitiesByStateId(Number(editSelectedState))
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data)
                setEditCities(data ?? []);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, [editSelectedState, editSetValue]);

    const editJob = async (data: JobFormData) => {
        if (!editErrors.JobTitle && !editErrors.JobDescription &&
            !editErrors.CountryId && !editErrors.StateId && 
            !editErrors.CityId && job &&
            !editErrors.JobSectorId && !editErrors.JobTypeId &&
            !editErrors.JobExpiration && !editErrors.JobViewScope && 
            !editErrors.Grade && !editErrors.JobAmount &&
            !editErrors.JobResponsibility && !editErrors.JobRequirement &&
            !editErrors.JobCategoryId && !editErrors.WorkModeId &&
            !editErrors.JobPhoto && !editErrors.IsPaid
        ) {
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            if (!data.JobExpiration || data.JobExpiration != ""){
                formData.append("JobExpiration", data.JobExpiration);
            }
            formData.append("JobViewScope", data.JobViewScope);
            formData.append("Grade", String(data.Grade));
            formData.append("JobAmount", data.JobAmount);
            formData.append("IsPaid", `${Number(data.JobAmount) > 0}`);
            formData.append("JobTitle", data.JobTitle);
            formData.append("CountryId", data.CountryId);
            formData.append("JobCategoryId", data.JobCategoryId);
            if (!data.JobPhoto || data.JobPhoto != ""){
                formData.append("JobPhoto", data.JobPhoto[0]);
            }
            formData.append("WorkModeId", data.WorkModeId);
            formData.append("JobResponsibility", data.JobResponsibility);
            formData.append("JobRequirement", data.JobRequirement);
            formData.append("JobSectorId", data.JobSectorId);
            formData.append("JobTypeId", data.JobTypeId);
            formData.append("StateId", data.StateId);
            formData.append("JobDescription", data.JobDescription);
            formData.append("CityId", String(data.CityId));
            const res = await updateJob(job.jobId, formData);
            handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(async () => {
                await refetchJobs();
                setEditModalState(false);
            });
        }
    }

    const updateJobStatus = async (jobId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("Published", String(status));
        const res = await updateJob(jobId, formData);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
        .finally(async () => {
            await refetchJobs();
        });
    }

    return (
        <div className="container-fluid">
            <ToastContainer />
            <Modal isOpen={editModalState} onRequestClose={() => { setEditModalState(false); }}
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
                
                <div  className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                    {
                        job && (
                            <form noValidate onSubmit={submitEdit(editJob)}>
                                <div className="d-flex justify-content-between border-bottom">
                                    <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Update Job</h1>
                                    <button type="button" className="btn-close"  onClick={() => setEditModalState(false)}></button>
                                </div>
                                <div className="mt-4">
                                    <div className="row gy-15 text-start">
                                        <div className="col-xl-12">
                                            <label className="form-label">Job Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Job Title"
                                                {
                                                    ...regEdit('JobTitle',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }
                                            />
                                            <p className='error-msg'>{editErrors.JobTitle?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Job Sector</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('JobSectorId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Job Sector</option>
                                                {
                                                    jobSectors.map((data, index) => (
                                                        <option key={index} value={data.jobSectorId}>{ data.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.JobSectorId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Job Category</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('JobCategoryId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }
                                                disabled={editJobCategories.length === 0}>
                                                <option value="">Select Job Category</option>
                                                {
                                                    editJobCategories.map((data, index) => (
                                                        <option key={index} value={data.jobCategoryId}>{ data.categoryName }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.JobCategoryId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Job Type</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('JobTypeId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Job Type</option>
                                                {
                                                    jobTypes.map((data, index) => (
                                                        <option key={index} value={data.jobTypeId}>{ data.typeName }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.JobTypeId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Work Mode</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('WorkModeId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Work Mode</option>
                                                {
                                                    workModes.map((data, index) => (
                                                        <option key={index} value={data.workModeId}>{ data.modeName }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.WorkModeId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Country</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('CountryId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Country</option>
                                                {
                                                    countries.map((data, index) => (
                                                        <option key={index} value={data.countryId}>{ data.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.CountryId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">State</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('StateId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }
                                                disabled={editState.length === 0}>
                                                <option value="">Select State</option>
                                                {
                                                    editState.map((data, index) => (
                                                        <option key={index} value={data.stateId}>{ data.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.StateId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">City</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('CityId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }
                                                disabled={editCity.length === 0}>
                                                <option value="">Select City</option>
                                                {
                                                    editCity.map((data, index) => (
                                                        <option key={index} value={data.cityId}>{ data.name }</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.CityId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Job Expiration</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('JobExpiration',
                                                        {
                                                            required: false
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Job Expiration</option>
                                                <option value="14">14 Days</option>
                                                <option value="30">30 Days</option>
                                                <option value="60">60 Days</option>
                                                <option value="90">90 Days</option>
                                            </select>
                                            <p className='error-msg'>{editErrors.JobExpiration?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Job View Scope</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('JobViewScope',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select View Scope</option>
                                                <option value="Global">Global</option>
                                                <option value="Country">Country</option>
                                                <option value="State">State</option>
                                                <option value="City">City</option>
                                            </select>
                                            <p className='error-msg'>{editErrors.JobViewScope?.message}</p>
                                        </div>
                                        <div className="col-xl-6 text-start">
                                            <label htmlFor="logo" className="form-label">Job Photo</label>
                                            <input type="file" className="form-control" id="logo" placeholder="Job Photo"
                                                {
                                                    ...regEdit('JobPhoto',
                                                                {
                                                                    required: false
                                                                }
                                                        )
                                                }/>
                                            <p className='error-msg'>{editErrors.JobPhoto?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Payment Amount</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Payment Amount"
                                                {
                                                    ...regEdit('JobAmount',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                } />
                                            <p className='error-msg'>{editErrors.JobAmount?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Expected Grade</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Expected Grade"
                                                {
                                                    ...regEdit('Grade',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                } />
                                            <p className='error-msg'>{editErrors.Grade?.message}</p>
                                        </div>
                                        <div className="col-xl-12">
                                            <label className="form-label">Job Description</label>
                                            <Controller
                                                name="JobDescription"
                                                control={editControl}
                                                rules={{ required: 'Required' }}
                                                render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                                )}
                                            />
                                            <p className='error-msg'>{editErrors.JobDescription?.message}</p>
                                        </div>
                                        <div className="col-xl-12">
                                            <label className="form-label">Job Requirement</label>
                                            <Controller
                                                name="JobRequirement"
                                                control={editControl}
                                                rules={{ required: 'Required' }}
                                                render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                                )}
                                            />
                                            <p className='error-msg'>{editErrors.JobRequirement?.message}</p>
                                        </div>
                                        <div className="col-xl-12">
                                            <label className="form-label">Job Responsibility</label>
                                            <Controller
                                                name="JobResponsibility"
                                                control={editControl}
                                                rules={{ required: 'Required' }}
                                                render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                                )}
                                            />
                                            <p className='error-msg'>{editErrors.JobResponsibility?.message}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-end gap-10 mt-20">
                                        <button type="button" className="btn btn-danger" onClick={() => setEditModalState(false)}>
                                            <X size={18} className="mr-2" /> Cancel
                                        </button>
                                        <button type="submit" className="btn btn-warning">
                                            <div className="dots" id="query-loader-1">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <span id="query-text-1">
                                                <PenLine size={18} className="mr-2" /> Update Job
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
            </Modal>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Job Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/JobMgt/${id}`}>
                                        Job Details
                                    </NavLink>
                                </li>
                                 <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/JobMgt">
                                        Job Management
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
                    job && (
                        <>
                            <div className="d-flex flex-wrap gap-15 justify-content-end mb-4 align-items-center">
                                <div
                                    className={`toggle-switch ${job.published ? 'on' : ''}`}
                                    onClick={() => updateJobStatus(job.jobId, !job.published)}
                                    >
                                    <div className="toggle-knob" />
                                </div>
                                <button type="button" className="btn btn-warning" onClick={() => setEditModalState(true)}>
                                    <PenLine /> Update Job
                                </button>
                            </div>
                            <div className="col-lg-8">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="">
                                            <h2 className="mb-15">{ job.jobTitle}</h2>
                                            <div className="d-flex align-items-center gap-4">
                                                <div className="avatar avatar-big">
                                                    <img src={job.employerDetails.employerLogo } alt="Company Logo" className="radius-100"/>
                                                </div>
                                                <div>
                                                    <h4 className="mb-5">{ job.employer }</h4>
                                                    <div className="text-black">
                                                        <span className="me-3">
                                                            <MapPin size={18} /> {`${job.city} ${job.city && ','} ${job.state} ${job.state && ','} ${job.country}`}
                                                        </span>
                                                        <span><Briefcase size={18} /> { job.jobType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body pt-15">
                                        <div className="mb-15 text-start">
                                            <h4 className="mb-5">Full Job Description</h4>
                                            <HtmlRenderer html={job.jobDescription} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-body text-start">
                                        <h4 className="mb-10">Job Summary</h4>
                                        {
                                            job.publishedDate && (
                                                <p className="mb-5"><strong>Posted:</strong> {(new Date(job.publishedDate)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            )
                                        }
                                        <p className="mb-5"><strong>Created:</strong> {(new Date(job.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        {
                                            job.jobExpiration && (
                                                <p className="mb-5"><strong>Expiration:</strong> {(new Date(job.jobExpiration)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            )
                                        }
                                        <p className="mb-5"><strong>Total Applications:</strong> 0</p>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-body text-start">
                                        <h4 className="mb-10">Employer</h4>
                                        <div className="mb-3">
                                            <p className="mb-5"><strong>{ job.employer }</strong></p>
                                            <p className="mb-5">{ job.employerDetails.address }</p>
                                            <p>{`${job.employerDetails.city} ${job.employerDetails.city && ','} ${job.employerDetails.state} ${job.employerDetails.state && ','} ${job.employerDetails.country}`}</p>
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