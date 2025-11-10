import { ArrowUp, BanknoteArrowDown, ChevronDown, ChevronRight, CircleDollarSign, Eye, HandCoins, PenLine, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import ApexCharts from "apexcharts";
import { useEffect } from "react";

const revenueOptions = {
    series: [
        {
            name: "Revenue",
            type: "column",
            data: [18, 23, 28, 36, 44, 52, 61, 71, 76, 88, 91, 100],
        },
        {
            name: "Profit",
            type: "area",
            data: [34, 38, 46, 55, 59, 68, 73, 85, 92, 105, 125, 135],
        }
    ],
    chart: {
        toolbar: {
            show: false,
        },
        height: 350,
        stacked: false,
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 1,
            blur: 3,
            color: ["transparent", "#000"],
            opacity: 0.2
        },
    },
    stroke: {
        width: [1.5, 1.5],
        curve: "smooth",
    },
    plotOptions: {
        bar: {
            columnWidth: "20%",
            borderRadius: 3,
        },
    },
    colors: [
        "var(--color-primary)",
        "var(--color-success)"
    ],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "var(--color-primary)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "var(--color-primary)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "var(--color-primary)",
                        opacity: 1
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgba(var(--success-rgb),0.15)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(var(--success-rgb),0.15)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(var(--success-rgb),0.15)",
                        opacity: 1
                    }
                ],
            ]
        }
    },
    labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    markers: {
        size: 0,
    },
    xaxis: {
        type: "month",
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    },
    yaxis: {
        min: 0,
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y: number | undefined) {
                if (typeof y !== "undefined") {
                    return "NGN " + y.toFixed(0) + ".0k";
                }
                return y;
            },
        },
    },
    legend: {
        position: 'top',
        fontSize: '14px',
        markers: {
            radius: 12
        },
        itemMargin: {
            horizontal: 10,
            vertical: 5
        },
        labels: {
            colors: "var(--color-body)",
        },
    },
};

