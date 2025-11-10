import { AlarmCheckIcon, ArrowUp, BadgeDollarSign, BriefcaseBusiness, Camera, ChevronRight, CirclePlus, Eye, PencilLine, Trash2, UserStar } from "lucide-react";
import { NavLink } from "react-router-dom";
import avatar from "../../assets/images/company/company-thumb-008.png";

const jobList = [
    {
        jobTitle: "Marketing Manager",
        company: "BrandVista",
        department: "Marketing",
        location: "New York, NY",
        jobType: "Full-time",
        applications: "92",
        vacancies: "2",
        posted: "Jun 10, 2025",
        closing: "Nov 10, 2025",
        status: "active"
    },
    {
        jobTitle: "Software Engineer",
        company: "TechNova Systems",
        department: "Engineering",
        location: "Lagos, Nigeria",
        jobType: "Full-time",
        applications: "120",
        vacancies: "3",
        posted: "May 25, 2025",
        closing: "Nov 30, 2025",
        status: "active"
    },
    {
        jobTitle: "Legal Associate",
        company: "Harper & Co. Attorneys",
        department: "Legal",
        location: "Abuja, Nigeria",
        jobType: "Contract",
        applications: "34",
        vacancies: "1",
        posted: "Apr 14, 2025",
        closing: "Oct 20, 2025",
        status: "on hold"
    },
    {
        jobTitle: "Product Designer",
        company: "Skyline Labs",
        department: "Design",
        location: "London, UK",
        jobType: "Remote",
        applications: "78",
        vacancies: "2",
        posted: "Jul 02, 2025",
        closing: "Dec 15, 2025",
        status: "active"
    },
    {
        jobTitle: "Customer Support Specialist",
        company: "Zenith Tech Solutions",
        department: "Customer Service",
        location: "Nairobi, Kenya",
        jobType: "Full-time",
        applications: "65",
        vacancies: "4",
        posted: "Jun 01, 2025",
        closing: "Nov 12, 2025",
        status: "active"
    },
    {
        jobTitle: "Finance Analyst",
        company: "BlueBridge Capital",
        department: "Finance",
        location: "Toronto, Canada",
        jobType: "Full-time",
        applications: "51",
        vacancies: "1",
        posted: "May 05, 2025",
        closing: "Oct 05, 2025",
        status: "closed"
    },
    {
        jobTitle: "Human Resource Intern",
        company: "NextGen Talent Hub",
        department: "HR",
        location: "Accra, Ghana",
        jobType: "Internship",
        applications: "90",
        vacancies: "3",
        posted: "Aug 01, 2025",
        closing: "Dec 01, 2025",
        status: "active"
    },
    {
        jobTitle: "Frontend Developer",
        company: "CodeBase Africa",
        department: "IT",
        location: "Lagos, Nigeria",
        jobType: "Remote",
        applications: "132",
        vacancies: "2",
        posted: "Jun 15, 2025",
        closing: "Nov 25, 2025",
        status: "active"
    },
    {
        jobTitle: "Project Manager",
        company: "UrbanBuild Construction",
        department: "Operations",
        location: "Johannesburg, South Africa",
        jobType: "Contract",
        applications: "47",
        vacancies: "1",
        posted: "Mar 12, 2025",
        closing: "Sep 20, 2025",
        status: "expired"
    },
    {
        jobTitle: "Research Assistant",
        company: "Global Health Initiative",
        department: "Research",
        location: "Ibadan, Nigeria",
        jobType: "Part-time",
        applications: "24",
        vacancies: "2",
        posted: "May 30, 2025",
        closing: "Oct 30, 2025",
        status: "pending"
    },
    {
        jobTitle: "Digital Marketer",
        company: "Vibe360 Media",
        department: "Marketing",
        location: "Port Harcourt, Nigeria",
        jobType: "Full-time",
        applications: "83",
        vacancies: "2",
        posted: "Jul 20, 2025",
        closing: "Dec 30, 2025",
        status: "active"
    },
    {
        jobTitle: "QA Tester",
        company: "BrightCode Labs",
        department: "Quality Assurance",
        location: "Berlin, Germany",
        jobType: "Remote",
        applications: "40",
        vacancies: "1",
        posted: "Feb 10, 2025",
        closing: "Aug 10, 2025",
        status: "closed"
    },
    {
        jobTitle: "Administrative Officer",
        company: "Royal Crown Schools",
        department: "Administration",
        location: "Enugu, Nigeria",
        jobType: "Full-time",
        applications: "55",
        vacancies: "1",
        posted: "Apr 08, 2025",
        closing: "Sep 30, 2025",
        status: "draft"
    },
    {
        jobTitle: "Electrical Engineer",
        company: "VoltEdge Energy Ltd",
        department: "Engineering",
        location: "Abuja, Nigeria",
        jobType: "Full-time",
        applications: "72",
        vacancies: "2",
        posted: "Jun 10, 2025",
        closing: "Nov 10, 2025",
        status: "on hold"
    },
    {
        jobTitle: "Content Writer",
        company: "StoryCraft Studios",
        department: "Editorial",
        location: "Nairobi, Kenya",
        jobType: "Remote",
        applications: "105",
        vacancies: "2",
        posted: "Jul 01, 2025",
        closing: "Dec 01, 2025",
        status: "active"
    },
    {
        jobTitle: "Network Administrator",
        company: "DataNet Communications",
        department: "IT",
        location: "Accra, Ghana",
        jobType: "Full-time",
        applications: "38",
        vacancies: "1",
        posted: "May 18, 2025",
        closing: "Nov 05, 2025",
        status: "pending"
    }
]

