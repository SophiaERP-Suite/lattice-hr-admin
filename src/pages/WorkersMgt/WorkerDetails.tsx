import {
  BriefcaseBusiness,
  Building,
  Cake,
  CalendarClock,
  ChevronRight,
  Mail,
  MapPinHouse,
  PenLine,
  Phone,
  Venus,
  X,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { fetchWorkerById, updateWorkerById } from "../../utils/WorkerRequests";
import { useForm, useWatch } from "react-hook-form";
import { fetchAllEmployers } from "../../utils/EmployerRequests";
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";
import { toast, ToastContainer } from "react-toastify";
import Modal from 'react-modal';
import { handleCreateEmployee } from "../../utils/EmployeeResponse";

interface WorkerData {
    firstName : string;
    lastName : string;
    dateOfBirth : string;
    gender : string;
    designation : string;
    email : string;
    phone : string;
    profilePhoto : string;
    joinDate : string;
    countryId : string;
    country : string;
    stateId : string;
    state : string;
    cityId : string;
    city : string;
    dateCreated : string;
    userId: number;
    workerId: number;
    employer: string;
    employerId: number;
    employerLogo: string;
    address: string;
    postCode: string;
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

interface EmployerData {
  employerId: number;
  businessName: string;
}

const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);

  let age = today.getFullYear() - dob.getFullYear();
  const birthdayPassed = today.getMonth() > dob.getMonth()
    || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!birthdayPassed) {
    age--;
  }
  return age > 1 ? `${age} Years` : `${age} Year`;
}

