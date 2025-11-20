import {
    ChevronRight,
    Eye,
    Lock,
    PenLine,
    Trash2,
    UserLock
} from "lucide-react";
import { NavLink } from "react-router-dom";
import company from "../../assets/images/company.png";

const roleData = [
    {
        role: "Main Admin",
        totalUsers: 3,
        menuAccess: 9,
        dateCreated: "September 25, 2025"
    },
    {
        role: "Finance Admin",
        totalUsers: 2,
        menuAccess: 1,
        dateCreated: "September 30, 2025"
    },
    {
        role: "Jobs Admin",
        totalUsers: 7,
        menuAccess: 4,
        dateCreated: "September 30, 2025"
    },
]

export default function RoleMgt() {
    return <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Role Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/RoleMgt">
                                    Role Management
                                </NavLink>
                            </li>
                            <li className="mb-2">
                                <ChevronRight size={15} />
                            </li>
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel">
                                    Control Panel
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
                        <h4 className="d-flex-items gap-10">Roles<span className="badge bg-label-primary">3</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
                                New Role
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
                                        <th scope="col">Role</th>
                                        <th scope="col">Total Users</th>
                                        <th scope="col">Menu Access</th>
                                        <th scope="col">Date Created</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        roleData.map(data => {
                                            return (
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src={company} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.role }</h6>
                                                        </div>
                                                    </td>
                                                    <td><a href="#" className="text-start">{ data.totalUsers }</a></td>
                                                    <td>{ data.menuAccess }</td>
                                                    <td>{ data.dateCreated }</td>
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
                        <h1 className="modal-title fs-16" id="addNewCompaniesLabel">Add New Role</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-12 text-start">
                                <label htmlFor="fullName" className="form-label">Role Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Role Name"/>
                            </div>
                            <div className="col-xl-12 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Landing Menu</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Landing Menu</option>
                                        <option value="Dashboard">Dashboard</option>
                                        <option value="Client Management">Client Management</option>
                                        <option value="Workers Management">Workers Management</option>
                                        <option value="Timesheet Management">Timesheet Management</option>
                                        <option value="Jobs Management">Jobs Management</option>
                                        <option value="Packages & Contracts">Packages & Contracts</option>
                                        <option value="Finance Management">Finance Management</option>
                                        <option value="Complaints">Complaints</option>
                                        <option value="Control Panel">Control Panel</option>
                                    </select>
                                </div>
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
                        <h1 className="modal-title fs-16" id="viewCompaniesLabel">View Role</h1>
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
                                        <h4 className="">Main Admin</h4>
                                    </div>
                                    <div className="contact-by d-flex-center gap-15 mb-15">
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-success-light fs-16">
                                            <Lock />
                                        </a>
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-warning-light fs-16">
                                            <UserLock />
                                        </a>
                                    </div>
                                    <div className="information">
                                        <div className="table-responsive">
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Total Users</th>
                                                        <td>3</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Menu Access</th>
                                                        <td>9</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Date Created</th>
                                                        <td>September 25, 2025</td>
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
                        <h1 className="modal-title fs-16" id="editCompaniesLabel">Edit Role</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-12 text-start">
                                <label htmlFor="fullName2" className="form-label">Role Name</label>
                                <input type="text" className="form-control" id="fullName2" value="Acme Corporation"/>
                            </div>
                            <div className="col-xl-12 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Landing Menu</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Landing Menu</option>
                                        <option selected value="Dashboard">Dashboard</option>
                                        <option value="Client Management">Client Management</option>
                                        <option value="Workers Management">Workers Management</option>
                                        <option value="Timesheet Management">Timesheet Management</option>
                                        <option value="Jobs Management">Jobs Management</option>
                                        <option value="Packages & Contracts">Packages & Contracts</option>
                                        <option value="Finance Management">Finance Management</option>
                                        <option value="Complaints">Complaints</option>
                                        <option value="Control Panel">Control Panel</option>
                                    </select>
                                </div>
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