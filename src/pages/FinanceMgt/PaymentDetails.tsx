import {
  ArrowDownFromLine,
  ChevronRight,
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPaymentById } from "../../utils/PaymentRequests";
import Hashids from "hashids";
import { toast, ToastContainer } from 'react-toastify';

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
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const { id } = useParams();
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;

    useEffect(() => {
        fetchPaymentById(hashedId)
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            setPaymentData(data.data);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [hashedId]);

    const downloadReceipt = async () => {
        const loader = document.getElementById('query-loader');
        const text = document.getElementById('query-text');
        if (loader) {
            loader.style.display = 'flex';
        }
        if (text) {
            text.style.display = 'none';
        }
        try {
            const element = document.getElementById('paymentDetails');
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#fff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [794, 1123],
            });
            pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
            pdf.save(`receipt.pdf`);
            toast.success('Your file is being downloaded');
        } catch (err) {
            toast.warning("Download Failed");
            console.log(err);
        }
        if (loader) {
            loader.style.display = 'none';
        }
        if (text) {
            text.style.display = 'flex';
        }
    }

    return (
        <div className="container-fluid">
            <ToastContainer />
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
                        <button className="btn btn-success" onClick={() => downloadReceipt()}>
                            <div className="dots" id="query-loader">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                            <span id="query-text">
                                <ArrowDownFromLine size={18} className="mr-2" /> Download
                            </span>
                        </button>
                    </div>
                </div>
                {
                    paymentData && (
                        <div className="col-xl-12 d-flex justify-content-center" style={{ overflowX: 'auto' }}>
                            <div id="paymentDetails" style={{
                                width: '794px', height: '1123px',
                                minWidth: '794px', position: 'relative', backgroundColor: "#fff",
                                borderRadius: '0.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div
                                    style={{
                                        backgroundImage: "url('http://localhost:5173/one/lhr_adm/src/assets/images/latty_mini.png')",
                                        position: 'absolute', backgroundPosition: 'center',
                                        top: '0', bottom: '0', right: '0', left: '0',
                                        backgroundRepeat: 'no-repeat', backgroundSize: 'contain',
                                        opacity: '0.15'
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
                                                src="http://localhost:5173/one/lhr_adm/src/assets/images/latty_mini.png"
                                                style={{
                                                    width: 'auto', height: '3rem', borderWidth: '4px',
                                                    borderColor: '#fff', marginRight: '1rem'
                                                }}
                                                alt="profile-image"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem'}}>
                                        <div className="align-items-center" style={{
                                            borderLeftWidth: '1px', gridColumn: 'span 3 / span 3',
                                            display: 'flex', marginBottom: '1.5rem'
                                        }}>
                                            <img
                                                src={paymentData.employerLogo}
                                                style={{
                                                    width: 'auto', height: '3rem', borderWidth: '4px',
                                                    borderColor: '#fff', marginRight: '1rem'
                                                }}
                                                alt="profile-image"
                                            />
                                            <h1 style={{ color: 'rgb(31, 41, 55)', fontSize: '2rem', fontWeight: '800' }}>
                                                {paymentData.employer}
                                            </h1>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div style={{
                                                    gridColumn: 'span 2 / span 2', display: 'flex',
                                                    justifyContent: 'start'
                                                }}>
                                                <div style={{
                                                    display: 'grid', gridColumn: 'span 2 / span 2',
                                                    fontSize: '1rem', gap: '0.5rem'
                                                }}>
                                                    <div className="d-flex justify-content-start gap-2 align-items-center">
                                                        <p style={{ fontWeight: '700', marginBottom: '0px'}}>Receipt No:</p>
                                                        <p>{hashIds.encode(paymentData.paymentId)}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-start gap-2 align-items-center">
                                                        <p style={{ fontWeight: '700', marginBottom: '0px'}}>Payment Date:</p>
                                                        <p>{(new Date(paymentData.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-start gap-2 align-items-center">
                                                        <p style={{ fontWeight: '700', marginBottom: '0px'}}>Status:</p>
                                                        <p className={`badge 
                                                            ${paymentData.status === 'Success' ? 'bg-label-success' : ''}
                                                            ${paymentData.status === 'Failed' ? 'bg-label-danger' : ''}
                                                            ${paymentData.status === 'Pending' ? 'bg-label-danger' : ''}
                                                            ${paymentData.status === 'Reversed' ? 'bg-label-purple' : ''}`}>
                                                            {paymentData.status === 'Pending' ? 'Failed': paymentData.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                    gridColumn: 'span 2 / span 2', display: 'flex',
                                                    justifyContent: 'end'
                                                }}>
                                                <div style={{
                                                    display: 'grid', gridColumn: 'span 2 / span 2',
                                                    fontSize: '1rem', gap: '0.5rem'
                                                }}>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ margin: '1.5rem'}}>
                                        <div style={{ backgroundColor: '#fff', padding: '1.5rem' }}>
                                            <div className="card-header justify-between">
                                                <h4 className="">Purchase Details</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive table--card">
                                                    <table className="table table-bordered text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th>S/N</th>
                                                                <th>Description</th>
                                                                <th>Amount</th>
                                                                <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>{ paymentData.package }</td>
                                                                <td>{ `${paymentData.currency} ${paymentData.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2})}` }</td>
                                                                <td>{new Date(paymentData.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end" style={{ paddingRight: '1.5rem', paddingLeft: '1.5rem', marginTop: '1.5rem' }}>
                                                <div style={{
                                                    display: 'flex', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                                    fontSize: '1.125rem'
                                                }}>
                                                    <p style={{ fontWeight: '700', marginBottom: '0px'}}>Total Amount:</p>
                                                    <p className="d-flex justify-content-end"
                                                         style={{ paddingRight: '1rem', paddingLeft: '1rem', marginLeft: '0.5rem' }}
                                                    >{ `${paymentData.currency} ${paymentData.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2})}` }</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}