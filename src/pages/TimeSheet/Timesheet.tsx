import { Calendar, ChevronRight, PenLine, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import female from "../../assets/images/avatar/avatar-thumb-010.webp";
import male from "../../assets/images/avatar/avatar-thumb-007.webp";

const timedata = [
    {
        image: female,
        employee: "Linda Chow",
        hours: "7.5",
        company: "Nordic Shipping AS"
    },
    {
        image: male,
        employee: "David Okoro",
        hours: "8",
        company: "Greenfield Agro Ltd."
    },
    {
        image: female,
        employee: "Jessica Wang",
        hours: "6.5",
        company: "Skyline Technologies"
    },
    {
        image: male,
        employee: "Emeka Adedeji",
        hours: "9",
        company: "Blue Horizon Logistics"
    },
    {
        image: female,
        employee: "Fatima Bello",
        hours: "7",
        company: "Harmony Healthcare Services"
    },
    {
        image: male,
        employee: "Ryan Patel",
        hours: "8.5",
        company: "Acme Corporation"
    },
    {
        image: male,
        employee: "Oluwaseun Adebayo",
        hours: "7.25",
        company: "Lagos Tech Hub"
    },
    {
        image: female,
        employee: "Chidinma Nwosu",
        hours: "8",
        company: "Sunshine International School"
    },
    {
        image: male,
        employee: "Mohammed Hassan",
        hours: "6.75",
        company: "One Health Solutions Inc."
    },
    {
        image: female,
        employee: "Victoria Adams",
        hours: "7.5",
        company: "Stellar Legal Partners"
    },
    {
        image: male,
        employee: "Samuel Johnson",
        hours: "9.5",
        company: "Quantum Engineering Group"
    },
    {
        image: female,
        employee: "Ngozi Eze",
        hours: "8",
        company: "PrimeCare Home Services"
    },
    {
        image: male,
        employee: "Peter Mensah",
        hours: "7",
        company: "Nordic Shipping AS"
    },
    {
        image: female,
        employee: "Isabella Rossi",
        hours: "6.5",
        company: "TechNova Solutions"
    },
    {
        image: female,
        employee: "Adeola Ogunleye",
        hours: "8",
        company: "Evergreen Consulting Ltd."
    },
    {
        image: male,
        employee: "Chuka Eneh",
        hours: "7.75",
        company: "WestBridge Construction"
    }
]

const today = new Date().toDateString()

export default function TimeSheet() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Timesheet & Payslip</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/Timesheet">
                                        Timesheet & Payslip
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

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="d-flex-items gap-10">{today} Timesheet</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewTimeSheet">
                                    Add New Timesheet
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
                                            <th>Employee</th>
                                            <th>Date</th>
                                            <th>Hours</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            timedata.map(data => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <div className="avatar radius-100">
                                                                    <img src={data.image} alt="#" className="radius-100"/>
                                                                </div>
                                                                <div>
                                                                    <h6><a href="#">{data.employee}</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{today}</td>
                                                        <td>{data.hours}</td>
                                                        <td>{data.company}</td>
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
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Timesheet</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label htmlFor="timesheetEmployee" className="form-label">Employee</label>
                                    <select className="employeeList form-control">
                                        <option value="p-1">John Doe</option>
                                        <option value="p-2">Jane Smith</option>
                                        <option value="p-3">Sarah Johnson</option>
                                        <option value="p-4">Michael Brown</option>
                                        <option value="p-5">Emily Davis</option>
                                        <option value="p-6">Robert Wilson</option>
                                    </select>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="timesheetDate" className="form-label">Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <Calendar />
                                        </div>
                                        <input type="text" className="form-control flatpickr-input" id="timesheetDate" placeholder="Select work date" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="startTime" className="form-label">Hours Worked</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="startTime" placeholder="Enter hours (e.g. 7.5)" step="0.25" min="0" max="24"/>
                                        <div className="input-group-text">hours</div>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Work Description</label>
                                    <textarea className="form-control" rows={3} placeholder="Enter task details (e.g. 'Project A development', 'Client meeting')"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Timesheet Entry
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
                            <h1 className="modal-title fs-16" id="editTimesheetLabel">Edit Timesheet</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label htmlFor="timesheetEmployee" className="form-label">Employee</label>
                                    <select className="employeeList form-control" id="timesheetEmployee">
                                        <option value="p-1">John Doe</option>
                                        <option value="p-2">Jane Smith</option>
                                        <option value="p-3">Sarah Johnson</option>
                                        <option value="p-4">Michael Brown</option>
                                        <option value="p-5">Emily Davis</option>
                                        <option value="p-6">Robert Wilson</option>
                                    </select>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleDate" className="form-label">Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <Calendar />
                                        </div>
                                        <input type="text" className="form-control flatpickr-input" id="scheduleDate" value="2023-05-06" readOnly={true}/>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="startTimeTwo" className="form-label">Hours Worked</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="startTimeTwo" value="4" step="0.25" min="0" max="24"/>
                                        <div className="input-group-text">hours</div>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Work Description</label>
                                    <textarea className="form-control" rows={3}>Weekend emergency support</textarea>
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