export default function WorkerDetails() {
    const { id } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [workerDetails, setWorkerDetails] = useState<WorkerData | null>(null);
    const [editModalState, setEditModalState] = useState(false);
    const {
        setValue,
        control,
        register,
        formState: { errors, isValid},
        handleSubmit,
        reset
    } = useForm<WorkerRegister>();
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);
    const [employers, setEmployers] = useState<EmployerData[]>([]);
    const selectedCountry = useWatch({
        control,
        name: 'CountryId',
    });
    const selectedState = useWatch({
        control,
        name: 'StateId',
    });
    const password = useWatch({
        control,
        name: 'Password',
    });
    
    useEffect(() => {
        fetchWorkerById(hashedId)
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    setWorkerDetails(data.data);
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
        if (workerDetails) {
            setValue('Address', workerDetails.address);
            setValue("CountryId", workerDetails.countryId);
            setValue("FirstName", workerDetails.firstName);
            setValue("LastName", workerDetails.lastName);
            setValue("Email", workerDetails.email);
            setValue("Phone", workerDetails.phone);
            setValue("StateId", workerDetails.stateId);
            setValue("PostCode", workerDetails.postCode);
            setValue("Gender", workerDetails.gender);
            setValue("DateOfBirth", (new Date(workerDetails.dateOfBirth)).toISOString().split('T')[0]);
            setValue("EmployerId", `${workerDetails.employerId}`);
            setValue("Designation", workerDetails.designation);
            setValue("JoinDate", (new Date(workerDetails.joinDate)).toISOString().split('T')[0]);
            setValue("CityId", workerDetails.cityId);
        }
    }, [workerDetails, setValue])

    const refetchWorkerDetails = async () => {
        const res = await fetchWorkerById(hashedId);
        if (res.status === 200 || res.status === 201) {
            const data = await res.json();
            setWorkerDetails(data.data);
        } else {
            const data = await res.text();
            console.log(JSON.parse(data));
        }
    }

    useEffect(() => {
        fetchAllEmployers({ pageNumber: 1, limit: 500, })
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

    const updateWorker = async (data: WorkerRegister) => {
        if (isValid && hashedId) {
            const loader = document.getElementById('query-loader');
            const text = document.getElementById('query-text');
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
            formData.append("Gender", data.Gender);
            if (data.ProfilePhoto){
                formData.append("ProfilePhoto", data.ProfilePhoto[0]);
            }
            formData.append("DateOfBirth", data.DateOfBirth);
            formData.append("EmployerId", data.EmployerId);
            formData.append("Designation", data.Designation);
            formData.append("JoinDate", data.JoinDate);
            const res = await updateWorkerById(hashedId, formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(() => {
                setEditModalState(false);
                refetchWorkerDetails();
            })
        }
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
                
                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                    <form noValidate onSubmit={handleSubmit(updateWorker)}>
                        <div className="d-flex justify-content-between border-bottom">
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Update Worker Details</h1>
                            <button type="button" className="btn-close"  onClick={() => setEditModalState(false)}></button>
                        </div>
                        <div className="mt-4">
                            <div className="row gy-15">
    
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">First Name</label>
                                <input type="text" className="form-control" placeholder="First Name"
                                    {
                                        ...register('FirstName',
                                                    {
                                                        required: 'Required'
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.FirstName?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Last Name</label>
                                <input type="text" className="form-control" placeholder="Last Name"
                                    {
                                        ...register('LastName',
                                                    {
                                                        required: 'Required'
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.LastName?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="regsitrationNo" className="form-label"> E-Mail</label>
                                <input type="text" className="form-control" placeholder=" E-Mail"
                                    {
                                        ...register('Email',
                                                    {
                                                        required: 'Required'
                                                    }
                                            )
                                    }/>
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
                                    }/>
                                <p className='error-msg'>{errors.Phone?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Date Of Birth</label>
                                <input type="Date" className="form-control" placeholder="Date Of Birth"
                                    {
                                        ...register('DateOfBirth',
                                                    {
                                                        required: 'Required'
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.DateOfBirth?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="logo" className="form-label">Profile Photo</label>
                                <input type="file" className="form-control" id="logo" placeholder="Profile Photo"
                                    {
                                        ...register('ProfilePhoto',
                                                    {
                                                        required: false
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.ProfilePhoto?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="country" className="form-label">Gender</label>
                                    <select className="form-select" id="country"
                                        {
                                            ...register('Gender',
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
                                    <p className='error-msg'>{errors.Gender?.message}</p>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="country" className="form-label">Employer</label>
                                    <select className="form-select" id="country"
                                        {
                                            ...register('EmployerId',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                        }
                                    >
                                        <option value="">Select Employer</option>
                                        {
                                            employers.map((data, index) => (
                                                <option key={index} value={data.employerId}>{ data.businessName }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.EmployerId?.message}</p>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Join Date</label>
                                <input type="date" className="form-control" placeholder="Join Date"
                                    {
                                        ...register('JoinDate',
                                                    {
                                                        required: 'Required'
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.JoinDate?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Designation</label>
                                <input type="text" className="form-control" placeholder="Designation"
                                    {
                                        ...register('Designation',
                                                    {
                                                        required: 'Required'
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.Designation?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <select className="form-select" id="country"
                                        {
                                            ...register('CountryId',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                        }
                                    >
                                        <option value="">Select Country</option>
                                        {
                                            countries.map((data, index) => (
                                                <option key={index} value={data.countryId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.CountryId?.message}</p>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="state" className="form-label">State</label>
                                    <select className="form-select" id="state" disabled={states.length === 0}
                                        {
                                            ...register('StateId',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                        }
                                    >
                                        <option value="">Select State</option>
                                        {
                                            states.map((data, index) => (
                                                <option key={index} value={data.stateId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.StateId?.message}</p>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="city" className="form-label">City</label>
                                    <select className="form-select" id="city" disabled={cities.length === 0}
                                        {
                                            ...register('CityId',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                        }
                                    >
                                        <option value="">Select City</option>
                                        {
                                            cities.map((data, index) => (
                                                <option key={index} value={data.cityId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.CityId?.message}</p>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="postcode" className="form-label">PostCode</label>
                                <input type="text" className="form-control" id="postcode" placeholder="PostCode" {
                                            ...register('PostCode',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                        }/>
                                
                                <p className='error-msg'>{errors.PostCode?.message}</p>
                            </div>
                            <div className="col-xl-12 text-start">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea className="form-control" id="address" placeholder="Address" {
                                            ...register('Address',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                        }>
                                    </textarea>
                                <p className='error-msg'>{errors.Address?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="regsitrationNo" className="form-label">Password</label>
                                <input type="password" className="form-control" placeholder="Password"
                                    {
                                        ...register('Password',
                                                    {
                                                        required: false
                                                    }
                                            )
                                    }/>
                                <p className='error-msg'>{errors.Password?.message}</p>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="regsitrationNo" className="form-label">Confirm Password</label>
                                <input type="password" className="form-control" placeholder="Confirm Password"
                                    {...register('ConfirmPassword', {
                                            required: false,
                                            validate: (value) => {
                                                if (!password) return true;
                                                return value === password || 'Passwords do not match'
                                            }
                                        })}
                                    />
                                <p className='error-msg'>{errors.ConfirmPassword?.message}</p>
                            </div>
                        </div>
                        </div>
                        <div>
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" onClick={() => setEditModalState(false)}>
                                    <X size={18} className="mr-2" /> Cancel
                                </button>
                                <button type="submit" className="btn btn-warning">
                                    <div className="dots" id="query-loader">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <span id="query-text">
                                        <PenLine size={18} className="mr-2" /> Update Worker
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
                        <h1 className="page-title fs-18 lh-1">Worker Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/WorkerMgt/${id}`}>
                                        Worker Details
                                    </NavLink>
                                </li>
                                 <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/WorkerMgt">
                                        Worker Management
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
                    workerDetails && (
                        <>
                            <div className="d-flex flex-wrap gap-15 justify-content-end mb-4 align-items-center">
                                <button type="button" className="btn btn-warning" onClick={() => setEditModalState(true)}>
                                    <PenLine /> Update Worker
                                </button>
                            </div>
                            <div className="col-xxl-3 col-xl-5 col-lg-5">
                                <div className="sidebar-sticky">
                                    <div className="card">
                                        <div className="company-info">
                                            <div className="company-logo">
                                                <img src={workerDetails.profilePhoto.startsWith('/') ? `http://localhost:5127/${workerDetails.profilePhoto}` : workerDetails.profilePhoto} alt="image not found" />
                                            </div>
                                            <h2 className="company-name mb-15">{ `${workerDetails.firstName} ${workerDetails.lastName}` }</h2>

                                            <div className="company-info-list mb-25">
                                                <ul>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Mail /></span> <Tippy content="Email"><span style={{ textWrap: 'wrap'}}>{workerDetails.email ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Phone /></span> <Tippy content="Phone"><span style={{ textWrap: 'wrap'}}>{workerDetails.phone ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Cake /></span> <Tippy content="Date of Birth"><span style={{ textWrap: 'wrap'}}>{
                                                        workerDetails.dateOfBirth
                                                            ? `${(new Date(workerDetails.dateOfBirth)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} (${calculateAge(new Date(workerDetails.dateOfBirth))})`
                                                            : 'None Provided'
                                                        }</span></Tippy>
                                                    </li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Venus /></span> <Tippy content="Gender"><span style={{ textWrap: 'wrap'}}>{workerDetails.gender ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><MapPinHouse /> <Tippy content="Location"><span style={{ textWrap: 'wrap'}}>{ `${workerDetails.address}${workerDetails.address && ','} ${workerDetails.city}${workerDetails.city && ','} ${workerDetails.state}${workerDetails.state && ','} ${workerDetails.country}`}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><BriefcaseBusiness /></span> <Tippy content="Designation"><span style={{ textWrap: 'wrap'}}>{workerDetails.designation ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}>
                                                        <span><Building /></span>
                                                        <Tippy content="Employer">
                                                            <NavLink to={`/ClientMgt/${hashIds.encode(workerDetails.employerId)}`} className="d-flex-items gap-10">
                                                                <div className="avatar avatar-xs radius-100">
                                                                    <img className="radius-100" src={workerDetails.employerLogo} alt="image not found"/>
                                                                </div>
                                                                <h6 className="cursor-pointer">{ workerDetails.employer }</h6>
                                                            </NavLink>
                                                        </Tippy>
                                                    </li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><CalendarClock /></span> <Tippy content="Join Date"><span style={{ textWrap: 'wrap'}}>{new Date(workerDetails.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></Tippy></li>
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
                                                <button className="nav-link active" id="pills-timesheet-tab" data-bs-toggle="pill" data-bs-target="#pills-timesheet" type="button" role="tab" aria-controls="pills-timesheet" aria-selected="false" tabIndex={1}>Timesheet</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-payslip-tab" data-bs-toggle="pill" data-bs-target="#pills-payslip" type="button" role="tab" aria-controls="pills-payslip" aria-selected="false" tabIndex={1}>Payslips</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane show active" id="pills-timesheet" role="tabpanel" aria-labelledby="pills-timesheet-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Timesheet</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">S/N</th>
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Hours</th>
                                                                <th scope="col">Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        </tbody>
                                                    </table>
                                                    <div className="py-4 whitespace-nowrap w-full">
                                                        <span className="px-6 py-4 text-left font-medium text-black">This worker hasn't had any timesheet log</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-payslip" role="tabpanel" aria-labelledby="pills-payslip-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Payslip</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">
                                                                    S/N
                                                                </th>
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Amount</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        </tbody>
                                                    </table>
                                                        <div className="py-4 whitespace-nowrap w-full">
                                                            <span className="px-6 py-4 text-left font-medium text-black">This worker has no payslip</span>
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