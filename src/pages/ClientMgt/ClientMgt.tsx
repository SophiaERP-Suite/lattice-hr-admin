import {
    ArrowDown,
    ArrowUp,
    BookUser,
    Camera,
    ChevronRight,
    Eye,
    FolderOpenDot,
    Gauge,
    Mail,
    PenLine,
    Phone,
    PhoneOutgoing,
    Trash2
} from "lucide-react";
import { NavLink } from "react-router-dom";
import company from "../../assets/images/company.png";
import avatar from "../../assets/images/company/company-thumb-008.png";

const companyData = [
    {
        client: "Acme Corporation",
        email: "contact@acme-corporation.com",
        phone: "(555) 123-4567",
        industry: "Manufacturing",
        location: "New York, USA",
        jobsPosted: "20"
    },
    {
        client: "Skyline Technologies",
        email: "info@skylinetech.co.uk",
        phone: "+44 20 7946 5568",
        industry: "Information Technology",
        location: "London, United Kingdom",
        jobsPosted: "35"
    },
    {
        client: "Nordic Shipping AS",
        email: "support@nordicshipping.no",
        phone: "+47 22 118 904",
        industry: "Logistics & Transportation",
        location: "Oslo, Norway",
        jobsPosted: "12"
    },
    {
        client: "Zenith Health Group",
        email: "hr@zenithhealthgroup.com",
        phone: "+1 (312) 458-9902",
        industry: "Healthcare",
        location: "Chicago, USA",
        jobsPosted: "28"
    },
    {
        client: "Maplewood Engineering Ltd.",
        email: "info@maplewoodeng.ca",
        phone: "+1 (416) 879-3312",
        industry: "Engineering & Construction",
        location: "Toronto, Canada",
        jobsPosted: "18"
    },
    {
        client: "Pacific Digital Media",
        email: "hello@pacificdigitalmedia.com.au",
        phone: "+61 2 9188 2045",
        industry: "Media & Entertainment",
        location: "Sydney, Australia",
        jobsPosted: "25"
    },
    {
        client: "Aurelia Finance Partners",
        email: "contact@aureliafinance.eu",
        phone: "+49 30 8899 1234",
        industry: "Financial Services",
        location: "Berlin, Germany",
        jobsPosted: "14"
    },
    {
        client: "Kentech Energy Solutions",
        email: "info@kentechenergy.com.ng",
        phone: "+234 809 112 5634",
        industry: "Energy & Utilities",
        location: "Lagos, Nigeria",
        jobsPosted: "22"
    },
    {
        client: "BluePeak Consulting",
        email: "careers@bluepeakconsulting.in",
        phone: "+91 22 4098 7732",
        industry: "Business Consulting",
        location: "Mumbai, India",
        jobsPosted: "30"
    },
    {
        client: "Nova Robotics Inc.",
        email: "contact@novarobotics.co.jp",
        phone: "+81 3 3289 4412",
        industry: "Robotics & Automation",
        location: "Tokyo, Japan",
        jobsPosted: "16"
    },
    {
        client: "Terra Verde Foods",
        email: "sales@terraverdefoods.com.br",
        phone: "+55 11 3759 2901",
        industry: "Food & Agriculture",
        location: "São Paulo, Brazil",
        jobsPosted: "19"
    }
]

export default function ClientMgt() {
    return <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Client Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li>
                                <NavLink to="/Dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="mb-2">
                                <ChevronRight size={15} />
                            </li>
                            <li className="active" aria-current="page">
                                <NavLink to="/ClientMgt">
                                    Client Management
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
                        <h2 className="mb-5">82</h2>
                        <span className="text-success">
                            +5% <ArrowUp size={12} className="ri-arrow-up-line"/>
                        </span>
                        <span className="fs-12 text-muted ml-5">vs. last month</span>
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
                        <h2 className="mb-5">3.8%</h2>
                        <span className="text-warning">
                            -2% <ArrowDown size={12} className="ri-arrow-up-line"/>
                        </span>
                        <span className="fs-12 text-muted ml-5">vs. last month</span>
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
                    <h2 className="mb-5">20</h2>
                    <span className="text-danger">
                        +3 New
                        <ArrowUp size={12} className="ri-arrow-up-line"/>
                    </span>
                    <span className="fs-12 text-muted ml-5">this week</span>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header justify-between">
                        <h4 className="d-flex-items gap-10">Clients<span className="badge bg-label-primary">82</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
                                New Client
                            </button>
                            <a className="btn btn-success text-white" href="javascript:void(0);">Export As CSV</a>
                            <div className="dataTables-sorting-control ">
                                <select className="form-select sorting-dropdown">
                                    <option value="">Sort by:</option>
                                    <option value="1_asc">ID (Low to High)</option>
                                    <option value="1_desc">ID (High to Low)</option>
                                    <option value="2_asc">Name (A-Z)</option>
                                    <option value="2_desc">Name (Z-A)</option>
                                    <option value="5_asc">Company (A-Z)</option>
                                    <option value="5_desc">Company (Z-A)</option>
                                    <option value="8_asc">Status (Active First)</option>
                                    <option value="8_desc">Status (Inactive First)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="card-body pt-15">
                        <div className="table-responsive">
                            <table id="companiesDataTable" className="table text-nowrap text-start w-100">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="..."/>
                                        </th>
                                        <th scope="col">Client</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Industry</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Posted Jobs</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        companyData.map(data => {
                                            return (
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src={company} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.client }</h6>
                                                        </div>
                                                    </td>
                                                    <td><a href={`mailto:${data.email}`} className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">{ data.email }</a></td>
                                                    <td>{ data.phone }</td>
                                                    <td>{ data.industry }</td>
                                                    <td>{ data.location }</td>
                                                    <td>{ data.jobsPosted }</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <a><Eye /></a>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <a><PenLine /></a>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow fs-16" type="button">
                                                                <a><Trash2 /></a>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal fade" id="addNewCompanies" aria-labelledby="addNewCompaniesLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-16" id="addNewCompaniesLabel">Add New Companies</h1>
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
                                                id="profileImageChange" />
                                            <a><Camera className="p-relative z-1" size={15} /></a>
                                        </span>
                                    </div>
                                    <span className="d-block fw-5 text-black">Company Logo</span>
                                </div>
                            </div>

                            <div className="col-xl-12 text-start">
                                <label htmlFor="fullName" className="form-label">Company Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Company Full Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="text" className="form-control" id="email" placeholder="Email"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Industry Type</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select industry type</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Transportation">Transportation</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Energy">Energy
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input type="text" className="form-control" id="location" placeholder="Location"/>
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