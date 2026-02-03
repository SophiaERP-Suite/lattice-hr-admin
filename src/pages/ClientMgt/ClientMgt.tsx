import {
    BookUser,
    Camera,
    CheckCheck,
    ChevronRight,
    FolderOpenDot,
    FolderOutput,
    Gauge,
    Mail,
    Phone,
    PhoneOutgoing,
    Plus,
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import company from "../../assets/images/company.png";
import avatar from "../../assets/images/company/company-thumb-008.png";
import { useEffect, useState } from "react";
import { fetchAllEmployers } from "../../utils/EmployerRequests";
import { fetchJobSectors } from "../../utils/JobSetorRequests";
import { useForm, useWatch } from "react-hook-form";
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../../utils/LocationRequests";

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
  Email: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Position: string;
  Password: string;
  ConfirmPassword: string;
  Gender: string;
  DateOfBirth: string;
  EmployerLogo: string;
  ProfilePhoto: string;
  Terms: boolean;
  Declaration: boolean;
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
    const { setValue, control: regControl, register: empRegister } = useForm<EmployerRegister>()
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
          setCities(data.data);
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

    return <div className="container-fluid">
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
                            <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
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
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.businessName }</h6>
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
        <div className="modal fade" id="addNewCompanies" aria-labelledby="addNewCompaniesLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-16" id="addNewCompaniesLabel">Add New Client</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">

                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Business Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Business Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="logo" className="form-label">Business Logo</label>
                                <input type="file" className="form-control" id="logo" placeholder="Business Logo"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="jobSector" className="form-label">Job Sector</label>
                                    <select className="form-select" id="jobSector">
                                        <option value="">Select Job Sector</option>
                                        {
                                            jobSectors.map((data, index) => (
                                                <option key={index} value={data.jobSectorId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="companySize" className="form-label">Company Size</label>
                                    <select className="form-select" id="companySize">
                                        <option value="">Select Company Size</option>
                                        <option value="small">1 - 50 employees (Small)</option>
                                        <option value="medium">51 - 250 employees (Medium)</option>
                                        <option value="large">250+ employees (Large)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="regsitrationNo" className="form-label">Registration No</label>
                                <input type="text" className="form-control" id="regsitrationNo" placeholder="Regsitration No"/>
                            </div>
                            
                            <div className="col-xl-6 text-start">
                                <label htmlFor="website" className="form-label">Website</label>
                                <input type="text" className="form-control" id="website" placeholder="Website URL"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <select className="form-select" id="country"
                                        {
                                            ...empRegister('CountryId')
                                        }
                                    >
                                        <option value="">Select Country</option>
                                        {
                                            countries.map((data, index) => (
                                                <option key={index} value={data.countryId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="state" className="form-label">State</label>
                                    <select className="form-select" id="state" disabled={states.length === 0}
                                        {
                                            ...empRegister('StateId')
                                        }
                                    >
                                        <option value="">Select State</option>
                                        {
                                            states.map((data, index) => (
                                                <option key={index} value={data.stateId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="city" className="form-label">City</label>
                                    <select className="form-select" id="city" disabled={cities.length === 0}
                                        {
                                            ...empRegister('CityId')
                                        }
                                    >
                                        <option value="">Select City</option>
                                        {
                                            cities.map((data, index) => (
                                                <option key={index} value={data.cityId}>{ data.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="postcode" className="form-label">PostCode</label>
                                <input type="text" className="form-control" id="postcode" placeholder="PostCode"/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                            <X /> Cancel
                        </button>
                        <button type="button" className="btn btn-success">
                            <CheckCheck /> Add Client
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="viewCompanies" aria-labelledby="viewCompaniesLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-16" id="viewCompaniesLabel">View Companies</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-12">
                                <div className="text-center">
                                    <div className="name-info mb-15">
                                        <div className="avatar avatar-xxl radius-100 mb-15">
                                            <img src={company} alt="image not found" className="radius-100"/>
                                        </div>
                                        <h4 className="">Acme Corporation</h4>
                                    </div>
                                    <div className="contact-by d-flex-center gap-15 mb-15">
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-success-light fs-16">
                                            <Phone />
                                        </a>
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-warning-light fs-16">
                                            <Mail />
                                        </a>
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-info-light fs-16">
                                            <PhoneOutgoing />
                                        </a>
                                    </div>
                                    <div className="information">
                                        <div className="table-responsive">
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Email</th>
                                                        <td><a href="mailto:contact@acme-corporation.com" className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">contact@acme-corporation.com</a></td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Phone No</th>
                                                        <td>(555) 123-4567</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Industry</th>
                                                        <td>Manufacturing</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Location</th>
                                                        <td>New York, USA</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Jobs Posted</th>
                                                        <td>12</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary">Full Details</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="editCompanies" aria-labelledby="editCompaniesLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-16" id="editCompaniesLabel">Edit Companies</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-12">
                                <div className="text-center">
                                    <div className="avatar avatar-xxl radius-100">
                                        <img src={avatar} alt="image not found" id="profileImage" className="radius-100"/>
                                        <span className="badge rounded-pill bg-primary avatar-badge">
                                <input type="file" name="photo"
                                    className="p-absolute z-3 cursor-pointer w-100 h-100 op-0 pl-0 pr-0"
                                    id="profileImageChange"/>
                                    <a><Camera className="p-relative z-1" size={15} /></a>
                            </span>
                                    </div>
                                    <span className="d-block fw-5 text-muted">Company Logo</span>
                                </div>
                            </div>
                            <div className="col-xl-12 text-start">
                                <label htmlFor="fullName2" className="form-label">Company Name</label>
                                <input type="text" className="form-control" id="fullName2" value="Acme Corporation"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="phoneNumber2" className="form-label">Phone Number</label>
                                <input type="text" className="form-control" id="phoneNumber2" value="(555) 123-4567"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="email2" className="form-label">Email</label>
                                <input type="text" className="form-control" id="email2" value="contact@acme.com"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type" className="form-label">Industry Type</label>
                                    <select className="form-select" id="industry_type">
                                        <option selected value="Manufacturing">Manufacturing</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Energy">Energy
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="location2" className="form-label">Location</label>
                                <input type="text" className="form-control" id="location2" value="New York, USA"/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}