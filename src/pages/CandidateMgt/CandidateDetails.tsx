import {
    Cake,
  ChevronRight,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
  Venus,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { fetchCandidateById } from "../../utils/CandidateRequests";

interface CandidateData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateCreated: string;
    email: string;
    phone: string;
    gender: string;
    profilePhoto: string;
    country: string;
    state: string;
    city: string;
    address: string;
    maritalStatus: string;
    degree: string
}

interface JobData {
  jobId: number;
  jobTitle: string;
  jobDescription: string;
  employerId: string;
  employer: string;
  dateCreated: string;
}

const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);

  let age = today.getFullYear() - dob.getFullYear();
  const birthdayPassed = today.getMonth() > dob.getMonth()
    || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!birthdayPassed) {
    age--;
  }
  return age > 1 ? `${age} Years` : `${age} Year`;
}

export default function CandidateDetails() {
    const { id } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [candidateDetails, setCandidateDetails] = useState<CandidateData | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<JobData[]>([]);
    
    useEffect(() => {
        fetchCandidateById(hashedId)
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    console.log(data);
                    setCandidateDetails(data.data);
                    setAppliedJobs([]);
                })
            } else {
                res.text()
                .then(data => {
                    console.log(JSON.parse(data));
                })
            }
        })
    }, [hashedId]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Candidate Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/CandidateMgt/${id}`}>
                                        Candidate Details
                                    </NavLink>
                                </li>
                                 <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
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
                {
                    candidateDetails && (
                        <>
                            <div className="col-xxl-3 col-xl-5 col-lg-5">
                                <div className="sidebar-sticky">
                                    <div className="card">
                                        <div className="company-info">
                                            <div className="company-logo">
                                                <img src={candidateDetails.profilePhoto.startsWith('/') ? `http://localhost:5127/${candidateDetails.profilePhoto}` : candidateDetails.profilePhoto} alt="image not found" />
                                            </div>
                                            <h2 className="company-name mb-15">{ `${candidateDetails.firstName} ${candidateDetails.lastName}` }</h2>

                                            <div className="company-info-list mb-25">
                                                <ul>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Mail /></span> <Tippy content="Email"><span style={{ textWrap: 'wrap'}}>{candidateDetails.email ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Phone /></span> <Tippy content="Phone"><span style={{ textWrap: 'wrap'}}>{candidateDetails.phone ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Cake /></span> <Tippy content="Date of Birth"><span style={{ textWrap: 'wrap'}}>{
                                                        candidateDetails.dateOfBirth
                                                            ? `${(new Date(candidateDetails.dateOfBirth)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} (${calculateAge(new Date(candidateDetails.dateOfBirth))})`
                                                            : 'None Provided'
                                                        }</span></Tippy>
                                                    </li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Venus /></span> <Tippy content="Gender"><span style={{ textWrap: 'wrap'}}>{candidateDetails.gender ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><MapPinHouse /></span> <Tippy content="Address"><span style={{ textWrap: 'wrap'}}>{candidateDetails.address}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><MapPin /> <Tippy content="Location"><span style={{ textWrap: 'wrap'}}>{ `${candidateDetails.city}${candidateDetails.city && ','} ${candidateDetails.state}${candidateDetails.state && ','} ${candidateDetails.country}`}</span></Tippy></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-xxl-9 col-xl-7 col-lg-7">
                                <div className="card">
                                    <div className="tab-style-three mb-25">
                                        <ul className="nav nav-pills gap-10 b-bottom2px b-color-primary mobile-nav" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="pills-officers-tab" data-bs-toggle="pill" data-bs-target="#pills-officers" type="button" role="tab" aria-controls="pills-officers" aria-selected="false" tabIndex={1}>Applied Jobs</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-reference-tab" data-bs-toggle="pill" data-bs-target="#pills-reference" type="button" role="tab" aria-controls="pills-reference" aria-selected="false" tabIndex={1}>References</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane show active" id="pills-officers" role="tabpanel" aria-labelledby="pills-officers-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Applied Jobs (0)</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    S/N
                                                                </th>
                                                                <th>Job Title</th>
                                                                <th>Date Applied</th>
                                                                <th>Location</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        </tbody>
                                                    </table>
                                                    {
                                                        appliedJobs.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                            <span className="px-6 py-4 text-left font-medium text-black">This candidate hasn't applied for any job</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade" id="pills-reference" role="tabpanel" aria-labelledby="pills-reference-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Reference (0)</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    S/N
                                                                </th>
                                                                <th>Name</th>
                                                                <th>Contact</th>
                                                                <th>Reference Type</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        </tbody>
                                                    </table>
                                                    {
                                                        appliedJobs.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                            <span className="px-6 py-4 text-left font-medium text-black">This candidate hasn't added any reference</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                    
            </div>
        </div>
    )
}