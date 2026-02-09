import {
    Briefcase,
    ChevronRight,
    Eye,
    FolderOpenDot,
    FolderOutput,
    Gauge,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllCandidates } from "../../utils/CandidateRequests";
import { useForm, useWatch } from "react-hook-form";
import Hashids from "hashids";

interface CandidateData {
    userId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateCreated: string;
    email: string;
    phone: string;
    gender: string;
    profilePhoto: string;
}

interface JobFilter {
    name: string;
}

export default function CandidatesMgt() {
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalActive, setTotalActive] = useState(0);
    const [totalInactive, setTotalInactive] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;
    const [candidates, setCandidates] = useState<CandidateData[]>([]);
    const { register, control } = useForm<JobFilter>();
    const filters = useWatch({ control })
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

    useEffect(() => {
        fetchAllCandidates({ pageNumber, limit, ...filters })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            console.log(data);
                            setTotalCandidates(data.data.totalCount);
                            setCandidates(data.data.jobSeekers);
                            setTotalActive(data.data.totalActive);
                            setTotalInactive(data.data.totalInactive);
                        })
                } else {
                    res.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        })
                }
            })
    }, [pageNumber, limit, filters])

    return <div className="container-fluid">
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Candidate Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/CandidateMgt">
                                    Candidate Management
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
                    <div className="avatar avatar-xl bg-primary-transparent text-primary">
                        <Briefcase size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Total Candidates</span>
                        <h2 className="mb-5">{totalCandidates.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-success-transparent text-success">
                    <FolderOpenDot size={42}/>
                    </div>
                    <div className="card-content">
                        <span className="d-block fs-16 mb-5">Active Candidates</span>
                        <h2 className="mb-5">{totalActive.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-12 col-lg-4 col-md-6">
                <div className="card">
                <div className="card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-danger-transparent text-danger">
                    <Gauge size={42}/>
                    </div>
                    <div className="card-content">
                    <span className="d-block fs-16 mb-5">Inactive Candidates</span>
                    <h2 className="mb-5">{totalInactive.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header justify-between">
                        <h4 className="d-flex-items gap-10">Candidates<span className="badge bg-label-primary">{totalCandidates.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <div className="dataTables-sorting-control ">
                                <input type="text" className="form-control" placeholder="Search by Name" {
                                    ...register('name')
                                } />
                            </div>
                            <a className="btn btn-info text-white" href="javascript:void(0);">
                                <FolderOutput /> Export As CSV
                            </a>
                        </div>
                    </div>
                    <div className="card-body pt-15">
                        <div className="table-responsive">
                            <table id="companiesDataTable" className="table text-nowrap text-start w-100">
                                <thead>
                                    <tr>
                                        <th scope="col">S/N</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Date Of Birth</th>
                                        <th scope="col">Gender</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Join Date</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        candidates.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        { index + 1}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <div className="avatar avatar-md radius-100">
                                                                <img className="radius-100" src={data.profilePhoto.startsWith('/') ? `http://localhost:5127/${data.profilePhoto}` : data.profilePhoto} alt="Candidate Image"/>
                                                            </div>
                                                            <h6 className="cursor-pointer">{`${data.firstName} ${data.lastName}`}</h6>
                                                        </div>
                                                    </td>
                                                    <td><a href={`mailto:${data.email}`} className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">{ data.email }</a></td>
                                                    <td>{ data.phone }</td>
                                                    <td>{ (new Date(data.dateOfBirth)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }</td>
                                                    <td>{ data.gender }</td>
                                                    <td>Location</td>
                                                    <td>{ (new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }</td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <NavLink to={`/CandidateMgt/${hashIds.encode(data.userId)}`} className="btn-icon btn-info-light">
                                                                <a><Eye /></a>
                                                            </NavLink>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                candidates.length === 0 ?
                                    <div className="py-4 whitespace-nowrap w-full">
                                    <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any candidate sign up</span>
                                    </div> : <></>
                            }
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <div className="flex justify-content-center align-items-center mb-1">
                            <p className="text-black">
                                Showing { candidates.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { candidates.length > 0 ? (((pageNumber * limit) - limit) + 1) + (candidates.length - 1) : 0 } of { totalCandidates } entries
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
                                (pageNumber * limit) < totalCandidates && <a
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
}