import {
  FolderOpenDot,
  Briefcase,
  UserPlus,
  ChevronDown,
  BanknoteArrowUp,
  Handshake,
  FolderKanban
} from "lucide-react";
import ApexCharts from "apexcharts";
import { useEffect, useState } from "react";
import new_care from "../assets/images/new_care.png"
import { NavLink } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { fetchAdminData } from "../utils/AdminDataRequests";
import { fetchCurrencies } from "../utils/CurrencyRequests";

const revenueOptions = {
    series: [
        {
            name: "Revenue",
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

interface CurrencyFilterForm {
    Currency: string;
}

interface PaymentThusFarData {
    month: string;
    totalRevenue: number;
}

interface CurrencyData {
    currencyId: number;
    name: string;
    code: string;
    symbol: string;
    isActive: boolean;
    dateCreated: string;
}


function Dashboard() {
    const { register, control, setValue } = useForm<CurrencyFilterForm>();
    const selectedCurrency = useWatch({ control, name: 'Currency'});
    const [totalPackages, setTotalPackages] = useState(0);
    const [totalEmployers, setTotalEmployers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalWorkers, setTotalWorkers] = useState(0);
    const [totalContracts, setTotalContracts] = useState(0);
    const [paymentData, setPaymentData] = useState<PaymentThusFarData[]>([]);
    const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);

    useEffect(() => {
        fetchCurrencies()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setCurrencyData(data.data);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        if (currencyData.length > 0) {
            if (currencyData.find(data => data.code === 'NGN')) {
                setValue('Currency', 'NGN');
            } else {
                setValue('Currency', currencyData[0].code);
            }
        }
    }, [setValue, currencyData]);

    useEffect(() => {
        fetchAdminData({ Currency: selectedCurrency })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            console.log(data);
                            setTotalPackages(data.data.totalPackages);
                            setTotalEmployers(data.data.totalEmployers);
                            setPaymentData(data.data.paymentThusFar);
                            setTotalRevenue(data.data.totalRevenue);
                            setTotalCandidates(data.data.totalCandidates);
                            setTotalWorkers(data.data.totalWorkers);
                            setTotalContracts(data.data.totalContracts);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [selectedCurrency]);

    useEffect(() => {
        const data = revenueOptions;
        data.series = [
            {
                name: "Revenue",
                type: "area",
                data: paymentData.map(item => item.totalRevenue),
            }
        ];
        data.labels = paymentData.map(item => item.month);
        data.tooltip.y = {
            formatter: function (y: number | undefined) {
                if (typeof y !== "undefined") {
                    return selectedCurrency + y.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2});
                }
                return y;
            },
        };
        const chartElement = document.querySelector("#revenueProfitChart");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, data);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
        
    }, [paymentData, selectedCurrency]);

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
        <div className="col-xl-12">
          <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1">Dashboard</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item">
                    <NavLink to="/Dashboard">
                        Dashboard
                    </NavLink>
                  </li>
                </ol>
              </nav>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-end mb-4 gap-4">
            <div className="dataTables-sorting-control ">
                <select className="form-select sorting-dropdown" style={{ width: '100px' }} {
                    ...register('Currency')
                }>
                    {
                        currencyData.map((data, index) => (
                            <option key={index} value={data.code}>{data.code}</option>
                        ))
                    }
                </select>
            </div>
        </div>
        <div className="col-12 col-lg-4 col-md-6 col-12">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-primary-transparent text-primary">
                <FolderOpenDot size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Packages</span>
                <h2 className="mb-5">{ totalPackages.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }</h2>
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
                <h2 className="mb-5">{selectedCurrency} { totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-info-transparent text-info">
                <Handshake size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Contracts</span>
                <h2 className="mb-5">{ totalContracts.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }</h2>
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
                <h2 className="mb-5">{ totalEmployers.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0}) }</h2>
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
                <h2 className="mb-5">{ totalCandidates.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4 col-md-6">
          <div className="card">
            <div className="card-body d-flex align-center gap-16">
              <div className="avatar avatar-xl bg-slateblue-transparent text-slateblue">
                <FolderKanban size={42}/>
              </div>
              <div className="card-content">
                <span className="d-block fs-16 mb-5">Total Workers</span>
                <h2 className="mb-5">{ totalWorkers.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header justify-between">
              <h4>Revenue Report</h4>
            </div>
            <div className="card-body mini-card-body pt-15">
              <div id="revenueProfitChart"></div>
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
