import {
  ArrowUp,
  FolderOpenDot,
  Briefcase,
  UserPlus,
  ClockCheck,
  ChevronDown,
  BanknoteArrowUp
} from "lucide-react";
import ApexCharts from "apexcharts";
import { useEffect } from "react";
import nursing from "../assets/images/nursing.jpg";
import carePhoto from "../assets/images/Care1.jpg";
import homeCare from "../assets/images/home_care.jpg";
import hospital from "../assets/images/hospital.jpg";
import elderlyCare from "../assets/images/elderly_care.png";
import new_care from "../assets/images/new_care.png"

const options = {
    chart: {
        height: 352,
        type: 'line',
        stacked: false,
        toolbar: { show: false }
    },
    series: [
        {
            name: 'Subscriptions',
            type: 'area',
            data: [35000, 65000, 50000, 70000, 55000, 60000, 45000, 43000, 75000, 55000, 63000, 68000],
            color: "#FEBB7B"
        },
        {
            name: 'Earnings',
            type: 'column',
            data: [90000, 100000, 70000, 110000, 80000, 85000, 60000, 30000, 95000, 40000, 85000, 35000],

            color: "#4F46E5",
        },
        {
            name: 'Refunds',
            type: 'line',
            data: [10000, 15000, 12000, 20000, 18000, 10000, 5000, 8000, 10000, 25000, 14000, 20000],
            color: "var(--color-success)",
            stroke: {
                dashArray: 5,
                width: 2
            }
        }
    ],
    stroke: {
        width: [2, 0, 2],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '45%'
        }
    },
    fill: {
        opacity: [0.2, 1, 1]
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    markers: {
        size: 5
    },
    xaxis: {
        type: 'category',
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
    legend: {
        position: "top",
        labels: {
            colors: "var(--color-body)",
        },
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (val: string) {
                return "#" + val;
            }
        },
    },
};

