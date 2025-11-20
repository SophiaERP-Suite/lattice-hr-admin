import { ChevronRight, PenLine, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const currencyData = [
    {
        currency: "Naira",
        currencyCode: "NGN",
        currencySymbol: "₦",
        country: "Nigeria",
        dateAdded: "August 25, 2025"
    },
    {
        currency: "US Dollar",
        currencyCode: "USD",
        currencySymbol: "$",
        country: "United States",
        dateAdded: "September 1, 2025"
    },
    {
        currency: "Euro",
        currencyCode: "EUR",
        currencySymbol: "€",
        country: "Germany",
        dateAdded: "July 18, 2025"
    },
    {
        currency: "Pound Sterling",
        currencyCode: "GBP",
        currencySymbol: "£",
        country: "United Kingdom",
        dateAdded: "June 4, 2025"
    },
    {
        currency: "Cedi",
        currencyCode: "GHS",
        currencySymbol: "₵",
        country: "Ghana",
        dateAdded: "October 9, 2025"
    },
    {
        currency: "Rand",
        currencyCode: "ZAR",
        currencySymbol: "R",
        country: "South Africa",
        dateAdded: "May 27, 2025"
    },
    {
        currency: "Shilling",
        currencyCode: "KES",
        currencySymbol: "KSh",
        country: "Kenya",
        dateAdded: "February 14, 2025"
    },
    {
        currency: "Yen",
        currencyCode: "JPY",
        currencySymbol: "¥",
        country: "Japan",
        dateAdded: "March 3, 2025"
    },
    {
        currency: "Rupee",
        currencyCode: "INR",
        currencySymbol: "₹",
        country: "India",
        dateAdded: "April 22, 2025"
    },
    {
        currency: "Franc",
        currencyCode: "XOF",
        currencySymbol: "CFA",
        country: "Ivory Coast",
        dateAdded: "August 12, 2025"
    },
    {
        currency: "Dirham",
        currencyCode: "AED",
        currencySymbol: "د.إ",
        country: "United Arab Emirates",
        dateAdded: "January 30, 2025"
    }
]

export default function CurrencyMgt() {
    return <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Currency Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/CurrencyMgt">
                                    Currency Management
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
                        <h4 className="d-flex-items gap-10">Currencies<span className="badge bg-label-primary">11</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
                                New Currency
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
                                        <th scope="col">Currency</th>
                                        <th scope="col">Currency Code</th>
                                        <th scope="col">Currency Symbol</th>
                                        <th scope="col">Country</th>
                                        <th scope="col">Date Added</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currencyData.map(data => {
                                            return (
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.currency }</h6>
                                                        </div>
                                                    </td>
                                                    <td>{ data.currencyCode }</td>
                                                    <td>{ data.currencySymbol }</td>
                                                    <td>{ data.country }</td>
                                                    <td>{ data.dateAdded }</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
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
                        <h1 className="modal-title fs-16" id="addNewCompaniesLabel">Add New Currency</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Currency Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Currency Full Name"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Country</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Country</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="United States">United States</option>
                                        <option value="Germany">Germany</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Japan">Japan</option>
                                        <option value="India">India</option>
                                        <option value="Ivory Coast">Ivory Coast</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Currency Code</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Currency Code"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Currency Symbol</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Currency Symbol"/>
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

        <div className="modal fade" id="editCompanies" aria-labelledby="editCompaniesLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-16" id="editCompaniesLabel">Edit Currency</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row gy-15">
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Currency Name</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Currency Full Name" value="Naira"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <div>
                                    <label htmlFor="industry_type-field" className="form-label">Country</label>
                                    <select className="form-select" id="industry_type-field">
                                        <option value="">Select Country</option>
                                        <option selected value="Nigeria">Nigeria</option>
                                        <option value="United States">United States</option>
                                        <option value="Germany">Germany</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Japan">Japan</option>
                                        <option value="India">India</option>
                                        <option value="Ivory Coast">Ivory Coast</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Currency Code</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Currency Code" value="NGN"/>
                            </div>
                            <div className="col-xl-6 text-start">
                                <label htmlFor="fullName" className="form-label">Currency Symbol</label>
                                <input type="text" className="form-control" id="fullName" placeholder="Currency Symbol" value="₦"/>
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