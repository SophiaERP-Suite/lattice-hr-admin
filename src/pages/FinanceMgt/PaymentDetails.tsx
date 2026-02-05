import {
  ArrowDownFromLine,
  ChevronRight,
  Eye,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllPayments } from "../../utils/PaymentRequests";
import Tippy from "@tippyjs/react";
import Hashids from "hashids";

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

export default function PaymentDetails() {
    const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

    useEffect(() => {
        fetchAllPayments({})
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            setPaymentData(data.data.paymentData);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Payment Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/RevenueMgt/`}>
                                        Payment Details
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
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
                        <button className="btn btn-success">
                            <ArrowDownFromLine /> Download
                        </button>
                    </div>
                </div>
                
                <div className="col-xl-12 d-flex justify-content-center" style={{ overflowX: 'auto', backgroundColor: '#fff' }}>
                    <div id="paymentDetails" style={{
                        width: '794px', height: '1123px',
                        minWidth: '794px', position: 'relative',
                        borderRadius: '0.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div
                            style={{
                                backgroundImage: "url('https://latticehr.techiefy.co.uk/one/lhr_adm/assets/latty_mini-DVCZrJn2.png')",
                                position: 'absolute', backgroundPosition: 'center',
                                top: '0', bottom: '0', right: '0', left: '0',
                                backgroundRepeat: 'no-repeat', backgroundSize: 'contain',
                                opacity: '0.25'
                            }}
                        />
                        <div style={{
                                position: 'relative', marginTop: '1rem', zIndex: '10'
                            }}
                        >
                            <div className="d-flex justify-content-between" style={{ padding: '1.5rem' }}>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <h1 style={{ color: 'rgb(31, 41, 55)', fontSize: '1.5rem', fontWeight: '600' }}>
                                            Payment Details
                                        </h1>
                                    </div>
                                </div>
                                <div className="align-items-center" style={{
                                    maxWidth: '180px', borderLeftWidth: '1px',
                                    paddingLeft: '1rem', paddingTop: '0.5rem'
                                }}>
                                    <img
                                        src="https://latticehr.techiefy.co.uk/one/lhr_adm/assets/latty_mini-DVCZrJn2.png"
                                        style={{
                                            width: 'auto', height: '3rem', borderWidth: '4px',
                                            borderColor: '#fff', marginRight: '1rem'
                                        }}
                                        alt="profile-image"
                                    />
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem'}}>
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                                    gap: '1.5rem', font: '1rem'
                                }}>
                                    <div style={{
                                        gridColumn: 'span 2 / span 2', display: 'grid', columnGap: '0.25rem',
                                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', font: '1rem'
                                    }}>
                                        <div className="align-items-center" style={{
                                            borderLeftWidth: '1px', gridColumn: 'span 3 / span 3',
                                            display: 'flex'
                                        }}>
                                            <img
                                                src="https://latticehr.techiefy.co.uk/one/lhr_adm/assets/latty_mini-DVCZrJn2.png"
                                                style={{
                                                    width: 'auto', height: '3rem', borderWidth: '4px',
                                                    borderColor: '#fff', marginRight: '1rem'
                                                }}
                                                alt="profile-image"
                                            />
                                            <h1 style={{ color: 'rgb(31, 41, 55)', fontSize: '2rem', fontWeight: '800' }}>
                                                Business Name
                                            </h1>
                                        </div>
                                        <b>Email:</b>
                                        <p>Email</p>
                                        <b>Phone:</b>
                                        <p>Phone</p>
                                    </div>
                                    <div style={{
                                            gridColumn: 'span 2 / span 2', display: 'flex',
                                            justifyContent: 'end'
                                        }}>
                                        <div style={{
                                            display: 'grid', gridColumn: 'span 2 / span 2',
                                            fontSize: '1rem', gap: '0.5rem'
                                        }}>
                                            <b>Receipt No:</b>
                                            <p>{hashIds.encode(0)}</p>
                                            <b>Payment Date:</b>
                                            <p>{(new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <b>Status:</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                    </div>
                </div>
            </div>
        </div>
    )
}