import {
    BookUser,
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
import { addNewEmployer, fetchAllEmployers } from "../../utils/EmployerRequests";
import { fetchJobSectors } from "../../utils/JobSetorRequests";
import { useForm, useWatch } from "react-hook-form";
import Hashids from "hashids";
import Modal from 'react-modal';
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { toast, ToastContainer } from 'react-toastify';

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
  jobsPosted: string;
}

interface JobSectorData {
  jobSectorId: number;
  name: string;
}

interface EmployerFilter {
    jobSectorId: string;
    businessName: string;
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

interface EmployerRegister{
  BusinessName: string;
  JobSectorId: string;
  CompanySize: string;
  RegistrationNo: string;
  WebsiteUrl: string;
  CountryId: string;
  StateId: string;
  CityId: string;
  Address: string;
  PostCode: string;
  EmployerLogo: string;
  CompanyMail: string;
  CompanyPhone: string;
  VAT: string;
}

export default function ClientMgt() {
    const [employers, setEmployers] = useState<EmployerData[]>([]);
    const [totalEmployers, setTotalEmployers] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;
    const [jobSectors, setJobSectors] = useState<JobSectorData[]>([]);
    const { register, control } = useForm<EmployerFilter>();
    const filters = useWatch({ control });
    const [countries, setCountries] = useState<CountryData[]>([]);
    const {
        setValue,
        control: regControl,
        register: empRegister,
        formState,
        handleSubmit,
        reset
    } = useForm<EmployerRegister>()
    const { errors } = formState;
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);
    const selectedCountry = useWatch({
        control: regControl,
        name: 'CountryId',
    });
    const selectedState = useWatch({
        control: regControl,
        name: 'StateId',
    });
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const [addModalState, setAddModalState] = useState(false);

