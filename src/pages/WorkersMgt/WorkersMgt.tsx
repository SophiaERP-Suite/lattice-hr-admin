import {
    Briefcase,
    CheckCheck,
    ChevronRight,
    Eye,
    FolderOpenDot,
    FolderOutput,
    Gauge,
    Plus,
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { addNewWorker, fetchAllWorkers } from "../../utils/WorkerRequests";
import { ToastContainer, toast } from "react-toastify";
import { useForm, useWatch } from "react-hook-form";
import Hashids from "hashids";
import Modal from 'react-modal';
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";
import { fetchAllEmployers } from "../../utils/EmployerRequests";
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

interface WorkerFilterData {
    Employer: string;
    UserName: string;
}

export default function WorkersMgt() {
    const [workers, setWorkers] = useState<WorkerData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;
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
    const [addModalState, setAddModalState] = useState(false);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const [employers, setEmployers] = useState<EmployerData[]>([]);
    const { register: filterRegister, control: filterControl } = useForm<WorkerFilterData>();
    const filters = useWatch({ control: filterControl })

    useEffect(() => {
        fetchAllWorkers({
            pageNumber,
            limit,
            ...filters
        })
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    console.log(data);
                    setWorkers(data.data.workers);
                    setTotalCount(data.data.totalCount);
                })
            } else {
                res.text()
                .then(data => {
                    console.log(JSON.parse(data));
                })
            }
        })
    }, [pageNumber, limit, filters]);

    const refetchWorkers = async () => {
        const res = await fetchAllWorkers({
            pageNumber,
            limit,
            ...filters
        });
        if (res.status === 200 || res.status === 201) {
            const data = await res.json();
            setWorkers(data.data.workers);
            setTotalCount(data.data.totalCount);
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

    const submitWorker = async (data: WorkerRegister) => {
        if (isValid) {
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
            formData.append("Password", data.Password);
            formData.append("Gender", data.Gender);
            formData.append("ProfilePhoto", data.ProfilePhoto[0]);
            formData.append("DateOfBirth", data.DateOfBirth);
            formData.append("EmployerId", data.EmployerId);
            formData.append("Designation", data.Designation);
            formData.append("JoinDate", data.JoinDate);
            const res = await addNewWorker(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(() => {
                setAddModalState(false);
                refetchWorkers();
            })
        }
    }

    return <div className="container-fluid">
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
                <form noValidate onSubmit={handleSubmit(submitWorker)}>
                    <div className="d-flex justify-content-between border-bottom">
                        <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Worker</h1>
                        <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
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
                                                    required: 'Required'
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
                                                    required: 'Required'
                                                }
                                        )
                                }/>
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
                    <h1 className="page-title fs-18 lh-1">Worker Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
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
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-primary-transparent text-primary">
                        <Briefcase size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Total Workers</span>
                        <h2 className="mb-5">{ totalCount }</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-success-transparent text-success">
                    <FolderOpenDot size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Active Workers</span>
                        <h2 className="mb-5">{ totalCount }</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-danger-transparent text-danger">
                    <Gauge size={42}/>
                    </div>
                    <div className="card-content">
                    <span className="d-block fs-16 mb-5">Workers on Leave</span>
                    <h2 className="mb-5">10</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header justify-between">
                        <h4 className="d-flex-items gap-10">Workers<span className="badge bg-label-primary">{totalCount}</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <div className="dataTables-sorting-control ">
                                <input type="text" className="form-control" placeholder="Search by Employer Name" {
                                    ...filterRegister('Employer')
                                } />
                            </div>
                            <div className="dataTables-sorting-control ">
                                <input type="text" className="form-control" placeholder="Search by Workers Name" {
                                    ...filterRegister('UserName')
                                } />
                            </div>
                            <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                <Plus /> New Worker
                            </button>
                            <a className="btn btn-info text-white" href="javascript:void(0);">
                                <FolderOutput /> Export As CSV
                            </a>
                        </div>
                    </div>
                    <div className="card-body pt-15">
                        <div className="table-responsive">
                            <table id="companiesDataTable" className="table text-nowrap text-start w-100">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            S/N
                                        </th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Company</th>
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
                                                        { index + 1 }
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src={data.profilePhoto} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer">{ `${data.firstName} ${data.lastName}` }</h6>
                                                        </div>
                                                    </td>
                                                    <td>{data.email}</td>
                                                    <td>{ data.phone }</td>
                                                    <td>
                                                        <NavLink to={`/ClientMgt/${hashIds.encode(data.employerId)}`} className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src={data.employerLogo} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer">{ data.employer }</h6>
                                                        </NavLink>
                                                    </td>
                                                    <td>{ data.designation }</td>
                                                    <td>{new Date(data.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <NavLink className="btn-icon btn-info-light" to={`/WorkerMgt/${hashIds.encode(data.workerId)}`}>
                                                                <a><Eye /></a>
                                                            </NavLink>
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
                                    <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any registered worker</span>
                                    </div> : <></>
                            }
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <div className="flex justify-content-center align-items-center mb-1">
                                <p className="text-black">
                                    Showing { workers.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { workers.length > 0 ? (((pageNumber * limit) - limit) + 1) + (workers.length - 1) : 0 } of { totalCount } entries
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
                                    (pageNumber * limit) < totalCount && <a
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
}