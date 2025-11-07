export default function FinanceMgt() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <i className="ri-user-3-fill fs-42"></i>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Customers</span>
                                <h2 className="mb-5">8,542</h2>
                                <span className="text-success">+12.5%<i
                            className="ri-arrow-up-line ml-5 d-inline-block"></i></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-info-transparent text-info">
                                <i className="ri-group-fill fs-42"></i>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">New Leads</span>
                                <h2 className="mb-5">12.3k</h2>
                                <span className="text-success">+0.87%<i
                            className="ri-arrow-up-line ml-5 d-inline-block"></i></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-danger-transparent text-danger">
                                <i className="ri-exchange-fill fs-42"></i>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Conversion Rate</span>
                                <h2 className="mb-5">5,230</h2>
                                <span className="text-danger">-0.34%<i
                            className="ri-arrow-down-line ml-5 d-inline-block"></i></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                    <div className="card">
                        <div className="card-body mini-card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-success-transparent text-success">
                                <i className="ri-money-dollar-circle-fill fs-42"></i>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Revenue</span>
                                <h2 className="mb-5">$8.6k</h2>
                                <span className="text-success">+2.05%<i
                            className="ri-arrow-up-line ml-5 d-inline-block"></i></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xxl-6 col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Order Analytics</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ri-more-2-fill"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="javascript:void(0);">Today</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Week</a>
                                        <a className="dropdown-item active" href="javascript:void(0);">This Month</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Year</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div id="orderAnalyticsChart"></div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-6 col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Revenue & Profit</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ri-more-2-fill"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="javascript:void(0);">Today</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Week</a>
                                        <a className="dropdown-item active" href="javascript:void(0);">This Month</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Year</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div id="revenueProfitChart"></div>
                        </div>
                    </div>
                </div>

                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Sales Pipeline</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ri-more-2-fill"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="javascript:void(0);">Today</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Week</a>
                                        <a className="dropdown-item active" href="javascript:void(0);">This Month</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Year</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div id="contacts-source"></div>
                            <div className="pipeline-stats mt-20">
                                <div className="d-flex justify-between align-center mb-8">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-primary"></span>
                                        <span className="fs-14">Prospects</span>
                                    </div>
                                    <span className="fw-500">124 <span className="text-muted">(25%)</span></span>
                                </div>
                                <div className="d-flex justify-between align-center mb-8">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-info"></span>
                                        <span className="fs-14">Qualified</span>
                                    </div>
                                    <span className="fw-500">98 <span className="text-muted">(20%)</span></span>
                                </div>
                                <div className="d-flex justify-between align-center mb-8">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-warning"></span>
                                        <span className="fs-14">Negotiation</span>
                                    </div>
                                    <span className="fw-500">76 <span className="text-muted">(15%)</span></span>
                                </div>
                                <div className="d-flex justify-between align-center">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-success"></span>
                                        <span className="fs-14">Won</span>
                                    </div>
                                    <span className="fw-500">202 <span className="text-muted">(40%)</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Recent Activity</h4>
                            <a className="btn btn-primary btn-sm" href="javascript:void(0);">View All</a>
                        </div>
                        <div className="card-body pt-15">
                            <ul className="activity-list">
                                <li className="d-flex align-start gap-15 mb-15">
                                    <div className="avatar bg-success-transparent text-success">
                                        <i className="ri-check-line fs-16"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-5">New Deal Closed</h6>
                                        <p className="text-muted fs-12 mb-5">Acme Corp - $12,500</p>
                                        <span className="fs-11 text-muted">2 hours ago</span>
                                    </div>
                                </li>
                                <li className="d-flex align-start gap-15 mb-15">
                                    <div className="avatar bg-primary-transparent text-primary">
                                        <i className="ri-user-add-line fs-16"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-5">New Customer Added</h6>
                                        <p className="text-muted fs-12 mb-5">John Smith from TechSolutions</p>
                                        <span className="fs-11 text-muted">5 hours ago</span>
                                    </div>
                                </li>
                                <li className="d-flex align-start gap-15 mb-15">
                                    <div className="avatar bg-info-transparent text-info">
                                        <i className="ri-chat-new-line fs-16"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-5">New Lead Conversation</h6>
                                        <p className="text-muted fs-12 mb-5">Live chat with Sarah Johnson</p>
                                        <span className="fs-11 text-muted">Today</span>
                                    </div>
                                </li>
                                <li className="d-flex align-start gap-15 mb-15">
                                    <div className="avatar bg-purple-transparent text-purple">
                                        <i className="ri-task-line fs-16"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-5">Task Completed</h6>
                                        <p className="text-muted fs-12 mb-5">Follow up with potential client</p>
                                        <span className="fs-11 text-muted">Yesterday</span>
                                    </div>
                                </li>
                                <li className="d-flex align-start gap-15 mb-15">
                                    <div className="avatar bg-warning-transparent text-warning">
                                        <i className="ri-calendar-line fs-16"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-5">Meeting Scheduled</h6>
                                        <p className="text-muted fs-12 mb-5">Product demo with XYZ Corp</p>
                                        <span className="fs-11 text-muted">Yesterday</span>
                                    </div>
                                </li>
                                <li className="d-flex align-start gap-15">
                                    <div className="avatar bg-danger-transparent text-danger">
                                        <i className="ri-close-line fs-16"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-5">Deal Lost</h6>
                                        <p className="text-muted fs-12 mb-5">Global Enterprises - $8,000</p>
                                        <span className="fs-11 text-muted">2 days ago</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="mb-0">Global Sales Heatmap</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ri-more-2-fill"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="javascript:void(0);">Today</a>
                                        <a className="dropdown-item" href="javascript:void(0);">Last 7 Days</a>
                                        <a className="dropdown-item active" href="javascript:void(0);">This Month</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Year</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body pt-15">
                            <div id="salesWorldMap"></div>
                            <div className="table-responsive pt-15">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Country</th>
                                            <th className="text-end">Revenue</th>
                                            <th className="text-end">Growth</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/flags/palestine-flag.html" alt="image not found"/>
                                                    </div>
                                                    <span>Palestine</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-5">$42.8k</td>
                                            <td className="text-end"><span className="text-success">+12.5% <i
                                        className="ri-arrow-up-line"></i></span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/flags/us-flag.jpg" alt="image not found"/>
                                                    </div>
                                                    <span>United States</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-5">$28.4k</td>
                                            <td className="text-end"><span className="text-success">+8.5% <i
                                        className="ri-arrow-up-line"></i></span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/flags/brazil-flag.html" alt="image not found"/>
                                                    </div>
                                                    <span>Brazil</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-5">$19.7k</td>
                                            <td className="text-end"><span className="text-danger">-2.1% <i
                                        className="ri-arrow-down-line"></i></span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/flags/ireland-flag.html" alt="image not found"/>
                                                    </div>
                                                    <span>Ireland</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-500">$15.2k</td>
                                            <td className="text-end"><span className="text-success">+5.7% <i
                                        className="ri-arrow-up-line"></i></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-between mt-10">
                                <div className="text-center">
                                    <span className="d-block mb-5 fs-12 text-muted">Countries</span>
                                    <h3>30</h3>
                                </div>
                                <div className="text-center">
                                    <span className="d-block mb-5 fs-12 text-muted">Total</span>
                                    <h3>$126.3k</h3>
                                </div>
                                <div className="text-center">
                                    <span className="d-block mb-5 fs-12 text-muted">Avg/Country</span>
                                    <h3>$5.26k</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="mb-0">Leads by Source</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ri-more-2-fill"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="javascript:void(0);">Today</a>
                                        <a className="dropdown-item" href="javascript:void(0);">Last 7 Days</a>
                                        <a className="dropdown-item active" href="javascript:void(0);">This Quarter</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Year</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div id="leadsPieChart"></div>
                            <div className="table-responsive">
                                <table className="table tfoot-b-none mb-0">
                                    <thead>
                                        <tr>
                                            <th>Source</th>
                                            <th className="text-end">Leads</th>
                                            <th className="text-end">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <span className="bullet bg-primary"></span>
                                                    <span>Organic Search</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-500">1,245</td>
                                            <td className="text-end text-success">+18.2% <i className="ri-arrow-up-line"></i></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <span className="bullet bg-info"></span>
                                                    <span>Social Media</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-500">876</td>
                                            <td className="text-end text-success">+12.7% <i className="ri-arrow-up-line"></i></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <span className="bullet bg-warning"></span>
                                                    <span>Email Campaigns</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-500">645</td>
                                            <td className="text-end text-danger">-3.2% <i className="ri-arrow-down-line"></i></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <span className="bullet bg-success"></span>
                                                    <span>Referrals</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-500">432</td>
                                            <td className="text-end text-success">+8.5% <i className="ri-arrow-up-line"></i></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-center gap-10">
                                                    <span className="bullet bg-danger"></span>
                                                    <span>Direct Traffic</span>
                                                </div>
                                            </td>
                                            <td className="text-end fw-500">390</td>
                                            <td className="text-end text-success">+5.1% <i className="ri-arrow-up-line"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Deal Status Overview</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ri-more-2-fill"></i>
                                    </a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="javascript:void(0);">This Week</a>
                                        <a className="dropdown-item" href="javascript:void(0);">Last Week</a>
                                        <a className="dropdown-item" href="javascript:void(0);">This Month</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive table--card">
                                <table className="table table-bordered text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Deal ID</th>
                                            <th>Customer</th>
                                            <th>Start Date</th>
                                            <th>Value</th>
                                            <th>Status</th>
                                            <th>Sales Representative</th>
                                            <th>Closing Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>#DL-1001</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/company/company-thumb-001.png" alt="image not found"/>
                                                    </div>
                                                    <h6><a href="company-details.html">Acme Corporation</a></h6>
                                                </div>
                                            </td>
                                            <td>2023-05-15</td>
                                            <td>$125,000</td>
                                            <td><span className="badge bg-label-success">Closed Won</span>
                                            </td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/avatar/avatar-thumb-001.webp" alt="image not found"/>
                                                    </div>
                                                    <h6>Sarah Johnson</h6>
                                                </div>
                                            </td>
                                            <td>2023-06-20</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <a className="btn-icon btn-success-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                        <i className="ri-eye-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-info-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i className="ri-edit-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>#DL-1002</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/company/company-thumb-002.html" alt="image not found"/>
                                                    </div>
                                                    <h6><a href="company-details.html">Globex Inc.</a></h6>
                                                </div>
                                            </td>
                                            <td>2023-06-01</td>
                                            <td>$85,500</td>
                                            <td><span className="badge bg-label-warning">Negotiation</span>
                                            </td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/avatar/avatar-thumb-002.webp" alt="image not found"/>
                                                    </div>
                                                    <h6>Michael Chen</h6>
                                                </div>
                                            </td>
                                            <td>2023-07-15</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <a className="btn-icon btn-success-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                        <i className="ri-eye-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-info-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i className="ri-edit-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>#DL-1003</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/company/company-thumb-003.html" alt="image not found"/>
                                                    </div>
                                                    <h6><a href="company-details.html">Techtron Systems</a></h6>
                                                </div>
                                            </td>
                                            <td>2023-06-10</td>
                                            <td>$210,000</td>
                                            <td><span className="badge bg-label-info">Proposal Sent</span>
                                            </td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/avatar/avatar-thumb-003.webp" alt="image not found"/>
                                                    </div>
                                                    <h6>Emily Rodriguez</h6>
                                                </div>
                                            </td>
                                            <td>2023-07-30</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <a className="btn-icon btn-success-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                        <i className="ri-eye-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-info-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i className="ri-edit-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>#DL-1004</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/company/company-thumb-004.html" alt="image not found"/>
                                                    </div>
                                                    <h6><a href="company-details.html">Innova Solutions</a></h6>
                                                </div>
                                            </td>
                                            <td>2023-05-28</td>
                                            <td>$45,000</td>
                                            <td><span className="badge bg-label-danger">Lost</span></td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/avatar/avatar-thumb-004.webp" alt="image not found"/>
                                                    </div>
                                                    <h6>David Wilson</h6>
                                                </div>
                                            </td>
                                            <td>2023-06-25</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <a className="btn-icon btn-success-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                        <i className="ri-eye-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-info-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i className="ri-edit-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>#DL-1005</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/company/company-thumb-005.png" alt="image not found"/>
                                                    </div>
                                                    <h6><a href="company-details.html">Vertex Industries</a></h6>
                                                </div>
                                            </td>
                                            <td>2023-06-15</td>
                                            <td>$175,000</td>
                                            <td><span className="badge bg-label-primary">Qualified</span>
                                            </td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/avatar/avatar-thumb-005.webp" alt="image not found"/>
                                                    </div>
                                                    <h6>Jessica Lee</h6>
                                                </div>
                                            </td>
                                            <td>2023-08-10</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <a className="btn-icon btn-success-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                        <i className="ri-eye-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-info-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i className="ri-edit-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>#DL-1005</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/company/company-thumb-006.html" alt="image not found"/>
                                                    </div>
                                                    <h6><a href="company-details.html">Vertex Industries</a></h6>
                                                </div>
                                            </td>
                                            <td>2023-06-15</td>
                                            <td>$175,000</td>
                                            <td><span className="badge bg-label-primary">Qualified</span>
                                            </td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <div className="avatar avatar-xs radius-100">
                                                        <img className="radius-100" src="assets/images/avatar/avatar-thumb-006.webp" alt="image not found"/>
                                                    </div>
                                                    <h6>Jessica Lee</h6>
                                                </div>
                                            </td>
                                            <td>2023-08-10</td>
                                            <td>
                                                <div className="d-flex-items gap-10">
                                                    <a className="btn-icon btn-success-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                        <i className="ri-eye-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-info-light" href="company-details.html" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i className="ri-edit-line"></i>
                                                    </a>
                                                    <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer mt-15">
                            <div className="d-flex-between flex-wrap gap-16">
                                <div className="tables-info">Showing 1 to 10 of 57 entries</div>
                                <ul className="pagination">
                                    <li className="page-item"><a href="javascript:void(0);" className="page-link">Previous</a></li>
                                    <li className="page-item"><a href="javascript:void(0);" className="page-link">1</a></li>
                                    <li className="page-item"><a href="javascript:void(0);" className="page-link">2</a></li>
                                    <li className="page-item"><a href="javascript:void(0);" className="page-link">3</a></li>
                                    <li className="page-item"><a href="javascript:void(0);" className="page-link">Next</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}