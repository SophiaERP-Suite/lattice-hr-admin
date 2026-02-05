import {
    ArrowUp,
    Briefcase,
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
import avatar from "../../assets/images/company/company-thumb-008.png";
import male from "../../assets/images/avatar/avatar-thumb-007.webp";
import female from "../../assets/images/avatar/avatar-thumb-010.webp";

const CandidateData = [
    {
        image: female,
        name: "Sophia Chen",
        email: "sophia.c@gmail.com",
        phone: "(555) 123-4567",
        company: "Skyline Technologies",
        designation: "UX Researcher",
        location: "New York, USA",
        joinDate: "2023-02-28",
        status: "Active"
    },
    {
        image: male,
        name: "David Okafor",
        email: "david.okafor@acme-corporation.com",
        phone: "+2348092234456",
        company: "Acme Corporation",
        designation: "Mechanical Engineer",
        location: "Lagos, Nigeria",
        joinDate: "2022-06-15",
        status: "Active"
    },
    {
        image: female,
        name: "Jennifer Lee",
        email: "jlee@skyline-tech.com",
        phone: "(555) 876-1122",
        company: "Skyline Technologies",
        designation: "Frontend Developer",
        location: "Austin, USA",
        joinDate: "2023-01-09",
        status: "Remote"
    },
    {
        image: male,
        name: "Ibrahim Sani",
        email: "ibrahim.sani@greenleafhealth.org",
        phone: "+2347039842221",
        company: "Greenleaf Health Services",
        designation: "Care Nurse",
        location: "Abuja, Nigeria",
        joinDate: "2021-10-01",
        status: "Active"
    },
    {
        image: female,
        name: "Maria Rodriguez",
        email: "maria.rodriguez@innovatek.com",
        phone: "(555) 342-9876",
        company: "Innovatek Solutions",
        designation: "Software QA Analyst",
        location: "Toronto, Canada",
        joinDate: "2023-03-12",
        status: "Part Time"
    },
    {
        image: male,
        name: "Emeka Uche",
        email: "emeka.uche@bluewaveconsulting.com",
        phone: "+2348089982310",
        company: "BlueWave Consulting",
        designation: "Business Analyst",
        location: "Port Harcourt, Nigeria",
        joinDate: "2020-07-19",
        status: "On Leave"
    },
    {
        image: female,
        name: "Grace Johnson",
        email: "grace.johnson@oceaniccare.org",
        phone: "(555) 231-5542",
        company: "Oceanic Care Homes",
        designation: "Head Nurse",
        location: "Liverpool, UK",
        joinDate: "2019-12-10",
        status: "Active"
    },
    {
        image: female,
        name: "Tope Adewale",
        email: "tope.adewale@techhubglobal.io",
        phone: "+2347018892340",
        company: "TechHub Global",
        designation: "Backend Engineer",
        location: "Lagos, Nigeria",
        joinDate: "2022-11-05",
        status: "Remote"
    },
    {
        image: female,
        name: "Linda Park",
        email: "linda.park@harbor-legal.com",
        phone: "(555) 672-3321",
        company: "Harbor Legal Group",
        designation: "Legal Associate",
        location: "San Francisco, USA",
        joinDate: "2020-04-28",
        status: "Inactive"
    },
    {
        image: male,
        name: "Chuka Nnadi",
        email: "chuka.nnadi@acme-corporation.com",
        phone: "+2348120029903",
        company: "Acme Corporation",
        designation: "Procurement Officer",
        location: "Abuja, Nigeria",
        joinDate: "2021-02-11",
        status: "Active"
    },
    {
        image: female,
        name: "Fatima Bello",
        email: "fatima.bello@greenleafhealth.org",
        phone: "+2348096652334",
        company: "Greenleaf Health Services",
        designation: "Health Data Officer",
        location: "Kaduna, Nigeria",
        joinDate: "2023-07-18",
        status: "Part Time"
    },
    {
        image: male,
        name: "Nathan Smith",
        email: "nathan.smith@innovatek.com",
        phone: "(555) 998-2147",
        company: "Innovatek Solutions",
        designation: "UI Designer",
        location: "Boston, USA",
        joinDate: "2022-09-22",
        status: "Remote"
    },
    {
        image: female,
        name: "Aisha Sule",
        email: "aisha.sule@techhubglobal.io",
        phone: "+2347047734529",
        company: "TechHub Global",
        designation: "Data Analyst",
        location: "Abuja, Nigeria",
        joinDate: "2023-01-15",
        status: "Active"
    },
    {
        image: male,
        name: "Michael Brown",
        email: "michael.brown@bluewaveconsulting.com",
        phone: "(555) 713-6543",
        company: "BlueWave Consulting",
        designation: "Project Coordinator",
        location: "London, UK",
        joinDate: "2019-08-04",
        status: "On Leave"
    },
    {
        image: female,
        name: "Ngozi Eze",
        email: "ngozi.eze@oceaniccare.org",
        phone: "+2347086632910",
        company: "Oceanic Care Homes",
        designation: "Care Assistant",
        location: "Enugu, Nigeria",
        joinDate: "2021-09-30",
        status: "Active"
    },
    {
        image: male,
        name: "Henry Walker",
        email: "henry.walker@harbor-legal.com",
        phone: "(555) 239-8872",
        company: "Harbor Legal Group",
        designation: "Paralegal",
        location: "Chicago, USA",
        joinDate: "2023-05-09",
        status: "Inactive"
    },
    {
        image: female,
        name: "Esther Agbaje",
        email: "esther.agbaje@skyline-tech.com",
        phone: "+2348029876612",
        company: "Skyline Technologies",
        designation: "Product Manager",
        location: "Lagos, Nigeria",
        joinDate: "2022-10-30",
        status: "Active"
    },
    {
        image: male,
        name: "Samuel Odu",
        email: "samuel.odu@acme-corporation.com",
        phone: "+2347035590043",
        company: "Acme Corporation",
        designation: "Quality Control Engineer",
        location: "Ibadan, Nigeria",
        joinDate: "2021-03-17",
        status: "Part Time"
    },
    {
        image: female,
        name: "Clara Lim",
        email: "clara.lim@innovatek.com",
        phone: "(555) 998-7761",
        company: "Innovatek Solutions",
        designation: "Cloud Engineer",
        location: "Singapore",
        joinDate: "2023-09-01",
        status: "Remote"
    },
    {
        image: male,
        name: "Victor James",
        email: "victor.james@techhubglobal.io",
        phone: "+2348012234578",
        company: "TechHub Global",
        designation: "DevOps Specialist",
        location: "Abuja, Nigeria",
        joinDate: "2020-11-11",
        status: "Active"
    },
    {
        image: female,
        name: "Ruth Onyeka",
        email: "ruth.onyeka@greenleafhealth.org",
        phone: "+2348104321998",
        company: "Greenleaf Health Services",
        designation: "Administrative Officer",
        location: "Benin City, Nigeria",
        joinDate: "2023-04-03",
        status: "On Leave"
    }
]

export default function CandidatesMgt() {
    return <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Candidate Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/CandidateMgt">
                                    Candidate Management
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
                        <span className="d-block fs-16 mb-5">Total Candidates</span>
                        <h2 className="mb-5">1,282</h2>
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
                    <div className="avatar avatar-xl bg-success-transparent text-success">
                    <FolderOpenDot size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Active Candidates</span>
                        <h2 className="mb-5">93.8%</h2>
                        <span className="text-success">
                            +2% <ArrowUp size={12} className="ri-arrow-up-line"/>
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
                    <Gauge size={42}/>
                    </div>
                    <div className="card-content">
                    <span className="d-block fs-16 mb-5">Candidates on Leave</span>
                    <h2 className="mb-5">10</h2>
                    <span className="fs-12 text-muted">Sick/Annual Leave</span>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header justify-between">
                        <h4 className="d-flex-items gap-10">Candidates<span className="badge bg-label-primary">1,282</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
                                New Candidate
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
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Company</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Designation</th>
                                        <th scope="col">Join Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        CandidateData.map(data => {
                                            return (
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src={data.image} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.name }</h6>
                                                        </div>
                                                    </td>
                                                    <td><a href={`mailto:${data.email}`} className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">{ data.email }</a></td>
                                                    <td>{ data.phone }</td>
                                                    <td>{ data.company }</td>
                                                    <td>{data.location}</td>
                                                    <td>{ data.designation }</td>
                                                    <td>{ data.joinDate }</td>
                                                    <td>
                                                        <span className={`badge
                                                            ${data.status === 'Remote' ? 'bg-label-info' : ''}
                                                            ${data.status === 'Part Time' ? 'bg-label-purple' : ''}
                                                            ${data.status === 'Active' ? 'bg-label-success' : ''}
                                                            ${data.status === 'On Leave' ? 'bg-label-warning' : ''}
                                                            ${data.status === 'Inactive' ? 'bg-label-danger' : ''}
                                                            `}>
                                                            {data.status}
                                                        </span>
                                                    </td>
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
                        <h1 className="modal-title fs-16" id="addNewCompaniesLabel">Add New Candidate</h1>
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
                                    <span className="d-block fw-5 text-black">Candidate Image</span>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="First Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="employeeId" className="form-label">Employee ID</label>
                                <input type="text" className="form-control" id="employeeId" placeholder="Employee ID"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="targetDateTime" className="form-label">Joining Date</label>
                                <input type="date" className="form-control" id="targetDateTime" placeholder="Choose date and time"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="text" className="form-control" id="email" placeholder="Email"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="phoneNumber" className="form-label">Phone</label>
                                <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Company</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Company</option>
                                        <option value="Acme Corporation">Acme Corporation</option>
                                        <option value="Skyline Technologies">Skyline Technologies</option>
                                        <option value="Maplewood Engineering Ltd.">Maplewood Engineering Ltd.</option>
                                        <option value="Pacific Digital Media">Pacific Digital Media</option>
                                        <option value="Nova Robotics Inc.">Nova Robotics Inc.
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Designation</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Designation</option>
                                        <option value="Administrative Officer">Administrative Officer</option>
                                        <option value="Cloud Engineer">Cloud Engineer</option>
                                        <option value="UX Researcher">UX Researcher</option>
                                        <option value="Product Manager">Product Manager</option>
                                        <option value="Paralegal">Paralegal</option>
                                        <option value="Care Assistant">Care Assistant
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-12 text-start">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea className="form-control" id="address" rows={3} placeholder="Address" spellCheck="false"></textarea>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="accountholadeername" className="form-label">Account Holder
                                    Name</label>
                                <input type="text" className="form-control" id="accountholadeername" placeholder="Account Holder Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="accountnumber" className="form-label">Account Number</label>
                                <input type="text" className="form-control" id="accountnumber" placeholder="Account Number"/>
                            </div>

                            <div className="col-xl-6 text-start">
                                <label htmlFor="bankname" className="form-label">Bank Name</label>
                                <input type="text" className="form-control" id="bankname" placeholder="Bank Name"/>
                            </div>

                            <div className="col-xl-6 text-start">
                                <label htmlFor="branchname" className="form-label">Branch Name</label>
                                <input type="text" className="form-control" id="branchname" placeholder="Branch Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="routingNumber" className="form-label">Routing Number</label>
                                <input type="text" className="form-control" id="routingNumber" placeholder="Routing Number"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="swiftCode" className="form-label">SWIFT/BIC Code</label>
                                <input type="text" className="form-control" id="swiftCode" placeholder="SWIFT/BIC Code"/>
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
                        <h1 className="modal-title fs-16" id="viewCompaniesLabel">View Candidate</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-12">
                                <div className="text-center">
                                    <div className="name-info mb-15">
                                        <div className="avatar avatar-xxl radius-100 mb-15">
                                            <img src={female} alt="image not found" className="radius-100"/>
                                        </div>
                                        <h4 className="">Sophia Chen</h4>
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
                                                        <td><a href="mailto:sophia.c@gmail.com" className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">sophia.c@gmail.com</a></td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Phone No</th>
                                                        <td>(555) 123-4567</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Company</th>
                                                        <td>Skyline Technologies</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Location</th>
                                                        <td>New York, USA</td>
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
                            <div className="col-xl-6 text-start">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="First Name" value="Sophia"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name" value="Chen"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="employeeId" className="form-label">Employee ID</label>
                                <input type="text" className="form-control" id="employeeId" placeholder="Employee ID" value="EMP-2109"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="targetDateTime" className="form-label">Joining Date</label>
                                <input type="date" className="form-control" id="targetDateTime" placeholder="Choose date and time" value="2023-01-15"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="text" className="form-control" id="email" placeholder="Email" value="sophia.c@gmail.com"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="phoneNumber" className="form-label">Phone</label>
                                <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number" value="(555) 123-4567"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Company</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Company</option>
                                        <option value="Acme Corporation">Acme Corporation</option>
                                        <option value="Skyline Technologies" selected={true}>Skyline Technologies</option>
                                        <option value="Maplewood Engineering Ltd.">Maplewood Engineering Ltd.</option>
                                        <option value="Pacific Digital Media">Pacific Digital Media</option>
                                        <option value="Nova Robotics Inc.">Nova Robotics Inc.
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Designation</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Designation</option>
                                        <option value="Administrative Officer">Administrative Officer</option>
                                        <option value="Cloud Engineer">Cloud Engineer</option>
                                        <option value="UX Researcher" selected={true}>UX Researcher</option>
                                        <option value="Product Manager">Product Manager</option>
                                        <option value="Paralegal">Paralegal</option>
                                        <option value="Care Assistant">Care Assistant
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-12 text-start">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea className="form-control" id="address" rows={3} placeholder="Address" spellCheck="false">232, Alleyway Avenue, New York, USA</textarea>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="accountholadeername" className="form-label">Account Holder
                                    Name</label>
                                <input type="text" className="form-control" id="accountholadeername" placeholder="Account Holder Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="accountnumber" className="form-label">Account Number</label>
                                <input type="text" className="form-control" id="accountnumber" placeholder="Account Number" value="123 4567 890"/>
                            </div>

                            <div className="col-xl-6 text-start">
                                <label htmlFor="bankname" className="form-label">Bank Name</label>
                                <input type="text" className="form-control" id="bankname" placeholder="Bank Name" value="JPMorgan Chase"/>
                            </div>

                            <div className="col-xl-6 text-start">
                                <label htmlFor="branchname" className="form-label">Branch Name</label>
                                <input type="text" className="form-control" id="branchname" placeholder="Branch Name" value="New York, USA"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="routingNumber" className="form-label">Routing Number</label>
                                <input type="text" className="form-control" id="routingNumber" placeholder="Routing Number" value="121000248"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="swiftCode" className="form-label">SWIFT/BIC Code</label>
                                <input type="text" className="form-control" id="swiftCode" placeholder="SWIFT/BIC Code" value="CHASUS33"/>
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