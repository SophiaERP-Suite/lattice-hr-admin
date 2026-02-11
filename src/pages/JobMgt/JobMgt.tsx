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
import { useEffect, useState } from "react";
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
  dateCreated: string;
  officers: string;
}

interface JobSectorData {
  jobSectorId: number;
  name: string;
}

interface JobTypeData {
  jobTypeId: number;
  typeName: string;
}

interface JobFilter {
  jobSectorId: number;
  jobTypeId: number;
  jobTitle: string;
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

export default function JobMgt() {
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const { register, reset, handleSubmit, formState, control, setValue } = useForm<JobFormData>();
    const [totalJobs, setTotalJobs] = useState(0);
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
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const selectedCountry = useWatch({
        control,
        name: 'CountryId',
    });
    const selectedSector = useWatch({
        control,
        name: 'JobSectorId',
    });
    const selectedState = useWatch({
        control,
        name: 'StateId',
    });

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
        fetchAllJobs({ pageNumber, limit, ...filters })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setJobs(data.data.jobs);
                setTotalJobs(data.data.totalCount);
                setTotalExpired(data.data.totalExpired);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
    }, [pageNumber, limit, filters]);

    useEffect(() => {
        if (jobEdit) {
            editSetValue('JobTitle', jobEdit.jobTitle);
            editSetValue('JobSectorId', jobEdit.jobSectorId);
            editSetValue('JobTypeId', jobEdit.jobTypeId);
            editSetValue('JobDescription', jobEdit.jobDescription);
            editSetValue('CountryId', jobEdit.countryId);
            editSetValue('StateId', jobEdit.stateId);
            editSetValue('CityId', jobEdit.cityId);
            editSetValue('JobCategoryId', jobEdit.jobCategoryId);
            editSetValue('StateId', jobEdit.stateId);
            editSetValue('CityId', jobEdit.cityId);
        }
    }, [jobEdit, editSetValue]);

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
        fetchAllEmployers({ pageNumber: 1, limit: 1000 })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setEmployers(data.data.employers);
            })
        } else {
            res.text()
            .then(data => {
                console.log(JSON.parse(data));
            })
        }
        })
    }, []);

    const refetchJobs = async () => {
        try {
            const res = await fetchAllJobs({ pageNumber, limit, ...filters });
            if (res.status === 200) {
                const data = await res.json()
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
        if (!selectedSector || selectedSector == '') {
            setJobCategories([]);
            setValue('JobCategoryId', '');
            return;
        }
        fetchJobCategories(Number(selectedSector))
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setJobCategories(data.data);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, [selectedSector, setValue]);

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
                setEditState(data.data);
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
                setEditCities(data);
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

    const submitNewJob = async (data: JobFormData) => {
        if (!errors.JobTitle && !errors.JobDescription &&
            !errors.CountryId && !errors.StateId && 
            !errors.CityId && !errors.EmployerId &&
            !errors.JobSectorId && !errors.JobTypeId &&
            !errors.JobExpiration && !errors.JobViewScope && 
            !errors.Grade && !errors.JobAmount &&
            !errors.JobResponsibility && !errors.JobRequirement &&
            !errors.JobCategoryId && !errors.WorkModeId &&
            !errors.JobPhoto && !errors.IsPaid
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

            formData.append("JobExpiration", data.JobExpiration);
            formData.append("JobViewScope", data.JobViewScope);
            formData.append("Grade", String(data.Grade));
            formData.append("JobAmount", data.JobAmount);
            formData.append("IsPaid", `${Number(data.JobAmount) > 0}`);
            formData.append("JobTitle", data.JobTitle);
            formData.append("CountryId", data.CountryId);
            formData.append("JobCategoryId", data.JobCategoryId);
            formData.append("JobPhoto", data.JobPhoto[0]);
            formData.append("WorkModeId", data.WorkModeId);
            formData.append("JobResponsibility", data.JobResponsibility);
            formData.append("JobRequirement", data.JobRequirement);
            formData.append("JobSectorId", data.JobSectorId);
            formData.append("JobTypeId", data.JobTypeId);
            formData.append("StateId", data.StateId);
            formData.append("JobDescription", data.JobDescription);
            formData.append("CityId", String(data.CityId));
            formData.append("EmployerId", data.EmployerId);
            const res = await createJob(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(async () => {
                await refetchJobs();
                setAddModalState(false);
            });
        }
    }

    const editJob = async (data: JobFormData) => {
        if (!editErrors.JobTitle && !editErrors.JobDescription &&
            !editErrors.CountryId && !editErrors.StateId && 
            !editErrors.CityId && jobEdit &&
            !editErrors.JobSectorId && !editErrors.JobTypeId
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
            formData.append("JobTitle", data.JobTitle);
            formData.append("CountryId", data.CountryId);
            formData.append("JobSectorId", data.JobSectorId);
            formData.append("JobTypeId", data.JobTypeId);
            formData.append("StateId", data.StateId);
            formData.append("JobDescription", data.JobDescription);
            formData.append("CityId", String(data.CityId));
            const res = await updateJob(jobEdit.jobId, formData);
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
                    <form noValidate onSubmit={handleSubmit(submitNewJob)}>
                        <div className="d-flex justify-content-between border-bottom">
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Job</h1>
                            <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
                        </div>
                        <div className="mt-4">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-6">
                                    <label className="form-label">Job Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Job Title"
                                        {
                                            ...register('JobTitle',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }
                                    />
                                    <p className='error-msg'>{errors.JobTitle?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Sector</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('JobSectorId',
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
                                    <p className='error-msg'>{errors.JobSectorId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Category</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('JobCategoryId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }
                                        disabled={jobCategories.length === 0}>
                                        <option value="">Select Job Category</option>
                                        {
                                            jobCategories.map((data, index) => (
                                                <option key={index} value={data.jobCategoryId}>{ data.categoryName }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.JobCategoryId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Type</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('JobTypeId',
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
                                    <p className='error-msg'>{errors.JobTypeId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Work Mode</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('WorkModeId',
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
                                    <p className='error-msg'>{errors.WorkModeId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Employer</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('EmployerId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }>
                                        <option value="">Select Employer</option>
                                        {
                                            employers.map((data, index) => (
                                                <option key={index} value={data.employerId}>{ data.businessName }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.EmployerId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Country</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('CountryId',
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
                                    <p className='error-msg'>{errors.CountryId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">State</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('StateId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }
                                        disabled={states.length === 0}>
                                        <option value="">Select State</option>
                                        {
                                            states.map((data, index) => (
                                                <option key={index} value={data.stateId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.StateId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">City</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('CityId',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }
                                        disabled={cities.length === 0}>
                                        <option value="">Select City</option>
                                        {
                                            cities.map((data, index) => (
                                                <option key={index} value={data.cityId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.CityId?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job Expiration</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('JobExpiration',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }>
                                        <option value="">Select Job Expiration</option>
                                        <option value="14">14 Days</option>
                                        <option value="30">30 Days</option>
                                        <option value="60">60 Days</option>
                                        <option value="90">90 Days</option>
                                    </select>
                                    <p className='error-msg'>{errors.JobExpiration?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Job View Scope</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('JobViewScope',
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
                                    <p className='error-msg'>{errors.JobViewScope?.message}</p>
                                </div>
                                <div className="col-xl-6 text-start">
                                    <label htmlFor="logo" className="form-label">Job Photo</label>
                                    <input type="file" className="form-control" id="logo" placeholder="Job Photo"
                                        {
                                            ...register('JobPhoto',
                                                        {
                                                            required: 'Required'
                                                        }
                                                )
                                        }/>
                                    <p className='error-msg'>{errors.JobPhoto?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Payment Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Payment Amount"
                                        {
                                            ...register('JobAmount',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        } />
                                    <p className='error-msg'>{errors.JobAmount?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Expected Grade</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Expected Grade"
                                        {
                                            ...register('Grade',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        } />
                                    <p className='error-msg'>{errors.Grade?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Job Description</label>
                                    <Controller
                                        name="JobDescription"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        )}
                                    />
                                    <p className='error-msg'>{errors.JobDescription?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Job Requirement</label>
                                    <Controller
                                        name="JobRequirement"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        )}
                                    />
                                    <p className='error-msg'>{errors.JobRequirement?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Job Responsibility</label>
                                    <Controller
                                        name="JobResponsibility"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        )}
                                    />
                                    <p className='error-msg'>{errors.JobResponsibility?.message}</p>
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
                                        <CheckCheck size={18} className="mr-2" /> Add Job
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
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
                        jobEdit && (
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
                                                            required: 'Required'
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
                                                                    required: 'Required'
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
                        <h1 className="page-title fs-18 lh-1">Job Management</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
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
                <div className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                        <div className="avatar avatar-xl bg-primary-transparent text-primary">
                            <BriefcaseBusiness size={42}/>
                        </div>
                        <div className="card-content">
                            <span className="d-block fs-16 mb-5">Total Jobs</span>
                            <h2 className="mb-5">{totalJobs}</h2>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                <UserStar size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Applications</span>
                                <h2 className="mb-5">0</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6 col-12">
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

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="d-flex-items gap-10">Job List</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <div className="dataTables-sorting-control ">
                                    <input type="text" className="form-control" placeholder="Search by Title" {
                                        ...filterRegister('jobTitle')
                                    } />
                                </div>
                                <div className="dataTables-sorting-control ">
                                    <select className="form-select sorting-dropdown" { ...filterRegister('jobSectorId') }>
                                        <option value="">All Job Sectors</option>
                                        {
                                            jobSectors.map((data, index) => (
                                                <option key={index} value={data.jobSectorId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="dataTables-sorting-control ">
                                    <select className="form-select sorting-dropdown" { ...filterRegister('jobTypeId') }>
                                        <option value="">All Job Types</option>
                                        {
                                            jobTypes.map((data, index) => (
                                                <option key={index} value={data.jobTypeId}>{ data.typeName }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                    <Plus /> Add New Job
                                </button>
                                <a className="btn btn-info text-white" href="javascript:void(0);">
                                    <FolderOutput /> Export As CSV
                                </a>
                            </div>
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
                                        {
                                            jobs.map((data, index) => {
                                                return (
                                                    <tr key={data.jobId ?? index}>
                                                        <td>{ index + 1 }</td>
                                                        <td>{data.jobTitle}</td>
                                                        <td>{ data.employer }</td>
                                                        <td>{ data.jobSector }</td>
                                                        <td>
                                                            <div
                                                                className={`toggle-switch ${data.published ? 'on' : ''}`}
                                                                onClick={() => updateJobStatus(data.jobId, !data.published)}
                                                                >
                                                                <div className="toggle-knob" />
                                                            </div>
                                                        </td>
                                                        <td style={{ maxWidth: '200px', textWrap: 'wrap'}}>
                                                            <p>{ `${data.city} ${data.city && ','} ${data.state} ${data.state && ','} ${data.country}`}</p>
                                                        </td>
                                                        <td>0</td>
                                                        <td>{(new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <Tippy content="Edit Job">
                                                                    <button className="btn-icon btn-warning-light" type="button" onClick={() => { setJobEdit(data); setEditModalState(true); }}>
                                                                        <a><PenLine /></a>
                                                                    </button>
                                                                </Tippy>
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
                                        <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any jobs added</span>
                                        </div> : <></>
                                }
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <div className="flex justify-content-center align-items-center mb-1">
                                    <p className="text-black">
                                        Showing { jobs.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { jobs.length > 0 ? (((pageNumber * limit) - limit) + 1) + (jobs.length - 1) : 0 } of { totalJobs } entries
                                    </p>
                                </div>
                                <div className="d-inline-flex flex-wrap">
                                    {
                                        pageNumber > 1 && <a
                                            href="#"
                                            onClick={() => { if (pageNumber > 1) {setPageNumber(pageNumber - 1);} }}
                                            className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                        >
                                            Previous
                                        </a>
                                    }
                                    <a
                                        href="#"
                                        className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                    >
                                        { pageNumber }
                                    </a>
                                    {
                                        (pageNumber * limit) < totalJobs && <a
                                        href="#"
                                        onClick={() => { setPageNumber(pageNumber + 1); }}
                                        className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                        >
                                            Next
                                        </a>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}