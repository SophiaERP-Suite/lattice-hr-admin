import {
  ChevronRight,
  Eye,
  FolderOpenDot,
  FolderOutput,
  Plus,
  ReceiptText,
  ShieldX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import { NavLink } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import Hashids from "hashids";
import { fetchAllContractRequests, fetchAllContracts } from "../../utils/ContractRequests";
import Tippy from "@tippyjs/react";

interface ContractRequestsData {
    requestId: number;
    employerId: string;
    employer: string;
    employerLogo: string;
    description: string;
    contractSigned: boolean;
    dateCreated: string;
}

interface ContractRequestFilter {
    Employer: string;
}

interface ResponsibilitiesData {
    typeId: number;
    typeName: string
    handler: string;
}

interface ContractData {
    contractId: number;
    content: string;
    currency: string;
    amount: number;
    expiryDate: string;
    employerId: number;
    employer: string;
    employerLogo: string;
    employerMail : string;
    employerPhone : string;
    dateCreated: string;
    signed: boolean;
    responsibilities: ResponsibilitiesData[];
}

export default function Contracts() {
    const [contracts, setContracts] = useState<ContractData[]>([]);
    const [contractRequests, setContractRequests] = useState<ContractRequestsData[]>([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalContracts, setTotalContracts] = useState(0);
    const [totalExpired, setTotalExpired] = useState(0);
    const [reqPageNumber, setReqPageNumber] = useState(1);
    const reqLimit = 10;
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;
    const { register, control } = useForm<ContractRequestFilter>();
    const filters = useWatch({control});
    const { register: cRegister, control: cControl } = useForm<ContractRequestFilter>();
    const cFilters = useWatch({control: cControl});
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

    useEffect(() => {
        fetchAllContractRequests({
            pageNumber: reqPageNumber,
            limit: reqLimit,
            ...filters
        })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data);
                setContractRequests(data.data.requests);
                setTotalRequests(data.data.totalCount);
                setTotalExpired(data.data.totalExpired);
            })
        } else {
            res.text()
            .then(data => {
                console.log(JSON.parse(data));
            })
        }
        })
    }, [reqPageNumber, reqLimit, filters]);

    useEffect(() => {
        fetchAllContracts({
            pageNumber,
            limit,
            ...cFilters
        })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data);
                setContracts(data.data.contracts);
                setTotalContracts(data.data.totalCount);
                setTotalExpired(data.data.totalExpired);
            })
        } else {
            res.text()
            .then(data => {
                console.log(JSON.parse(data));
            })
        }
        })
    }, [pageNumber, limit, cFilters]);

    return (
        <div className="container-fluid">
            <ToastContainer />
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Contracts</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/Contracts">
                                        Contracts
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
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-info-transparent text-info">
                                <ReceiptText size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Contracts</span>
                                <h2 className="mb-5">{totalContracts}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                <FolderOpenDot size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Requests</span>
                                <h2 className="mb-5">{totalRequests}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-danger-transparent text-danger">
                                <ShieldX size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Expired / Inactive</span>
                                <h2 className="mb-5">{ totalExpired }</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="tab-style-three mb-25">
                            <ul className="nav nav-pills gap-10 b-bottom2px b-color-primary mobile-nav" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="pills-contracts-tab" data-bs-toggle="pill" data-bs-target="#pills-contracts" type="button" role="tab" aria-controls="pills-contracts" aria-selected="false" tabIndex={1}>Contracts</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-requests-tab" data-bs-toggle="pill" data-bs-target="#pills-requests" type="button" role="tab" aria-controls="pills-requests" aria-selected="false" tabIndex={1}>Requests</button>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane show active" id="pills-contracts" role="tabpanel" aria-labelledby="pills-contracts-tab" tabIndex={1}>
                                <div className="card-header justify-between">
                                    <h4 className="d-flex-items gap-10">Contracts</h4>
                                    <div className="d-flex flex-wrap gap-15">
                                        <div className="dataTables-sorting-control ">
                                            <input type="text" className="form-control" placeholder="Search by Name" {
                                                ...cRegister('Employer')
                                            } />
                                        </div>
                                        <button type="button" className="btn btn-success">
                                            <Plus size={18} className="mr-2" /> Add New Contract
                                        </button>
                                        <a className="btn btn-info text-white" href="javascript:void(0);">
                                            <FolderOutput /> Export As CSV
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body pt-15">
                                    <div className="table-responsive">
                                        <table id="dataTableDefault" className="table text-nowrap text-start">
                                            <thead>
                                                <tr>
                                                    <th scope="col">S/N</th>
                                                    <th scope="col">Client</th>
                                                    <th scope="col">Signed</th>
                                                    <th scope="col">Pricing</th>
                                                    <th scope="col">Date Created</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    contracts.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                { index + 1}
                                                            </td>
                                                            <td>
                                                                <NavLink to={`/ClientMgt/${hashIds.encode(data.employerId)}`} className="d-flex-items gap-10">
                                                                    <div className="avatar avatar-md radius-100">
                                                                        <img className="radius-100" src={data.employerLogo} alt="image not found"/>
                                                                    </div>
                                                                    <h6 className="cursor-pointer">{ data.employer }</h6>
                                                                </NavLink>
                                                            </td>
                                                            <td>
                                                                { data.signed
                                                                    ? <span className="badge bg-label-success">Signed</span>
                                                                    : <span className="badge bg-label-warning">Not Signed</span>}
                                                            </td>
                                                            <td>
                                                                {`${data.currency} ${data.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                                                            </td>
                                                            <td>
                                                                {new Date(data.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </td>
                                                            <td>
                                                                <Tippy content="View Request">
                                                                    <NavLink to={`/Contracts/${hashIds.encode(data.contractId)}`} className="btn-icon btn-info-light">
                                                                        <Eye />
                                                                    </NavLink>
                                                                </Tippy>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            contracts.length === 0 ?
                                                <div className="py-4 whitespace-nowrap w-full">
                                                <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any contract added</span>
                                                </div> : <></>
                                        }
                                    </div>
                                    <div className="d-flex justify-content-between mt-4">
                                        <div className="flex justify-content-center align-items-center mb-1">
                                            <p className="text-black">
                                                Showing { contracts.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { contracts.length > 0 ? (((pageNumber * limit) - limit) + 1) + (contracts.length - 1) : 0 } of { totalContracts } entries
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
                                                (pageNumber * limit) < totalContracts && <a
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
                            <div className="tab-pane fade" id="pills-requests" role="tabpanel" aria-labelledby="pills-requests-tab" tabIndex={1}>
                                <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                    <h4 className="">Contract Requests</h4>
                                    <div className="d-flex flex-wrap gap-15">
                                        <div className="dataTables-sorting-control ">
                                            <input type="text" className="form-control" placeholder="Search by Name" {
                                                ...register('Employer')
                                            } />
                                        </div>
                                        <a className="btn btn-info text-white" href="javascript:void(0);">
                                            <FolderOutput /> Export As CSV
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body pt-15">
                                    <div className="table-responsive">
                                        <table id="dataTableDefault" className="table text-nowrap text-start">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        S/N
                                                    </th>
                                                    <th>Client</th>
                                                    <th>Signed</th>
                                                    <th>Request Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    contractRequests.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                { index + 1}
                                                            </td>
                                                            <td>
                                                                <NavLink to={`/ClientMgt/${hashIds.encode(data.employerId)}`} className="d-flex-items gap-10">
                                                                    <div className="avatar avatar-md radius-100">
                                                                        <img className="radius-100" src={data.employerLogo} alt="image not found"/>
                                                                    </div>
                                                                    <h6 className="cursor-pointer">{ data.employer }</h6>
                                                                </NavLink>
                                                            </td>
                                                            <td>
                                                                { data.contractSigned
                                                                    ? <span className="badge bg-label-success">Signed</span>
                                                                    : <span className="badge bg-label-warning">None Signed</span>}
                                                            </td>
                                                            <td>
                                                                {new Date(data.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </td>
                                                            <td>
                                                                <Tippy content="View Request">
                                                                    <NavLink to={`/Contracts/Requests/${hashIds.encode(data.requestId)}`} className="btn-icon btn-info-light">
                                                                        <Eye />
                                                                    </NavLink>
                                                                </Tippy>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            contractRequests.length === 0 ?
                                                <div className="py-4 whitespace-nowrap w-full">
                                                <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any contract requests</span>
                                                </div> : <></>
                                        }
                                    </div>
                                    <div className="d-flex justify-content-between mt-4">
                                        <div className="flex justify-content-center align-items-center mb-1">
                                            <p className="text-black">
                                                Showing { contractRequests.length > 0 ? ((reqPageNumber * reqLimit) - reqLimit) + 1 : 0 } to { contractRequests.length > 0 ? (((reqPageNumber * reqLimit) - reqLimit) + 1) + (contractRequests.length - 1) : 0 } of { totalRequests } entries
                                            </p>
                                        </div>
                                        <div className="d-inline-flex flex-wrap">
                                            {
                                                reqPageNumber > 1 && <a
                                                    href="#"
                                                    onClick={() => { if (reqPageNumber > 1) {setReqPageNumber(reqPageNumber - 1);} }}
                                                    className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                                >
                                                    Previous
                                                </a>
                                            }
                                            <a
                                                href="#"
                                                className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                            >
                                                { reqPageNumber }
                                            </a>
                                            {
                                                (reqPageNumber * reqLimit) < totalRequests && <a
                                                href="#"
                                                onClick={() => { setReqPageNumber(reqPageNumber + 1); }}
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
                </div>
            </div>
        </div>
    );
}