const dataOptions = {
    series: [{
        name: 'series1',
        data: [80, 50, 60, 95, 85, 95, 50]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#4F46E5'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2025-09-19T00:00:00.000Z", "2025-09-19T01:30:00.000Z", "2025-09-19T02:30:00.000Z", "2025-09-19T03:30:00.000Z", "2025-09-19T04:30:00.000Z", "2025-09-19T05:30:00.000Z", "2025-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    },
};

const dataOptions2 = {
    series: [{
        name: 'series1',
        data: [80, 50, 60, 95, 85, 95, 50]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#FEBB7B'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2025-09-19T00:00:00.000Z", "2025-09-19T01:30:00.000Z", "2025-09-19T02:30:00.000Z", "2025-09-19T03:30:00.000Z", "2025-09-19T04:30:00.000Z", "2025-09-19T05:30:00.000Z", "2025-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};

const dataOptions3 = {
    series: [{
        name: 'series1',
        data: [50, 80, 70, 90, 85, 95, 90]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#35BE5E'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2025-09-19T00:00:00.000Z", "2025-09-19T01:30:00.000Z", "2025-09-19T02:30:00.000Z", "2025-09-19T03:30:00.000Z", "2025-09-19T04:30:00.000Z", "2025-09-19T05:30:00.000Z", "2025-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};

const dataOptions4 = {
    series: [{
        name: 'series1',
        data: [50, 80, 70, 90, 85, 95, 90]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#93E7FE'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2025-09-19T00:00:00.000Z", "2025-09-19T01:30:00.000Z", "2025-09-19T02:30:00.000Z", "2025-09-19T03:30:00.000Z", "2025-09-19T04:30:00.000Z", "2025-09-19T05:30:00.000Z", "2025-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};

const dataOptions5 = {
    series: [{
        name: 'series1',
        data: [50, 80, 70, 90, 85, 95, 90]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#F991DC'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2025-09-19T00:00:00.000Z", "2025-09-19T01:30:00.000Z", "2025-09-19T02:30:00.000Z", "2025-09-19T03:30:00.000Z", "2025-09-19T04:30:00.000Z", "2025-09-19T05:30:00.000Z", "2025-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};

const jobData = [
  {
    job: "Care Nurse",
    employer: "One Health Solutions Inc.",
    applicants: 29
  },
  {
    job: "Frontend Developer",
    employer: "TechNova Systems Ltd.",
    applicants: 42
  },
  {
    job: "Mechanical Engineer",
    employer: "DeltaTech Engineering Works",
    applicants: 33
  },
  {
    job: "Legal Associate",
    employer: "Adebayo & Co. Chambers",
    applicants: 17
  },
  {
    job: "Software QA Tester",
    employer: "CodeLink Technologies",
    applicants: 26
  }
]

function Dashboard() {

  useEffect(() => {
    const chartElement = document.querySelector("#order-status");
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });

  useEffect(() => {
    const widgetChartYear = document.querySelector("#widgetChartYear");
    if (widgetChartYear) {
      const chart = new ApexCharts(widgetChartYear, dataOptions);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });

  useEffect(() => {
    const widgetChartYear = document.querySelector("#widgetChartYear2");
    if (widgetChartYear) {
      const chart = new ApexCharts(widgetChartYear, dataOptions2);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });

  useEffect(() => {
    const widgetChartYear = document.querySelector("#widgetChartYear3");
    if (widgetChartYear) {
      const chart = new ApexCharts(widgetChartYear, dataOptions3);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });

  useEffect(() => {
    const widgetChartYear = document.querySelector("#widgetChartYear4");
    if (widgetChartYear) {
      const chart = new ApexCharts(widgetChartYear, dataOptions4);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });

  useEffect(() => {
    const widgetChartYear = document.querySelector("#widgetChartYear5");
    if (widgetChartYear) {
      const chart = new ApexCharts(widgetChartYear, dataOptions5);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-4 col-md-6 col-12">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-primary-transparent text-primary">
                <FolderOpenDot size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Qty</span>
                <h2 className="mb-5">1,250</h2>
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
              <div className="avatar avatar-xl bg-warning-transparent text-warning">
                <BanknoteArrowUp size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Revenue</span>
                <h2 className="mb-5">#4,208,000</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-info-transparent text-info">
                <FolderOpenDot size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">New Contracts</span>
                <h2 className="mb-5">12</h2>
                <span className="text-success">
                  +3 New
                  <ArrowUp size={12} className="ri-arrow-up-line"/>
                </span>
                <span className="fs-12 text-muted ml-5">this week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-purple-transparent text-purple">
                <Briefcase size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Employers</span>
                <h2 className="mb-5">568</h2>
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
                <UserPlus size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Candidates</span>
                <h2 className="mb-5">2432</h2>
                <span className="text-success">
                  +10%
                  <ArrowUp size={12} className="ri-arrow-up-line" />
                </span>
                <span className="fs-12 text-muted ml-5">vs. last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-slateblue-transparent text-slateblue">
                <ClockCheck size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Attendance Rate</span>
                <h2 className="mb-5">94%</h2>
                <span className="fs-12 text-muted">This week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-between">
              <h4>Revenue Report</h4>
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
            <div className="card-body mini-card-body pt-15">
              <div id="order-status"></div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-between">
              <h4>Top Employer</h4>
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
              <div className="vendor-box p-relative mb-4">
                  <div className="vendor-content">
                    <div className="d-flex-between">
                        <div className="d-flex gap-15">
                            <div className="vendor-thumb">
                                <img src={homeCare} alt="image not found"/>
                            </div>
                            <div className="text-start">
                                <h5 className="mb-5">One Health Solutions Inc.</h5>
                                <span className="text-body" style={{ textAlign: 'start' }}>Health Care</span>
                            </div>
                        </div>
                        <div className="card-dropdown">
                            <div className="dropdown">
                                <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  <ChevronDown />
                                </a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="javascript:void(0);">View Jobs</a>
                                  <a className="dropdown-item" href="javascript:void(0);">Contact</a>
                                  <a className="dropdown-item" href="javascript:void(0);">Reports</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="vendor-content mb-10">
                        <span className="d-block mb-5">Monthly Revenue</span>
                        <div className="d-flex flex-wrap gap-10">
                            <h3>#850,000</h3>
                            <div>
                                <span className="text-success">+3.2%<ArrowUp size={12} className="ri-arrow-up-line"/></span>
                                <span className="fs-12 text-muted ml-5">This month</span>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div className="vendor-chart">
                      <div id="widgetChartYear"></div>
                  </div>
              </div>
              <div className="vendor-box p-relative mb-4">
                  <div className="vendor-content">
                      <div className="d-flex-between">
                          <div className="d-flex gap-15">
                              <div className="vendor-thumb">
                                  <img src={carePhoto} alt="image not found"/>
                              </div>
                              <div className="text-start">
                                  <h5 className="mb-5">Care Plus Ltd.</h5>
                                  <span className="text-body">Hospital & Care</span>
                              </div>
                          </div>
                          <div className="card-dropdown">
                              <div className="dropdown">
                                  <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <ChevronDown />
                                  </a>
                                  <div className="dropdown-menu">
                                    <a className="dropdown-item" href="javascript:void(0);">View Jobs</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Contact</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Reports</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="vendor-content mb-10">
                          <span className="d-block mb-5">Monthly Revenue</span>
                          <div className="d-flex flex-wrap gap-10">
                              <h3>#922,300</h3>
                              <div>
                                  <span className="text-success">+5.1%<ArrowUp size={12} className="ri-arrow-up-line"/></span>
                                  <span className="fs-12 text-muted ml-5">This month</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="vendor-chart">
                      <div id="widgetChartYear2"></div>
                  </div>
              </div>
              <div className="vendor-box p-relative mb-4">
                  <div className="vendor-content">
                      <div className="d-flex-between">
                          <div className="d-flex gap-15">
                              <div className="vendor-thumb">
                                  <img src={hospital} alt="image not found"/>
                              </div>
                              <div className="text-start">
                                  <h5 className="mb-5">Little Nest Health Co.</h5>
                                  <span className="text-body">Hospital</span>
                              </div>
                          </div>
                          <div className="card-dropdown">
                              <div className="dropdown">
                                  <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <ChevronDown />
                                  </a>
                                  <div className="dropdown-menu">
                                    <a className="dropdown-item" href="javascript:void(0);">View Jobs</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Contact</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Reports</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="vendor-content mb-10">
                          <span className="d-block mb-5">Monthly Revenue</span>
                          <div className="d-flex flex-wrap gap-10">
                              <h3>#612,450</h3>
                              <div>
                                  <span className="text-success">+2.8%<ArrowUp size={12} className="ri-arrow-up-line"/></span>
                                  <span className="fs-12 text-muted ml-5">This month</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="vendor-chart">
                      <div id="widgetChartYear3"></div>
                  </div>
              </div>
              <div className="vendor-box p-relative mb-4">
                  <div className="vendor-content">
                      <div className="d-flex-between">
                          <div className="d-flex gap-15">
                              <div className="vendor-thumb">
                                  <img src={elderlyCare} alt="image not found"/>
                              </div>
                              <div className="text-start">
                                  <h5 className="mb-5">God's Own Care Co</h5>
                                  <span className="text-body">Elderly Care</span>
                              </div>
                          </div>
                          <div className="card-dropdown">
                              <div className="dropdown">
                                  <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <ChevronDown />
                                  </a>
                                  <div className="dropdown-menu">
                                    <a className="dropdown-item" href="javascript:void(0);">View Jobs</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Contact</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Reports</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="vendor-content mb-10">
                          <span className="d-block mb-5">Monthly Revenue</span>
                          <div className="d-flex flex-wrap gap-10">
                              <h3>#492,920</h3>
                              <div>
                                  <span className="text-success">+1.9%<ArrowUp size={12} className="ri-arrow-up-line"/></span>
                                  <span className="fs-12 text-muted ml-5">This month</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="vendor-chart">
                      <div id="widgetChartYear4"></div>
                  </div>
              </div>
              <div className="vendor-box p-relative mb-4">
                  <div className="vendor-content">
                      <div className="d-flex-between">
                          <div className="d-flex gap-15">
                              <div className="vendor-thumb">
                                  <img src={nursing} alt="image not found"/>
                              </div>
                              <div className="text-start">
                                  <h5 className="mb-5">St.Thomas Care Home</h5>
                                  <span className="text-body">Home Care</span>
                              </div>
                          </div>
                          <div className="card-dropdown">
                              <div className="dropdown">
                                  <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <ChevronDown />
                                  </a>
                                  <div className="dropdown-menu">
                                    <a className="dropdown-item" href="javascript:void(0);">View Jobs</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Contact</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Reports</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="vendor-content mb-10">
                          <span className="d-block mb-5">Monthly Revenue</span>
                          <div className="d-flex flex-wrap gap-10">
                              <h3>#295,680</h3>
                              <div>
                                  <span className="text-success">+7.3%<ArrowUp size={12} className="ri-arrow-up-line"/></span>
                                  <span className="fs-12 text-muted ml-5">This month</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="vendor-chart">
                      <div id="widgetChartYear5"></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="card height-equal">
            <div className="card-header justify-between">
              <h4 className="">Top Jobs</h4>
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
              <ul>
                {
                  jobData.map(data => {
                    return (
                      <li className="d-flex-between mb-15">
                        <div className="d-flex-items gap-10">
                          <div className="avatar avatar-md radius-100">
                            <img className="radius-100" src={new_care} alt="image not found" />
                          </div>
                          <div className="text-start">
                            <h6 className="mb-0">{ data.job }</h6>
                            <span className="text-muted">{ data.employer }</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fs-16 fw-6">{ data.applicants }</div>
                          <span className="fs-14 text-muted">Applicants</span>
                        </div>
                      </li>
                    );
                  })
                }
                </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="card">
            <div className="card-header justify-between">
              <h4 className="">Top Industries</h4>
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
              <div className="bd-progress-wrapper">
                  <div className="single-progress mb-10">
                    <div className="d-flex-between mb-5">
                      <h6 className="fs-14">HealthCare</h6>
                      <span className="progress-number">70%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-primary" role="progressbar" style={{ width: "70%" }}></div>
                    </div>
                  </div>

                  <div className="single-progress mb-10">
                    <div className="d-flex-between mb-5">
                      <h6 className="fs-14">Technology</h6>
                      <span className="progress-number">85%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-secondary" role="progressbar" style={{ width: "85%" }}>
                      </div>
                    </div>
                  </div>

                  <div className="single-progress mb-10">
                    <div className="d-flex-between mb-5">
                      <h6 className="fs-14">Finance</h6>
                      <span className="progress-number">65%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: "65%" }}>
                      </div>
                    </div>
                  </div>

                  <div className="single-progress">
                    <div className="d-flex-between mb-5">
                      <h6 className="fs-14">Engineering</h6>
                      <span className="progress-number">55%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-warning" role="progressbar" style={{ width: "55%" }}>
                      </div>
                    </div>
                </div>
                <div className="single-progress">
                  <div className="d-flex-between mb-5">
                    <h6 className="fs-14">Legal</h6>
                    <span className="progress-number">50%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-action" role="progressbar" style={{ width: "50%" }}>
                    </div>
                  </div>
                </div>
                <div className="single-progress">
                  <div className="d-flex-between mb-5">
                    <h6 className="fs-14">Energy</h6>
                    <span className="progress-number">46%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: "46%" }}>
                    </div>
                  </div>
                </div>
                <div className="single-progress">
                  <div className="d-flex-between mb-5">
                    <h6 className="fs-14">Mining</h6>
                    <span className="progress-number">40%</span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: "40%" }}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