export default function JobMgt() {
    return (
        <div className="container-fluid">
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

                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <BriefcaseBusiness size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Jobs</span>
                                <h2 className="mb-5">1,845</h2>
                                <span className="text-success">+10.3% <ArrowUp size={12} className="ml-5 d-inline-block"/></span>
                                <span className="fs-12 text-muted ml-5">vs Last Month</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-success-transparent text-success">
                                <CirclePlus size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">New Jobs</span>
                                <h2 className="mb-5">256</h2>
                                <span className="text-success">+5.7% <ArrowUp size={12} className="ml-5 d-inline-block"/></span>
                                <span className="fs-12 text-muted ml-5">This Week</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                <UserStar size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Applications</span>
                                <h2 className="mb-5">3,421</h2>
                                <span className="text-success">+18.2% <ArrowUp size={12} className="ml-5 d-inline-block"/></span>
                                <span className="fs-12 text-muted ml-5">Candidates</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-danger-transparent text-danger">
                                <AlarmCheckIcon size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Urgent Jobs</span>
                                <h2 className="mb-5">42</h2>
                                <span className="text-danger">+3.5%<ArrowUp size={12} className="ml-5 d-inline-block"/></span>
                                <span className="fs-12 text-muted ml-5">Urgent Hire</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="d-flex-items gap-10">Job List</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewJob">
                                    Add New Job
                                </button>
                                <a className="btn btn-success text-white" href="javascript:void(0);">Export As
                                    CSV</a>
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
                                <table id="dataTableDefault" className="table text-nowrap w-100 text-start">
                                    <thead>
                                        <tr>
                                            <th className="ps-4">
                                                <input className="form-check-input" type="checkbox" id="selectAllJobs" aria-label="Select all jobs"/>
                                            </th>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Department</th>
                                            <th>Location</th>
                                            <th>Job Type</th>
                                            <th>Applications</th>
                                            <th>Vacancies</th>
                                            <th>Posted Date</th>
                                            <th>Deadline</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            jobList.map(data => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <input className="form-check-input" type="checkbox" id="job-001"/>
                                                        </td>
                                                        <td>
                                                            <a href="apps-job-details.html" className="text-heading fw-semibold">{ data.jobTitle }</a>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex-items gap-5">
                                                                <a href="#">{ data.company }</a>
                                                            </div>
                                                        </td>
                                                        <td>{ data.department }</td>
                                                        <td>{ data.location }</td>
                                                        <td>
                                                            <span className={`badge 
                                                                ${data.jobType === 'Full-time' ? 'bg-label-success' : ''}
                                                                ${data.jobType === 'Internship' ? 'bg-label-danger' : ''}
                                                                ${data.jobType === 'Remote' ? 'bg-label-warning' : ''}
                                                                ${data.jobType === 'Contract' ? 'bg-label-purple' : ''}
                                                                ${data.jobType === 'Part-time' ? 'bg-label-info' : ''}
                                                                ${data.jobType === 'Internship' ? 'bg-label-action' : ''}`}>
                                                                {data.jobType}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-medium">{ data.applications }</span>
                                                        </td>
                                                        <td>
                                                            <span className="fw-medium">{ data.vacancies }</span>
                                                        </td>
                                                        <td>{ data.posted }</td>
                                                        <td>
                                                            <span className="text-danger fw-medium">{ data.closing }</span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge 
                                                                ${data.status === 'active' ? 'bg-label-success' : ''}
                                                                ${data.status === 'expired' ? 'bg-label-danger' : ''}
                                                                ${data.status === 'pending' ? 'bg-label-warning' : ''}
                                                                ${data.status === 'closed' ? 'bg-label-purple' : ''}
                                                                ${data.status === 'draft' ? 'bg-label-info' : ''}
                                                                ${data.status === 'on hold' ? 'bg-label-pink' : ''}`}>
                                                                {data.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex-items gap-5">
                                                                <NavLink className="btn-icon btn-success-light" to="/JobMgt/JobDetails">
                                                                    <a><Eye /></a>
                                                                </NavLink>
                                                                <a className="btn-icon btn-info-light" href="javascript:void(0);">
                                                                    <a><PencilLine /></a>
                                                                </a>
                                                                <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                    <a><Trash2 /></a>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="modal fade" id="addNewJob" tabIndex={-1} aria-labelledby="addNewJobLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-16" id="addNewJobLabel">Add New Job</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row gy-15">
                                    <div className="col-xl-12">
                                        <div className="text-center">
                                            <div className="avatar avatar-xxl radius-100">
                                                <img src={avatar} alt="image not found" id="profileImage" className="radius-100"/>
                                                <span className="avatar-badge bg-primary">
                                                    <input type="file" name="photo"
                                                        className="p-absolute z-3 cursor-pointer w-100 h-100 op-0 pl-0 pr-0"
                                                        id="profileImageChange" />
                                                    <Camera className="p-relative z-1" size={15} />
                                                </span>
                                            </div>
                                            <span className="d-block fw-5 text-muted">Company Logo</span>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 text-start">
                                        <label htmlFor="jobTitle" className="form-label">Job Title</label>
                                        <input type="text" className="form-control" id="jobTitle" placeholder="Job Title"/>
                                    </div>
                                    <div className="col-xl-6 text-start">
                                        <label htmlFor="companyName" className="form-label">Company Name</label>
                                        <input type="text" className="form-control" id="companyName" placeholder="Company Name"/>
                                    </div>
                                    <div className="col-xl-6 text-start">
                                        <div>
                                            <label htmlFor="department" className="form-label">Department</label>
                                            <select className="form-select" id="department">
                                                <option value="">Select Department</option>
                                                <option value="Product Design">Product Design</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Analytics">Analytics</option>
                                                <option value="Product">Product</option>
                                                <option value="Human Resources">Human Resources</option>
                                                <option value="Analytics">Analytics</option>
                                                <option value="Sales">Sales</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 text-start">
                                        <label htmlFor="location" className="form-label">Location</label>
                                        <input type="text" className="form-control" id="location" placeholder="Location"/>
                                    </div>
                                    <div className="col-xl-6 text-start">
                                        <div>
                                            <label htmlFor="type" className="form-label">Job Type</label>
                                            <select className="form-select" id="type">
                                                <option value="Full Time">Full Time</option>
                                                <option value="Part Time">Part Time</option>
                                                <option value="Remote">Remote</option>
                                                <option value="Contract">Contract</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 text-start">
                                        <label htmlFor="Experience" className="form-label">Experience</label>
                                        <input type="text" className="form-control" id="Experience" placeholder="Experience"/>
                                    </div>

                                    <div className="col-xl-6 text-start">
                                        <label className="form-label">Salary</label>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-text text-muted"><BadgeDollarSign size={20} /></div>
                                                <input type="text" className="form-control" placeholder="Salary"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-12 text-start">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea className="form-control" id="description" rows={2} placeholder="Description"></textarea>
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
        </div>
    )
}