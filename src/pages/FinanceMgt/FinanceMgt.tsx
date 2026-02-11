import {
  BanknoteArrowDown,
  ChevronRight,
  CircleDollarSign,
  Eye,
  HandCoins,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import ApexCharts from "apexcharts";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { fetchAllPayments } from "../../utils/PaymentRequests";
import Tippy from "@tippyjs/react";
import Hashids from "hashids";
import { fetchCurrencies } from "../../utils/CurrencyRequests";

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

const disburseOptions = {
    series: [{
        name: 'Completed Payment',
        data: [2, 1, 4, 3, 5, 6, 8, 3]
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
    colors: ['var(--color-success)', 'var(--color-danger)'],
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
    colors: ["var(--color-primary)", "var(--color-info)", "var(--color-warning)", "var(--color-success)", "var(--color-danger)"],
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

interface CurrencyFilterForm {
    Currency: string;
    EndDate: string;
}

interface PaymentThusFarData {
    month: string;
    totalRevenue: number;
}

interface SectorGroupData {
    jobSector: string;
    jobSectorId: number;
    percentage: number;
}

interface PackageGroupData {
    package: string;
    packageId: number;
    percentage: number;
}

interface PaymentData {
    paymentId: string;
    amount: number;
    currency: string;
    employerId: string;
    employer: string;
    employerLogo: string;
    packageId: string;
    package: string;
    txRef: string;
    status: string;
    dateCreated: string;
}

interface CurrencyData {
    currencyId: number;
    name: string;
    code: string;
    symbol: string;
    isActive: boolean;
    dateCreated: string;
}

export default function FinanceMgt() {
    const { register, control, setValue } = useForm<CurrencyFilterForm>();
    const selectedCurrency = useWatch({
        control,
        name: 'Currency'
    });
    const selectedDate = useWatch({
        control,
        name: 'EndDate'
    });
    const [allRevenue, setAllRevenue] = useState(0);
    const [revenueThisYear, setRevenueThisYear] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [paymentThusFar, setPaymentThusFar] = useState<PaymentThusFarData[]>([]);
    const [successThusFar, setSuccessThusFar] = useState<PaymentThusFarData[]>([]);
    const [pendingThusFar, setPendingThusFar] = useState<PaymentThusFarData[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;
    const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
    const [firstPaymentDate, setFirstPaymentDate] = useState(new Date());
    const [yearArray, setYearArray] = useState<number[]>([(new Date()).getFullYear()]);
    const [sectorGroup, setSectorGroup] = useState<SectorGroupData[]>([]);
    const [packageGroup, setPackageGroup] = useState<PackageGroupData[]>([]);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
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
            setValue('Currency', currencyData[0].code);
        }
        setValue('EndDate', `${(new Date()).getFullYear()}`)
    }, [setValue, currencyData]);

    useEffect(() => {
        fetchAllPayments({ Currency: selectedCurrency, EndDate: selectedDate, pageNumber, limit })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            console.log(data);
                            setAllRevenue(data.data.totalAmount);
                            setTotalTransactions(data.data.totalTransaction);
                            setRevenueThisYear(data.data.totalThisYear);
                            setPaymentThusFar(data.data.paymentThusFar);
                            setFirstPaymentDate(data.data.firstPayment ?? new Date());
                            setSuccessThusFar(data.data.successThusFar);
                            setPaymentData(data.data.paymentData);
                            setPendingThusFar(data.data.pendingThusFar);
                            setSectorGroup(data.data.sectorGroups);
                            setPackageGroup(data.data.packageGroups);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [selectedCurrency, selectedDate, pageNumber, limit]);

    useEffect(() => {
        const data = revenueOptions;
        data.series = [
            {
                name: "Revenue",
                type: "area",
                data: paymentThusFar.map(item => item.totalRevenue),
            }
        ];
        data.labels = paymentThusFar.map(item => item.month);
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
        
    }, [paymentThusFar, selectedCurrency]);

    useEffect(() => {
        const data = disburseOptions;
        data.series = [{
                name: 'Successful Payment',
                data: successThusFar.map(item => item.totalRevenue)
            }, {
                name: 'Failed Payment',
                data: pendingThusFar.map(item => item.totalRevenue)
            }]
        data.xaxis.categories = successThusFar.map(item => item.month);
        data.tooltip.y = {
            formatter: function (val: number) {
                return selectedCurrency +  val.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2});
            }
        }
        const chartElement = document.querySelector("#orderAnalyticsChart");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, data);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
    }, [successThusFar, pendingThusFar, selectedCurrency])

    useEffect(() => {
        if (firstPaymentDate) {
            const thisYear = (new Date()).getFullYear()
            const firstYear = (new Date(firstPaymentDate)).getFullYear();
            const arr = []
            for (let i = thisYear; i >= firstYear; i--){
                arr.push(i);
            }
            setYearArray(arr);
        }
    }, [firstPaymentDate])

    useEffect(() => {
        const data = industryOptions;
        data.series = sectorGroup.map(item => item.percentage);
        data.labels = sectorGroup.map(item => item.jobSector);
        const chartElement = document.querySelector("#contacts-source");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, data);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
    }, [sectorGroup]);

    useEffect(() => {
        const data = industryOptions;
        data.series = packageGroup.map(item => item.percentage);
        data.labels = packageGroup.map(item => item.package);
        const chartElement = document.querySelector("#packages-source");
        if (chartElement) {
            const chart = new ApexCharts(chartElement, data);
            chart.render();
            return () => {
                chart.destroy();
            };
        }
    }, [packageGroup]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Revenue Management</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/RevenueMgt">
                                        Revenue Management
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
                    <div className="dataTables-sorting-control ">
                        <select className="form-select sorting-dropdown" style={{ width: '100px' }} {
                            ...register('EndDate')
                        }>
                            {
                                yearArray.map((data, index) => (
                                    <option key={index} value={data}>{ data }</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <BanknoteArrowDown size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Revenue</span>
                                <h2 className="mb-5">{selectedCurrency} { allRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-success-transparent text-success">
                                <HandCoins size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Transactions</span>
                                <h2 className="mb-5">{ totalTransactions }</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-info-transparent text-info">
                                <CircleDollarSign size={42} />
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Revenue For The Year {selectedDate}</span>
                                <h2 className="mb-5">{selectedCurrency} { revenueThisYear.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2}) }</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Revenue</h4>
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
                        </div>
                        <div className="card-body pt-15">
                            <div id="orderAnalyticsChart"></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Top Paying Industries</h4>
                        </div>
                        <div className="card-body pt-15">
                            <div id="contacts-source"></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Top Subscribed Packages</h4>
                        </div>
                        <div className="card-body pt-15">
                            <div id="packages-source"></div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="">Payments Overview</h4>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive table--card">
                                <table className="table table-bordered text-nowrap text-start">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Client</th>
                                            <th>Amount</th>
                                            <th>Package</th>
                                            <th>Status</th>
                                            <th>Payment Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            paymentData.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <div className="avatar avatar-md radius-100">
                                                                    <img className="radius-100" src={data.employerLogo} alt="image not found"/>
                                                                </div>
                                                                <h6 className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#viewCompanies">{ data.employer }</h6>
                                                            </div>
                                                        </td>
                                                        <td>{ `${data.currency} ${data.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2})}` }</td>
                                                        <td>{ data.package }</td>
                                                        <td>
                                                            <span className={`badge 
                                                                ${data.status === 'Success' ? 'bg-label-success' : ''}
                                                                ${data.status === 'Failed' ? 'bg-label-danger' : ''}
                                                                ${data.status === 'Pending' ? 'bg-label-danger' : ''}
                                                                ${data.status === 'Reversed' ? 'bg-label-purple' : ''}`}>
                                                                {data.status === 'Pending' ? 'Failed': data.status}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(data.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                        <td>
                                                            <Tippy content="Preview Payment">
                                                                <NavLink to={`/RevenueMgt/${hashIds.encode(data.paymentId)}`} className="btn-icon btn-info-light">
                                                                    <Eye />
                                                                </NavLink>
                                                            </Tippy>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        
                                    </tbody>
                                </table>
                                {
                                    paymentData.length === 0 ?
                                        <div className="py-4 whitespace-nowrap w-full">
                                        <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any payments made</span>
                                        </div> : <></>
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <div className="flex justify-content-center align-items-center mb-1">
                                <p className="text-black">
                                    Showing { paymentData.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { paymentData.length > 0 ? (((pageNumber * limit) - limit) + 1) + (paymentData.length - 1) : 0 } of { totalTransactions } entries
                                </p>
                            </div>
                            <div className="d-inline-flex flex-wrap">
                                {
                                    pageNumber > 1 && <a
                                        href="#"
                                        onClick={() => { if (pageNumber > 1) {setPageNumber(pageNumber - 1);} }}
                                        className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                    >
                                        Previous
                                    </a>
                                }
                                <a
                                    href="#"
                                    className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                >
                                    { pageNumber }
                                </a>
                                {
                                    (pageNumber * limit) < totalTransactions && <a
                                    href="#"
                                    onClick={() => { setPageNumber(pageNumber + 1); }}
                                    className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                    >
                                        Next
                                    </a>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}