const disburseOptions = {
    series: [{
        name: 'Completed Payment',
        data: [2, 1, 4, 3, 5, 6, 8, 3]
    }, {
        name: 'Outstanding Payment',
        data: [1, 2, 2, 1, 3, 5, 4, 2]
    }, {
        name: 'Failed Payment',
        data: [0, 1, 0, 2, 1, 3, 0, 1]
    }],
    chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: true
        }
    },
    colors: ['var(--color-success)', 'var(--color-warning)', 'var(--color-danger)'],
    plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 4,
            columnWidth: '55%',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: true,
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val: number) {
                return "NGN " +  val + ".0k"
            }
        }
    },
    legend: {
        position: 'top',
        fontSize: '14px',
        markers: {
            radius: 12
        },
        itemMargin: {
            horizontal: 10,
            vertical: 5
        },
        labels: {
            colors: "var(--color-body)",
        },
    },
    grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 4,
        yaxis: {
            lines: {
                show: true
            }
        }
    },
    responsive: [{
        breakpoint: 768,
        options: {
            plotOptions: {
                bar: {
                    columnWidth: '65%'
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
};

const industryOptions = {
    series: [25, 20, 15, 40],
    chart: {
        type: 'polarArea',
        height: 457
    },
    stroke: {
        colors: ['var(--color-white)'],
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'bottom',
        itemMargin: {
            horizontal: 5,
            vertical: 5
        },
        fontFamily: 'Nunito Sans, sans-serif',
        labels: {
            colors: "var(--color-body)",
        },
    },
    tooltip: {
        y: {
            formatter: function (val: number) {
                return val + "%"
            }
        }
    },
    labels: ['Information Technology', 'Finance', 'Engineering', 'Healthcare'],
    colors: ["var(--color-primary)", "var(--color-info)", "var(--color-warning)", "var(--color-success)"],
    responsive: [{
        breakpoint: 680,
        options: {
            chart: {
                width: 400
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}

const paymentData = [
  {
    company: "TechNova Inc.",
    paymentType: "Subscription Renewal",
    plan: "Pro Plan",
    amount: 250000.00,
    currency: "NGN",
    transactionId: "TXN-984732",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-001",
    billingCycle: "Monthly",
    date: "2025-11-01",
    nextBillingDate: "2025-12-01"
  },
  {
    company: "Skyline Technologies",
    paymentType: "Job Posting Credit",
    plan: "Standard",
    amount: 45000.00,
    currency: "NGN",
    transactionId: "TXN-984733",
    status: "Completed",
    paymentMethod: "PayPal",
    invoiceNumber: "INV-2025-002",
    billingCycle: "One-Time",
    date: "2025-10-29",
    nextBillingDate: null
  },
  {
    company: "BrightHire Solutions",
    paymentType: "Featured Job Upgrade",
    plan: "Premium Boost",
    amount: 120000.00,
    currency: "NGN",
    transactionId: "TXN-984734",
    status: "Pending",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-003",
    billingCycle: "One-Time",
    date: "2025-11-05",
    nextBillingDate: null
  },
  {
    company: "Urban Workforce",
    paymentType: "Subscription Renewal",
    plan: "Enterprise",
    amount: 850000.00,
    currency: "NGN",
    transactionId: "TXN-984735",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    invoiceNumber: "INV-2025-004",
    billingCycle: "Quarterly",
    date: "2025-10-15",
    nextBillingDate: "2026-01-15"
  },
  {
    company: "Nordic Shipping AS",
    paymentType: "Additional Job Slots",
    plan: "Add-on Pack",
    amount: 200000.00,
    currency: "NGN",
    transactionId: "TXN-984736",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-005",
    billingCycle: "One-Time",
    date: "2025-10-27",
    nextBillingDate: null
  },
  {
    company: "NextGen Labs",
    paymentType: "Subscription Renewal",
    plan: "Pro Plan",
    amount: 250000.00,
    currency: "NGN",
    transactionId: "TXN-984737",
    status: "Failed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-006",
    billingCycle: "Monthly",
    date: "2025-11-03",
    nextBillingDate: "2025-12-03"
  },
  {
    company: "EliteRecruit",
    paymentType: "Premium Listing",
    plan: "Gold Tier",
    amount: 300000.00,
    currency: "NGN",
    transactionId: "TXN-984738",
    status: "Completed",
    paymentMethod: "PayPal",
    invoiceNumber: "INV-2025-007",
    billingCycle: "One-Time",
    date: "2025-10-22",
    nextBillingDate: null
  },
  {
    company: "Workify HR",
    paymentType: "Resume Access Credits",
    plan: "Talent Access",
    amount: 180000.00,
    currency: "NGN",
    transactionId: "TXN-984739",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-008",
    billingCycle: "One-Time",
    date: "2025-10-25",
    nextBillingDate: null
  },
  {
    company: "TalentLink Africa",
    paymentType: "Subscription Renewal",
    plan: "Standard",
    amount: 100000.00,
    currency: "NGN",
    transactionId: "TXN-984740",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    invoiceNumber: "INV-2025-009",
    billingCycle: "Monthly",
    date: "2025-11-06",
    nextBillingDate: "2025-12-06"
  },
  {
    company: "InnovaHire Ltd",
    paymentType: "API Integration Fee",
    plan: "Developer Access",
    amount: 60000.00,
    currency: "NGN",
    transactionId: "TXN-984741",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-010",
    billingCycle: "Annual",
    date: "2025-08-10",
    nextBillingDate: "2026-08-10"
  },
  {
    company: "TechNova Inc.",
    paymentType: "Candidate Promotion",
    plan: "Talent Boost",
    amount: 75000.00,
    currency: "NGN",
    transactionId: "TXN-984742",
    status: "Refunded",
    paymentMethod: "PayPal",
    invoiceNumber: "INV-2025-011",
    billingCycle: "One-Time",
    date: "2025-09-29",
    nextBillingDate: null
  },
  {
    company: "BrightHire Solutions",
    paymentType: "Subscription Renewal",
    plan: "Pro Plan",
    amount: 250000.00,
    currency: "NGN",
    transactionId: "TXN-984743",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-012",
    billingCycle: "Monthly",
    date: "2025-11-01",
    nextBillingDate: "2025-12-01"
  },
  {
    company: "Urban Workforce",
    paymentType: "Advertisement Placement",
    plan: "Homepage Banner",
    amount: 400000.00,
    currency: "NGN",
    transactionId: "TXN-984744",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    invoiceNumber: "INV-2025-013",
    billingCycle: "One-Time",
    date: "2025-10-20",
    nextBillingDate: null
  },
  {
    company: "Workify HR",
    paymentType: "Subscription Renewal",
    plan: "Enterprise",
    amount: 850000.00,
    currency: "NGN",
    transactionId: "TXN-984745",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-014",
    billingCycle: "Quarterly",
    date: "2025-09-15",
    nextBillingDate: "2025-12-15"
  },
  {
    company: "TalentLink Africa",
    paymentType: "Job Boost Credit",
    plan: "Boost Pack",
    amount: 50000.00,
    currency: "NGN",
    transactionId: "TXN-984746",
    status: "Completed",
    paymentMethod: "Credit Card",
    invoiceNumber: "INV-2025-015",
    billingCycle: "One-Time",
    date: "2025-10-30",
    nextBillingDate: null
  }
]


export default function FinanceMgt() {
    useEffect(() => {
        const chartElement = document.querySelector("#revenueProfitChart");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, revenueOptions);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
    });

    useEffect(() => {
        const chartElement = document.querySelector("#orderAnalyticsChart");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, disburseOptions);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
    });

    useEffect(() => {
        const chartElement = document.querySelector("#contacts-source");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, industryOptions);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
    });

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Finance Management</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/FinanceMgt">
                                        Finance Management
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
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-success-transparent text-success">
                                <CircleDollarSign size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Revenue</span>
                                <h2 className="mb-5">#8,600,000</h2>
                                <span className="text-success">+2.05% <ArrowUp className="ml-5 d-inline-block" size={15} /></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <BanknoteArrowDown size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Payment</span>
                                <h2 className="mb-5">#4,500,000</h2>
                                <span className="text-success">+12.5%<ArrowUp className="ml-5 d-inline-block" size={15} /></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-info-transparent text-info">
                                <HandCoins size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Profits</span>
                                <h2 className="mb-5">#1,200,000</h2>
                                <span className="text-success">+0.87%<ArrowUp className="ml-5 d-inline-block" size={15} /></span>
                                <span className="fs-12 text-muted ml-5">This week</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Revenue & Profit</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <ChevronDown />
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
                <div className="col-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Payments Analytics</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <ChevronDown />
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
                

                <div className="col-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Top Subscribed Industries</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <ChevronDown />
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
                                <div className="d-flex justify-between align-center">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-success"></span>
                                        <span className="fs-14">Healthcare</span>
                                    </div>
                                    <span className="fw-500">#1,030,000 <span className="text-muted">(40%)</span></span>
                                </div>
                                <div className="d-flex justify-between align-center mb-8">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-primary"></span>
                                        <span className="fs-14">Information Technology</span>
                                    </div>
                                    <span className="fw-500">#7,400,000 <span className="text-muted">(25%)</span></span>
                                </div>
                                <div className="d-flex justify-between align-center mb-8">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-info"></span>
                                        <span className="fs-14">Finance</span>
                                    </div>
                                    <span className="fw-500">#6,700,000 <span className="text-muted">(20%)</span></span>
                                </div>
                                <div className="d-flex justify-between align-center mb-8">
                                    <div className="d-flex align-center gap-10">
                                        <span className="bullet bg-warning"></span>
                                        <span className="fs-14">Engineering</span>
                                    </div>
                                    <span className="fw-500">#6,100,000 <span className="text-muted">(15%)</span></span>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Payments Overview</h4>
                            <div className="card-dropdown">
                                <div className="dropdown">
                                    <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <ChevronDown />
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
                                <table className="table table-bordered text-nowrap text-start">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Payment Type</th>
                                            <th>Plan</th>
                                            <th>Amount</th>
                                            <th>Transaction Id</th>
                                            <th>Status</th>
                                            <th>Payment Method</th>
                                            <th>Invoice Number</th>
                                            <th>Billing Cycle</th>
                                            <th>Date</th>
                                            <th>Next Billing Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            paymentData.map(data => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <h6><a href="company-details.html">{ data.company }</a></h6>
                                                            </div>
                                                        </td>
                                                        <td>{ data.paymentType}</td>
                                                        <td>{ data.plan }</td>
                                                        <td>{ `NGN ${data.amount}` }</td>
                                                        <td>{ data.transactionId }</td>
                                                        <td>
                                                            <span className={`badge 
                                                                ${data.status === 'Completed' ? 'bg-label-success' : ''}
                                                                ${data.status === 'Failed' ? 'bg-label-danger' : ''}
                                                                ${data.status === 'Pending' ? 'bg-label-warning' : ''}
                                                                ${data.status === 'Refunded' ? 'bg-label-purple' : ''}`}>
                                                                {data.status}
                                                            </span>
                                                        </td>
                                                        <td>{ data.paymentMethod }</td>
                                                        <td>{ data.invoiceNumber }</td>
                                                        <td>{ data.billingCycle }</td>
                                                        <td>{ data.date }</td>
                                                        <td>{ data.nextBillingDate }</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <a className="btn-icon btn-success-light" href="#" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">
                                                                    <Eye />
                                                                </a>
                                                                <a className="btn-icon btn-info-light" href="#" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                                    <PenLine />
                                                                </a>
                                                                <a className="btn-icon btn-danger-light" href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                                    <Trash2 />
                                                                </a>
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