    useEffect(() => {
        fetchAllEmployers({ pageNumber, limit, ...filters })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data);
                setEmployers(data.data.employers);
                setTotalEmployers(data.data.totalCount);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
    }, [pageNumber, limit, filters]);

    const refetchEmployers = async () => {
        try {
            const res = await fetchAllEmployers({ pageNumber, limit, ...filters });
            if (res.status === 200) {
                const data = await res.json();
                setEmployers(data.data.employers);
                setTotalEmployers(data.data.totalCount);
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

    const submitEmployer = async (data: EmployerRegister) => {
        if (!errors.CompanyMail && !errors.CompanyPhone &&
            !errors.VAT && !errors.RegistrationNo &&
            !errors.Address && !errors.CountryId &&
            !errors.BusinessName && !errors.StateId &&
            !errors.JobSectorId && !errors.CompanySize &&
            !errors.CityId && !errors.WebsiteUrl &&
            !errors.PostCode && !errors.EmployerLogo
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
            formData.append('CompanyPhone', data.CompanyPhone);
            formData.append('CompanyMail', data.CompanyMail);
            formData.append('VAT', data.VAT);
            formData.append('RegistrationNo', data.RegistrationNo);
            formData.append('Address', data.Address);
            formData.append('StateId', data.StateId);
            formData.append('CountryId', data.CountryId);
            formData.append('CityId', data.CityId);
            formData.append('JobSectorId', data.JobSectorId);
            formData.append('BusinessName', data.BusinessName);
            formData.append('CompanySize', data.CompanySize);
            formData.append('WebsiteUrl', data.WebsiteUrl);
            formData.append('PostCode', data.PostCode);
            formData.append('EmployerLogo', data.EmployerLogo[0]);
            const res = await addNewEmployer(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(() => {
                setAddModalState(false);
                refetchEmployers();
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
                <form noValidate onSubmit={handleSubmit(submitEmployer)}>
                    <div className="d-flex justify-content-between border-bottom">
                        <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Client</h1>
                        <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
                    </div>
                    <div className="mt-4">
                        <div className="row gy-15">

                        <div className="col-xl-12 text-start">
                            <label htmlFor="fullName" className="form-label">Business Name</label>
                            <input type="text" className="form-control" placeholder="Business Name"
                                {
                                    ...empRegister('BusinessName',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.BusinessName?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <label htmlFor="regsitrationNo" className="form-label">Company Mail</label>
                            <input type="text" className="form-control" placeholder="Company Mail"
                                {
                                    ...empRegister('CompanyMail',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.CompanyMail?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <label htmlFor="regsitrationNo" className="form-label">Company Phone</label>
                            <input type="text" className="form-control" placeholder="Company Phone"
                                {
                                    ...empRegister('CompanyPhone',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.CompanyPhone?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <label htmlFor="logo" className="form-label">Business Logo</label>
                            <input type="file" className="form-control" id="logo" placeholder="Business Logo"
                                {
                                    ...empRegister('EmployerLogo',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.EmployerLogo?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <div>
                                <label htmlFor="jobSector" className="form-label">Job Sector</label>
                                <select className="form-select" id="jobSector" {
                                    ...empRegister('JobSectorId',
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
                        </div>
                        <div className="col-xl-6 text-start">
                            <div>
                                <label htmlFor="companySize" className="form-label">Company Size</label>
                                <select className="form-select" id="companySize"{
                                    ...empRegister('CompanySize',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }>
                                    <option value="">Select Company Size</option>
                                    <option value="small">1 - 50 employees (Small)</option>
                                    <option value="medium">51 - 250 employees (Medium)</option>
                                    <option value="large">250+ employees (Large)</option>
                                </select>
                                <p className='error-msg'>{errors.CompanySize?.message}</p>
                            </div>
                        </div>
                        <div className="col-xl-6 text-start">
                            <label htmlFor="regsitrationNo" className="form-label">Registration No</label>
                            <input type="text" className="form-control" placeholder="Regsitration No"
                                {
                                    ...empRegister('RegistrationNo',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.RegistrationNo?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <label htmlFor="regsitrationNo" className="form-label">VAT No</label>
                            <input type="text" className="form-control" placeholder="VAT No"
                                {
                                    ...empRegister('VAT',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.VAT?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <label htmlFor="website" className="form-label">Website</label>
                            <input type="text" className="form-control" id="website" placeholder="Website URL"
                                {
                                    ...empRegister('WebsiteUrl',
                                                {
                                                    required: 'Required'
                                                }
                                        )
                                }/>
                            <p className='error-msg'>{errors.WebsiteUrl?.message}</p>
                        </div>
                        <div className="col-xl-6 text-start">
                            <div>
                                <label htmlFor="country" className="form-label">Country</label>
                                <select className="form-select" id="country"
                                    {
                                        ...empRegister('CountryId',
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
                                        ...empRegister('StateId',
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
                                        ...empRegister('CityId',
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
                                        ...empRegister('PostCode',
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
                                        ...empRegister('Address',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                    }>
                                </textarea>
                            <p className='error-msg'>{errors.Address?.message}</p>
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
                                    Add Employer
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
                    <h1 className="page-title fs-18 lh-1">Client Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
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
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-primary-transparent text-primary">
                        <BookUser size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Total Clients</span>
                        <h2 className="mb-5">{totalEmployers}</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-warning-transparent text-warning">
                    <Gauge size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Avg. Jobs/Clients</span>
                        <h2 className="mb-5">0%</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-danger-transparent text-danger">
                    <FolderOpenDot size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Inactive Clients</span>
                        <h2 className="mb-5">0</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header justify-between">
                        <h4 className="d-flex-items gap-10">Clients<span className="badge bg-label-primary">{ totalEmployers }</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <div className="dataTables-sorting-control ">
                                <input type="text" className="form-control" placeholder="Search by Name" {
                                    ...register('businessName')
                                } />
                            </div>
                            <div className="dataTables-sorting-control ">
                                <select className="form-select sorting-dropdown"{
                                    ...register('jobSectorId')
                                }>
                                    <option value="">All Job Sectors</option>
                                    {
                                        jobSectors.map((data, index) => (
                                            <option key={index} value={data.jobSectorId}>{data.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                <Plus /> New Client
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
                                        <th scope="col">S/N</th>
                                        <th scope="col">Client</th>
                                        <th scope="col">Package</th>
                                        <th scope="col">Job Sector</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Jobs Posted</th>
                                        <th scope="col">Date Joined</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        employers.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        { index + 1}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-md radius-100">
                                                                <img className="radius-100" src={data.employerLogo} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer">{ data.businessName }</h6>
                                                        </div>
                                                    </td>
                                                    <td>{ data.package ?? 'None Subscribed' }</td>
                                                    <td>{ data.jobSector }</td>
                                                    <td style={{ maxWidth: '200px', textWrap: 'wrap'}}>
                                                        <p style={{ marginBottom: '0px' }}>{data.address}</p>
                                                        <p>{ `${data.city} ${data.city && ','} ${data.state} ${data.state && ','} ${data.country}`}</p>
                                                    </td>
                                                    <td>{data.jobsPosted}</td>
                                                    <td>{ new Date(data.dateCreated).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <NavLink to={`/ClientMgt/${hashIds.encode(data.employerId)}`} className="btn-icon btn-info-light">
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
                                employers.length === 0 ?
                                    <div className="py-4 whitespace-nowrap w-full">
                                    <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any registered client</span>
                                    </div> : <></>
                            }
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <div className="flex justify-content-center align-items-center mb-1">
                                <p className="text-black">
                                    Showing { employers.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { employers.length > 0 ? (((pageNumber * limit) - limit) + 1) + (employers.length - 1) : 0 } of { totalEmployers } entries
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
                                    (pageNumber * limit) < totalEmployers && <a
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