import { ArrowDown, ArrowUp, BadgeDollarSign, Calendar, ChevronRight, FolderOpenDot, PenLine, ReceiptText, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const packageData = [
  {
    packageName: "Premium Employer Plan",
    type: "Subscription",
    description: "Up to 20 job posts, featured listings, and analytics dashboard.",
    price: "USD 1200",
    duration: "Quarterly",
    activeClients: 12,
    status: "Active",
    createdBy: "Admin John"
  },
  {
    packageName: "Basic Starter",
    type: "Subscription",
    description: "3 job posts per month and access to candidate search.",
    price: "USD 25",
    duration: "Monthly",
    activeClients: 47,
    status: "Active",
    createdBy: "Admin Grace"
  },
  {
    packageName: "Corporate Contract - NovaTech",
    type: "Custom Contract",
    description: "Dedicated recruitment support and screening services.",
    price: "USD 9500",
    duration: "Yearly",
    startDate: "2025-01-10",
    endDate: "2025-12-31",
    status: "Ongoing",
    createdBy: "Admin Louis"
  },
  {
    packageName: "Executive Recruit Pro",
    type: "Subscription",
    description: "Unlimited job posts, priority candidate access, and analytics.",
    price: "USD 3000",
    duration: "Quarterly",
    activeClients: 9,
    status: "Active",
    createdBy: "Admin Mary"
  },
  {
    packageName: "Job Posting Boost",
    type: "One-Time Service",
    description: "Feature your job listing at the top of the search results.",
    price: "USD 10",
    duration: "One-Time",
    activeClients: 25,
    status: "Active",
    createdBy: "Admin Steve"
  },
  {
    packageName: "SME Recruit Pack",
    type: "Subscription",
    description: "Affordable plan for small businesses with 5 job slots.",
    price: "USD 15",
    duration: "Monthly",
    activeClients: 33,
    status: "Pending",
    createdBy: "Admin Grace"
  },
  {
    packageName: "Enterprise Contract - Zenith Holdings",
    type: "Custom Contract",
    description: "Dedicated account manager, 50 hires, and screening tools.",
    price: "USD 12000",
    duration: "Yearly",
    startDate: "2025-02-01",
    endDate: "2026-02-01",
    status: "Ongoing",
    createdBy: "Admin Louis"
  },
  {
    packageName: "Candidate Verification Add-On",
    type: "One-Time Service",
    description: "Full background and identity verification per applicant.",
    price: "USD 50",
    duration: "Per Candidate",
    activeClients: 67,
    status: "Active",
    createdBy: "Admin Jane"
  },
  {
    packageName: "Startup Hiring Boost",
    type: "Subscription",
    description: "Special discounted plan for startups with up to 10 roles.",
    price: "USD 45",
    duration: "Quarterly",
    activeClients: 18,
    status: "Active",
    createdBy: "Admin Felix"
  },
  {
    packageName: "Talent Search Access",
    type: "Subscription",
    description: "Access to advanced candidate search tools and filters.",
    price: "USD 30",
    duration: "Monthly",
    activeClients: 28,
    status: "Expired",
    createdBy: "Admin Sarah"
  },
  {
    packageName: "Recruitment Outsource - BluePeak Ltd",
    type: "Custom Contract",
    description: "Full recruitment management and candidate evaluation service.",
    price: "USD 7800",
    duration: "6 Months",
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    status: "Ongoing",
    createdBy: "Admin Louis"
  },
  {
    packageName: "Enterprise Recruit Suite",
    type: "Subscription",
    description: "Corporate hiring tools with team collaboration features.",
    price: "USD 2500",
    duration: "Quarterly",
    activeClients: 10,
    status: "Closed",
    createdBy: "Admin John"
  },
  {
    packageName: "Professional Plan",
    type: "Subscription",
    description: "Ideal for agencies with mid-level hiring needs.",
    price: "USD 80",
    duration: "Monthly",
    activeClients: 20,
    status: "Active",
    createdBy: "Admin Mary"
  },
  {
    packageName: "Bulk Candidate Screening",
    type: "One-Time Service",
    description: "Comprehensive screening of up to 100 candidates.",
    price: "USD 1500",
    duration: "One-Time",
    activeClients: 4,
    status: "Completed",
    createdBy: "Admin Jane"
  },
  {
    packageName: "Corporate Retainer - Axis Bank",
    type: "Custom Contract",
    description: "Year-round candidate management for high-volume roles.",
    price: "USD 20000",
    duration: "Yearly",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "Ongoing",
    createdBy: "Admin Felix"
  }
]

export default function Packages() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Packages & Contracts</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active" aria-current="page">
                                    <NavLink to="/Packages">
                                        Packages & Contracts
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li>
                                    <NavLink to="/Dashboard">
                                        Dashboard
                                    </NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                        <div className="avatar avatar-xl bg-info-transparent text-info">
                            <ShieldCheck size={42}/>
                        </div>
                        <div className="card-content">
                            <span className="d-block fs-16 mb-5">Active Packages</span>
                            <h2 className="mb-5">12</h2>
                            <span className="text-info">
                            +5% <ArrowUp size={12} className="ri-arrow-up-line"/>
                            </span>
                            <span className="fs-12 text-muted ml-5">vs. last month</span>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-3 col-md-6">
                <div className="card">
                    <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-success-transparent text-success">
                        <ReceiptText size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Ongoing Contracts</span>
                        <h2 className="mb-5">42</h2>
                        <span className="text-success">
                        +5% <ArrowDown size={12} className="ri-arrow-up-line"/>
                        </span>
                        <span className="fs-12 text-muted ml-5">vs. last month</span>
                    </div>
                    </div>
                </div>
                </div>
                <div className="col-12 col-lg-3 col-md-6">
                <div className="card">
                    <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-warning-transparent text-warning">
                        <FolderOpenDot size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Total Package Revenue</span>
                        <h2 className="mb-5">$4.9k</h2>
                        <span className="text-warning">
                        +3 New
                        <ArrowUp size={12} className="ri-arrow-up-line"/>
                        </span>
                        <span className="fs-12 text-muted ml-5">this week</span>
                    </div>
                    </div>
                </div>
                </div>
                <div className="col-12 col-lg-3 col-md-6">
                <div className="card">
                    <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-danger-transparent text-danger">
                        <ShieldX size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Expired / Inactive</span>
                        <h2 className="mb-5">4</h2>
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
                            <h4 className="d-flex-items gap-10">Packages</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewTimeSheet">
                                    Add New Package
                                </button>
                                <a className="btn btn-success text-white" href="javascript:void(0);">Export As
                                    CSV</a>
                                <div className="">
                                    <select className="form-select sorting-dropdown">
                                        <option value="">Sort by</option>
                                        <option selected value="date_desc">Newest First</option>
                                        <option value="status">Attendance Status</option>
                                        <option value="checkin_desc">Latest Arrivals</option>
                                        <option value="hours_desc">Longest Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive">
                                <table className="table w-100 text-nowrap text-start" id="employeeAttendanceTable">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Duration</th>
                                            <th>Active Clients</th>
                                            <th>Start Date</th>
                                            <th>End Date / Renewal</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            packageData.map(data => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <h6><a href="#">{data.packageName}</a>
                                                                </h6>
                                                            </div>
                                                        </td>
                                                        <td>{data.type}</td>
                                                        <td>
                                                            <span className={`badge 
                                                                ${data.status === 'Active' ? 'bg-label-success' : ''}
                                                                ${data.status === 'Expired' ? 'bg-label-danger' : ''}
                                                                ${data.status === 'Pending' ? 'bg-label-warning' : ''}
                                                                ${data.status === 'Closed' ? 'bg-label-purple' : ''}
                                                                ${data.status === 'Ongoing' ? 'bg-label-info' : ''}
                                                                ${data.status === 'Completed' ? 'bg-label-pink' : ''}`}>
                                                                {data.status}
                                                            </span>
                                                        </td>
                                                        <td>{data.description}</td>
                                                        <td>{data.price}</td>
                                                        <td>{data.duration}</td>
                                                        <td>{data.activeClients}</td>
                                                        <td>{data.startDate}</td>
                                                        <td>{data.endDate}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editTimesheet">
                                                                    <a><PenLine /></a>
                                                                </button>
                                                                <button className="btn-icon btn-danger-light removeRow" type="button">
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
            
            <div className="modal fade" id="addNewTimeSheet" tabIndex={-1} aria-labelledby="addNewTimeSheetLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Package/Contract</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12 text-start">
                                    <label htmlFor="packageTitle" className="form-label">Package Title</label>
                                    <input type="text" className="form-control" id="packageTitle" placeholder="Package Title"/>
                                </div>
                                <div className="col-xl-6">
                                    <div>
                                        <label htmlFor="type" className="form-label">Type</label>
                                        <select className="form-select" id="type">
                                            <option value="">Select Type</option>
                                            <option value="Subscription">Subscription</option>
                                            <option value="Custom Contract">Custom Contract</option>
                                            <option value="Subscription">Subscription</option>
                                            <option value="One-Time Service">One-Time Service</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select className="form-select" id="status">
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Expired">Expired</option>
                                    </select>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="packagePrice" className="form-label">Price</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <BadgeDollarSign />
                                        </div>
                                        <input type="text" className="form-control flatpickr-input" id="packagePrice" placeholder="Add Package Price" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="duration" className="form-label">Duration</label>
                                    <select className="form-select" id="duration">
                                        <option value="">Select Duration</option>
                                        <option value="One-Time">One-Time</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="6 Months">6 Months</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="Per Candidate">Per Candidate</option>
                                    </select>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="startDate" className="form-label">Start Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <Calendar />
                                        </div>
                                        <input type="date" className="form-control flatpickr-input" id="startDate" placeholder="Add Start Date" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="endDate" className="form-label">End Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <Calendar />
                                        </div>
                                        <input type="date" className="form-control flatpickr-input" id="endDate" placeholder="Add End Date" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Package Description</label>
                                    <textarea className="form-control" rows={3} placeholder="Enter Package Description"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Package/Contract
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="modal fade" id="editTimesheet" tabIndex={-1} aria-labelledby="editTimesheetLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-16" id="editTimesheetLabel">Edit Package/Contract</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12 text-start">
                                    <label htmlFor="packageTitle" className="form-label">Package Title</label>
                                    <input type="text" className="form-control" id="packageTitle" placeholder="Package Title" value="Premium Employer Plan"/>
                                </div>
                                <div className="col-xl-6">
                                    <div>
                                        <label htmlFor="type" className="form-label">Type</label>
                                        <select className="form-select" id="type">
                                            <option value="">Select Type</option>
                                            <option value="Subscription" selected>Subscription</option>
                                            <option value="Custom Contract">Custom Contract</option>
                                            <option value="Subscription">Subscription</option>
                                            <option value="One-Time Service">One-Time Service</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select className="form-select" id="status">
                                        <option value="">Select Status</option>
                                        <option value="Active" selected>Active</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Expired">Expired</option>
                                    </select>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="packagePrice" className="form-label">Price</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <BadgeDollarSign />
                                        </div>
                                        <input type="text" className="form-control flatpickr-input" id="packagePrice" placeholder="Add Package Price" readOnly={true} value="1200"/>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="duration" className="form-label">Duration</label>
                                    <select className="form-select" id="duration">
                                        <option value="">Select Duration</option>
                                        <option value="One-Time">One-Time</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly" selected>Quarterly</option>
                                        <option value="6 Months">6 Months</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="Per Candidate">Per Candidate</option>
                                    </select>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="startDate" className="form-label">Start Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <Calendar />
                                        </div>
                                        <input type="date" className="form-control flatpickr-input" id="startDate" placeholder="Add Start Date" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="endDate" className="form-label">End Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <Calendar />
                                        </div>
                                        <input type="date" className="form-control flatpickr-input" id="endDate" placeholder="Add End Date" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Package Description</label>
                                    <textarea className="form-control" rows={3} placeholder="Enter Package Description" value="Up to 20 job posts, featured listings, and analytics dashboard."></textarea>
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
    );
}