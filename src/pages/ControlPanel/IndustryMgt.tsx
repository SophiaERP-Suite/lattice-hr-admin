import {
    BriefcaseBusiness,
    Camera,
    ChevronRight,
    Eye,
    Factory,
    PenLine,
    Trash2
} from "lucide-react";
import { NavLink } from "react-router-dom";
import company from "../../assets/images/company.png";
import avatar from "../../assets/images/company/company-thumb-008.png";

const industryData = [
    {
        industry: "Manufacturing",
        totalClients: 2,
        totalEmployees: 15,
        dateAdded: "August 25, 2025"
    },
    {
        industry: "Healthcare",
        totalClients: 5,
        totalEmployees: 42,
        dateAdded: "September 3, 2025"
    },
    {
        industry: "Finance",
        totalClients: 3,
        totalEmployees: 28,
        dateAdded: "July 19, 2025"
    },
    {
        industry: "Education",
        totalClients: 4,
        totalEmployees: 33,
        dateAdded: "June 11, 2025"
    },
    {
        industry: "Retail",
        totalClients: 6,
        totalEmployees: 54,
        dateAdded: "May 27, 2025"
    },
    {
        industry: "Logistics",
        totalClients: 2,
        totalEmployees: 18,
        dateAdded: "October 2, 2025"
    },
    {
        industry: "Hospitality",
        totalClients: 1,
        totalEmployees: 22,
        dateAdded: "March 14, 2025"
    },
    {
        industry: "Real Estate",
        totalClients: 3,
        totalEmployees: 31,
        dateAdded: "January 9, 2025"
    },
    {
        industry: "Agriculture",
        totalClients: 2,
        totalEmployees: 16,
        dateAdded: "February 21, 2025"
    },
    {
        industry: "IT Services",
        totalClients: 7,
        totalEmployees: 67,
        dateAdded: "April 5, 2025"
    },
    {
        industry: "Telecommunications",
        totalClients: 4,
        totalEmployees: 49,
        dateAdded: "December 12, 2025"
    }
]

export default function IndustryMgt() {
    return <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Industry Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/IndustryMgt">
                                    Industry Management
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
                        <h4 className="d-flex-items gap-10">Industries<span className="badge bg-label-primary">11</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
                                New Industry
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
                                        <th scope="col">Industry</th>
                                        <th scope="col">Total Clients</th>
                                        <th scope="col">Total Employees</th>
                                        <th scope="col">Date Added</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        industryData.map(data => {
                                            return (
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src={company} alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.industry }</h6>
                                                        </div>
                                                    </td>
                                                    <td>{ data.totalClients }</td>
                                                    <td>{ data.totalEmployees }</td>
                                                    <td>{ data.dateAdded }</td>
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
                        <h1 className="modal-title fs-16" id="addNewCompaniesLabel">Add New Industry</h1>
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
                                    <span className="d-block fw-5 text-black">Industry Image</span>
                                </div>
                            </div>

                            <div className="col-xl-12 text-start">
                                <label htmlFor="fullName" className="form-label">Industry Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Industry Full Name"/>
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
                        <h1 className="modal-title fs-16" id="viewCompaniesLabel">View Industry Info</h1>
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
                                        <h4 className="">Manufacturing</h4>
                                    </div>
                                    <div className="contact-by d-flex-center gap-15 mb-15">
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-success-light fs-16">
                                            <Factory />
                                        </a>
                                        <a href="javascript:void(0);" className="btn-icon btn-sm btn-info-light fs-16">
                                            <BriefcaseBusiness />
                                        </a>
                                    </div>
                                    <div className="information">
                                        <div className="table-responsive">
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Total Clients</th>
                                                        <td>2</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Total Employees</th>
                                                        <td>15</td>
                                                    </tr>
                                                    <tr className="text-start">
                                                        <th className="fw-6" scope="row">Date Added</th>
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
                        <h1 className="modal-title fs-16" id="editCompaniesLabel">Edit Industry</h1>
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
                                    <span className="d-block fw-5 text-muted">Industry Logo</span>
                                </div>
                            </div>
                            <div className="col-xl-12 text-start">
                                <label htmlFor="fullName2" className="form-label">Industry Name</label>
                                <input type="text" className="form-control" id="fullName2" value="Acme Corporation"/>
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