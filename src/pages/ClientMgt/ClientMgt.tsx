export default function ClientMgt() {
    return <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="page-title-box d-flex-between flex-wrap gap-15">
                                <h1 className="page-title fs-18 lh-1">Companies</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb breadcrumb-example1 mb-0">
                                        <li className="breadcrumb-item"><a href="javascript:void(0);">Home</a></li>
                                        <li className="breadcrumb-item"><a href="javascript:void(0);">CRM</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Companies</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-header justify-between">
                                    <h4 className="d-flex-items gap-10">Companies<span className="badge bg-label-primary">50</span></h4>
                                    <div className="d-flex flex-wrap gap-15">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewCompanies">
                                            Add Companies
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
                                        <table id="companiesDataTable" className="table text-nowrap w-100">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="..."/>
                                                    </th>
                                                    <th scope="col">Company Name</th>
                                                    <th scope="col">Owner</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Phone</th>
                                                    <th scope="col">Industry</th>
                                                    <th scope="col">Key Companies</th>
                                                    <th scope="col">Location</th>
                                                    <th scope="col">Total Deals</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-001.png" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">Acme
                                                                Corporation</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-001.webp" alt="image not found"/>
                                                            </div>
                                                            John Smith
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">[email&#160;protected]</a></td>
                                                    <td>(555) 123-4567</td>
                                                    <td>Manufacturing</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-015.webp" alt="image not found"/>
                                                            </div>
                                                            Sarah
                                                        </div>
                                                    </td>
                                                    <td>New York, USA</td>
                                                    <td>12</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-002.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                TechSolutions Inc</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-002.webp" alt="image not found"/>
                                                            </div>
                                                            Michael Brown
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="cea7a0a8a18ebaabada6bda1a2bbbaa7a1a0bde0ada1a3">[email&#160;protected]</a></td>
                                                    <td>(555) 234-5678</td>
                                                    <td>Information Technology</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-014.webp" alt="image not found"/>
                                                            </div>
                                                            David
                                                        </div>
                                                    </td>
                                                    <td>San Francisco, USA</td>
                                                    <td>8</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-003.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">Global
                                                                Logistics</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-003.webp" alt="image not found"/>
                                                            </div>
                                                            Emily Davis
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="61121411110e131521060d0e03000d0d0e060812150802124f020e0c">[email&#160;protected]</a></td>
                                                    <td>(555) 345-6789</td>
                                                    <td>Transportation</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-013.webp" alt="image not found"/>
                                                            </div>
                                                            Robert
                                                        </div>
                                                    </td>
                                                    <td>Chicago, USA</td>
                                                    <td>15</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-004.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                HealthCare Partners</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-004.webp" alt="image not found"/>
                                                            </div>
                                                            Thomas Anderson
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="0d6c696064634d65686c6179656e6c7f687d6c7f7963687f7e236e6260">[email&#160;protected]</a></td>
                                                    <td>(555) 456-7890</td>
                                                    <td>Healthcare</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-012.webp" alt="image not found"/>
                                                            </div>
                                                            Jennifer
                                                        </div>
                                                    </td>
                                                    <td>Boston, USA</td>
                                                    <td>6</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-005.png" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">Green
                                                                Energy Solutions</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-005.webp" alt="image not found"/>
                                                            </div>
                                                            Lisa Martinez
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="137a7d757c53746176767d767d7661746a3d707c7e">[email&#160;protected]</a></td>
                                                    <td>(555) 567-8901</td>
                                                    <td>Energy</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-011.webp" alt="image not found"/>
                                                            </div>
                                                            Clark
                                                        </div>
                                                    </td>
                                                    <td>Denver, USA</td>
                                                    <td>9</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-006.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                Financial Horizons</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-006.webp" alt="image not found"/>
                                                            </div>
                                                            Richard Williams
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="a5c6cacbd1c4c6d1e5c3cccbc4cbc6ccc4c9cdcad7ccdfcacbd68bc6cac8">[email&#160;protected]</a></td>
                                                    <td>(555) 678-9012</td>
                                                    <td>Financial Services</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-010.webp" alt="image not found"/>
                                                            </div>
                                                            Amanda
                                                        </div>
                                                    </td>
                                                    <td>London, UK</td>
                                                    <td>22</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-007.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                Creative
                                                                Designs</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-007.webp" alt="image not found"/>
                                                            </div>
                                                            Sophia Rodriguez
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="acc4c9c0c0c3eccfdec9cdd8c5dac9c8c9dfc5cbc2df82cfc3c1">[email&#160;protected]</a></td>
                                                    <td>(555) 789-0123</td>
                                                    <td>Marketing</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-009.webp" alt="image not found"/>
                                                            </div>
                                                            Kevin
                                                        </div>
                                                    </td>
                                                    <td>Los Angeles, USA</td>
                                                    <td>7</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-008.png" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                DataSystems Ltd</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-008.webp" alt="image not found"/>
                                                            </div>
                                                            Paul Thompson
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="4d3e2c21283e0d292c392c3e343e3928203e632e2220">[email&#160;protected]</a></td>
                                                    <td>(555) 890-1234</td>
                                                    <td>Data Analytics</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-016.html" alt="image not found"/>
                                                            </div>
                                                            Jessica
                                                        </div>
                                                    </td>
                                                    <td>Toronto, Canada</td>
                                                    <td>14</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-009.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">EduTech
                                                                Innovations</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-009.webp" alt="image not found"/>
                                                            </div>
                                                            Nancy Lewis
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="761f181019361312030213151e5815191b">[email&#160;protected]</a></td>
                                                    <td>(555) 901-2345</td>
                                                    <td>Education</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-008.webp" alt="image not found"/>
                                                            </div>
                                                            Walker
                                                        </div>
                                                    </td>
                                                    <td>Berlin, Germany</td>
                                                    <td>5</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-010.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">Retail
                                                                Masters</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-010.webp" alt="image not found"/>
                                                            </div>
                                                            George Allen
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="ff9c90918b9e9c8bbf8d9a8b9e9693929e8c8b9a8d8cd19c9092">[email&#160;protected]</a></td>
                                                    <td>(555) 012-3456</td>
                                                    <td>Retail</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-007.webp" alt="image not found"/>
                                                            </div>
                                                            Olivia
                                                        </div>
                                                    </td>
                                                    <td>Paris, France</td>
                                                    <td>18</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-011.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                AutoTech
                                                                Solutions</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-011.webp" alt="image not found"/>
                                                            </div>
                                                            Mark King
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="1e6d6b6e6e716c6a5e7f6b6a716a7b7d76307d7173">[email&#160;protected]</a></td>
                                                    <td>(555) 123-4560</td>
                                                    <td>Automotive</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-005.webp" alt="image not found"/>
                                                            </div>
                                                            Scott
                                                        </div>
                                                    </td>
                                                    <td>Detroit, USA</td>
                                                    <td>11</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-012.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                BioPharma Inc</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-012.webp" alt="image not found"/>
                                                            </div>
                                                            Patricia Green
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="b1d8dfd7def1d3d8dec1d9d0c3dcd09fd2dedc">[email&#160;protected]</a></td>
                                                    <td>(555) 234-5671</td>
                                                    <td>Pharmaceutical</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-004.webp" alt="image not found"/>
                                                            </div>
                                                            Steven
                                                        </div>
                                                    </td>
                                                    <td>Boston, USA</td>
                                                    <td>9</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-013.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                CloudNet
                                                                Services</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-013.webp" alt="image not found"/>
                                                            </div>
                                                            Jason Wright
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="e390828f8690a3808f8c96878d8697cd808c8e">[email&#160;protected]</a></td>
                                                    <td>(555) 345-6782</td>
                                                    <td>Cloud Computing</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-003.webp" alt="image not found"/>
                                                            </div>
                                                            Emma
                                                        </div>
                                                    </td>
                                                    <td>Seattle, USA</td>
                                                    <td>13</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-014.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                FoodDistrib Co</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-014.webp" alt="image not found"/>
                                                            </div>
                                                            Lisa Hall
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="c5a6aaabb1a4a6b185a3aaaaa1a1acb6b1b7aca7eba6aaa8">[email&#160;protected]</a></td>
                                                    <td>(555) 456-7893</td>
                                                    <td>Food Distribution</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-002.webp" alt="image not found"/>
                                                            </div>
                                                            Nelson
                                                        </div>
                                                    </td>
                                                    <td>Houston, USA</td>
                                                    <td>7</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><input className="form-check-input" type="checkbox" aria-label="Select company"/>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/company/company-thumb-015.html" alt="image not found"/>
                                                            </div>
                                                            <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                ConstructPro Ltd</h6>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-015.webp" alt="image not found"/>
                                                            </div>
                                                            Daniel Carter
                                                        </div>
                                                    </td>
                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="97fef9f1f8d7f4f8f9e4e3e5e2f4e3e7e5f8b9f4f8fa">[email&#160;protected]</a></td>
                                                    <td>(555) 567-8904</td>
                                                    <td>Construction</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-xs radius-100">
                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-001.webp" alt="image not found"/>
                                                            </div>
                                                            Megan
                                                        </div>
                                                    </td>
                                                    <td>Dallas, USA</td>
                                                    <td>16</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-success-light" type="button" data-bs-toggle="modal" data-bs-target="#viewCompanies">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editCompanies">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                <i className="ri-delete-bin-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
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
                                                    <img src="assets/images/avatar/avatar-thumb-dummy.html" alt="image not found" id="profileImage" className="radius-100"/>
                                                    <span className="badge rounded-pill bg-primary avatar-badge">
                                          <input type="file" name="photo"
                                             className="p-absolute z-3 cursor-pointer w-100 h-100 op-0 pl-0 pr-0"
                                             id="profileImageChange"/>
                                          <i className="ri-camera-line p-relative z-1"></i>
                                       </span>
                                                </div>
                                                <span className="d-block fw-5 text-muted">Company Logo</span>
                                            </div>
                                        </div>

                                        <div className="col-xl-12">
                                            <label htmlFor="fullName" className="form-label">Company Name</label>
                                            <input type="text" className="form-control" id="fullName" placeholder="Full Name"/>
                                        </div>
                                        <div className="col-xl-4">
                                            <div className="d-flex-items gap-15 mt-15">
                                                <div className="avatar avatar-md radius-100">
                                                    <img src="assets/images/avatar/avatar-thumb-dummy.html" alt="image not found" id="profileImageThree" className="radius-100"/>
                                                    <span className="rounded-pill bg-primary avatar-badge avatar-xs">
                                          <input type="file" name="photo"
                                             className="p-absolute cursor-pointer z-3 w-100 h-100 op-0 pl-0 pr-0 ri-camera-line"
                                             id="profileImageChangeThree"/>
                                          <i className="ri-camera-line p-relative z-1"></i>
                                       </span>
                                                </div>
                                                <span className="d-block fw-5 text-muted">Owner Thumb</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-8">
                                            <label htmlFor="ownerName" className="form-label">Owner Name</label>
                                            <input type="text" className="form-control" id="ownerName" placeholder="Owner Name"/>
                                        </div>
                                        <div className="col-xl-6">
                                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                            <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number"/>
                                        </div>
                                        <div className="col-xl-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="text" className="form-control" id="email" placeholder="Email"/>
                                        </div>
                                        <div className="col-xl-6">
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
                                        <div className="col-xl-6">
                                            <label htmlFor="location" className="form-label">Location</label>
                                            <input type="text" className="form-control" id="location" placeholder="Location"/>
                                        </div>
                                        <div className="col-xl-4">
                                            <div className="d-flex-items gap-15 mt-15">
                                                <div className="avatar avatar-md radius-100">
                                                    <img src="assets/images/avatar/avatar-thumb-dummy.html" alt="image not found" id="profileImageTwo" className="radius-100"/>
                                                    <span className="rounded-pill bg-primary avatar-badge avatar-xs">
                                          <input type="file" name="photo"
                                             className="p-absolute cursor-pointer z-3 w-100 h-100 op-0 pl-0 pr-0 ri-camera-line"
                                             id="profileImageChangeTwo"/>
                                          <i className="ri-camera-line p-relative z-1"></i>
                                       </span>
                                                </div>
                                                <span className="d-block fw-5 text-muted">Contact Thumb</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-8">
                                            <label htmlFor="ownerName2" className="form-label">Key Contact</label>
                                            <input type="text" className="form-control" id="ownerName2" placeholder="Owner Name"/>
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
                                                        <img src="assets/images/company/company-thumb-001.png" alt="image not found" className="radius-100"/>
                                                    </div>
                                                    <h4 className="">Acme Corporation</h4>
                                                </div>
                                                <div className="contact-by d-flex-center gap-15 mb-15">
                                                    <a href="javascript:void(0);" className="btn-icon btn-sm btn-success-light fs-16">
                                                        <i className="ri-phone-line"></i>
                                                    </a>

                                                    <a href="javascript:void(0);" className="btn-icon btn-sm btn-warning-light fs-16">
                                                        <i className="ri-mail-line"></i>

                                                    </a><a href="javascript:void(0);" className="btn-icon btn-sm btn-info-light fs-16">
                                                        <i className="ri-question-answer-line"></i>
                                                    </a>
                                                </div>
                                                <div className="information">
                                                    <div className="table-responsive">
                                                        <table className="table table-borderless mb-0">
                                                            <tbody>
                                                                <tr className="text-start">
                                                                    <th className="fw-6" scope="row">Owner Name</th>
                                                                    <td>
                                                                        <div className="d-flex-items gap-10">
                                                                            <div className="avatar avatar-xs radius-100">
                                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-001.webp" alt="image not found"/>
                                                                            </div>
                                                                            John Smith
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr className="text-start">
                                                                    <th className="fw-6" scope="row">Email</th>
                                                                    <td><a href="https://demo.topylo.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="72111d1c061311063213111f175c111d1f">[email&#160;protected]</a></td>
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
                                                                    <th className="fw-6" scope="row">Key Contact</th>
                                                                    <td>
                                                                        <div className="d-flex-items gap-10">
                                                                            <div className="avatar avatar-xs radius-100">
                                                                                <img className="radius-100" src="assets/images/avatar/avatar-thumb-001.webp" alt="image not found"/>
                                                                            </div>
                                                                            Sarah
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr className="text-start">
                                                                    <th className="fw-6" scope="row">Location</th>
                                                                    <td>New York, USA</td>
                                                                </tr>
                                                                <tr className="text-start">
                                                                    <th className="fw-6" scope="row">Total Deals</th>
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
                                    <button type="button" className="btn btn-primary">Save changes</button>
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
                                                    <img src="assets/images/company/company-thumb-001.png" alt="image not found" id="profileImage" className="radius-100"/>
                                                    <span className="badge rounded-pill bg-primary avatar-badge">
                                          <input type="file" name="photo"
                                             className="p-absolute z-3 cursor-pointer w-100 h-100 op-0 pl-0 pr-0"
                                             id="profileImageChange"/>
                                          <i className="ri-camera-line p-relative z-1"></i>
                                       </span>
                                                </div>
                                                <span className="d-block fw-5 text-muted">Company Logo</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-12">
                                            <label htmlFor="fullName2" className="form-label">Company Name</label>
                                            <input type="text" className="form-control" id="fullName2" value="Acme Corporation"/>
                                        </div>
                                        <div className="col-xl-4">
                                            <div className="d-flex-items gap-15 mt-15">
                                                <div className="avatar avatar-md radius-100">
                                                    <img src="assets/images/avatar/avatar-thumb-001.webp" alt="image not found" id="profileImageThree" className="radius-100"/>
                                                    <span className="rounded-pill bg-primary avatar-badge avatar-xs">
                                          <input type="file" name="photo"
                                             className="p-absolute cursor-pointer z-3 w-100 h-100 op-0 pl-0 pr-0 ri-camera-line"
                                             id="profileImageChangeThree"/>
                                          <i className="ri-camera-line p-relative z-1"></i>
                                       </span>
                                                </div>
                                                <span className="d-block fw-5 text-muted">Owner Thumb</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-8">
                                            <label htmlFor="ownerName2" className="form-label">Owner Name</label>
                                            <input type="text" className="form-control" id="ownerName2" value="John Smith"/>
                                        </div>
                                        <div className="col-xl-6">
                                            <label htmlFor="phoneNumber2" className="form-label">Phone Number</label>
                                            <input type="text" className="form-control" id="phoneNumber2" value="(555) 123-4567"/>
                                        </div>
                                        <div className="col-xl-6">
                                            <label htmlFor="email2" className="form-label">Email</label>
                                            <input type="text" className="form-control" id="email2" value="contact@acme.com"/>
                                        </div>
                                        <div className="col-xl-6">
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
                                        <div className="col-xl-6">
                                            <label htmlFor="location2" className="form-label">Location</label>
                                            <input type="text" className="form-control" id="location2" value="New York, USA"/>
                                        </div>
                                        <div className="col-xl-4">
                                            <div className="d-flex-items gap-15 mt-15">
                                                <div className="avatar avatar-md radius-100">
                                                    <img src="assets/images/avatar/avatar-thumb-002.webp" alt="image not found" id="profileImageTwo" className="radius-100"/>
                                                    <span className="rounded-pill bg-primary avatar-badge avatar-xs">
                                          <input type="file" name="photo"
                                             className="p-absolute cursor-pointer z-3 w-100 h-100 op-0 pl-0 pr-0 ri-camera-line"
                                             id="profileImageChangeTwo"/>
                                          <i className="ri-camera-line p-relative z-1"></i>
                                       </span>
                                                </div>
                                                <span className="d-block fw-5 text-muted">Contact Thumb</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-8">
                                            <label htmlFor="contacName2" className="form-label">Key Contact</label>
                                            <input type="text" className="form-control" id="contacName2" value="Sarah"/>
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