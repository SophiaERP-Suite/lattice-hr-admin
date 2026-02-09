import {
    Blocks,
    BriefcaseBusiness,
  ChevronRight,
  Eye,
  GlobeLock,
  Layers,
  LocateFixed,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
  VectorSquare,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import { fetchEmployerById } from "../../utils/EmployerRequests";
import Tippy from "@tippyjs/react";
import { fetchAllJobs, updateJob } from "../../utils/JobRequests";
import { toast, ToastContainer } from "react-toastify";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { fetchAllOfficers } from "../../utils/OfficerRequests";

interface EmployerData {
  employerId: number;
  businessName: string;
  jobSectorId: string;
  jobSector: string;
  companySize: string;
  registrationNo: string;
  websiteUrl: string;
  employerLogo: string;
  countryId: string;
  country: string;
  packageId: string;
  package: string;
  packageItemReference: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  address: string;
  postCode: string;
  companyMail: string;
  companyPhone: string;
  dateCreated: string;
  officers: string;
  jobsPosted: string;
}

interface JobData {
  jobId: number;
  jobTitle: string;
  jobDescription: string;
  employerId: string;
  employer: string;
  jobSectorId: string;
  jobSector: string;
  jobTypeId: string;
  jobType: string;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  published: boolean
  publishedDate: string;
  dateCreated: string;
}

interface OfficerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateCreated: string;
    email: string;
    phone: string;
    gender: string;
    profilePhoto: string;
    position: string;
}

export default function ClientDetails() {
    const { id } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [employerDetails, setEmployerDetails] = useState<EmployerData | null>(null);
    const [totalJobs, setTotalJobs] = useState(0);
    const [jobPageNumber, setJobPageNumber] = useState(1);
    const jobLimit = 10
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [totalOfficers, setTotalOfficers] = useState(0);
    const [officePageNumber, setOfficePageNumber] = useState(1);
    const officerLimit = 10
    const [officers, setOfficers] = useState<OfficerData[]>([]);
    
    useEffect(() => {
        fetchEmployerById(hashedId)
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    console.log(data);
                    setEmployerDetails(data.data);
                })
            } else {
                res.text()
                .then(data => {
                    console.log(JSON.parse(data));
                })
            }
        })
    }, [hashedId]);

    useEffect(() => {
        fetchAllJobs({
            pageNumber: jobPageNumber,
            limit: jobLimit,
            employerId: hashedId
        })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setJobs(data.data.jobs);
                setTotalJobs(data.data.totalCount);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
    }, [jobPageNumber, jobLimit, hashedId]);

    useEffect(() => {
        fetchAllOfficers({
            pageNumber: officePageNumber,
            limit: officerLimit,
            employerId: hashedId
        })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setOfficers(data.data.officers);
                setTotalOfficers(data.data.totalCount);
            })
        } else {
            res.text()
            .then(data => {
                console.log(JSON.parse(data));
            })
        }
        })
    }, [officePageNumber, officerLimit, hashedId]);

    const refetchJobs = async () => {
        try {
            const res = await fetchAllJobs({
                pageNumber: jobPageNumber,
                limit: jobLimit,
                employerId: hashedId
            });
            if (res.status === 200) {
                const data = await res.json()
                setJobs(data.data.jobs);
                setTotalJobs(data.data.totalCount);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateJobStatus = async (jobId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("Published", String(status));
        const res = await updateJob(jobId, formData);
        handleCreateEmployee(res, null, null, { toast }, null)
        .finally(async () => {
            await refetchJobs();
        });
    }

    return (
        <div className="container-fluid">
            <ToastContainer />
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Client Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/ClientMgt/${id}`}>
                                        Client Details
                                    </NavLink>
                                </li>
                                 <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/ClientMgt">
                                        Client Management
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
                    employerDetails && (
                        <>
                            <div className="col-xxl-3 col-xl-5 col-lg-5">
                                <div className="sidebar-sticky">
                                    <div className="card">
                                        <div className="company-info">
                                            <div className="company-logo">
                                                <img src={employerDetails.employerLogo} alt="image not found" />
                                            </div>
                                            <h2 className="company-name mb-15">{ employerDetails.businessName }</h2>

                                            <div className="company-info-list mb-25">
                                                <ul>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Mail /></span> <Tippy content="Company Mail"><span style={{ textWrap: 'wrap'}}>{employerDetails.companyMail ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Phone /></span> <Tippy content="Company Phone"><span style={{ textWrap: 'wrap'}}>{employerDetails.companyPhone ?? 'None Provided'}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><BriefcaseBusiness /></span> <Tippy content="Job Sector"><span style={{ textWrap: 'wrap'}}>{employerDetails.jobSector}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><MapPinHouse /></span> <Tippy content="Address"><span style={{ textWrap: 'wrap'}}>{employerDetails.address && `${employerDetails.address}, `} { `${employerDetails.city}${employerDetails.city && ','} ${employerDetails.state}${employerDetails.state && ','} ${employerDetails.country}`}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><LocateFixed /></span> <Tippy content="Postcode"><span style={{ textWrap: 'wrap'}}>{employerDetails.postCode}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><GlobeLock /></span> <Tippy content="Website"><a href={employerDetails.websiteUrl} target="_blank" style={{ textWrap: 'wrap'}}>{employerDetails.websiteUrl}</a></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><VectorSquare /></span> <Tippy content="Company Size"><span style={{ textWrap: 'wrap'}}>{employerDetails.companySize}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Layers /></span> <Tippy content="Registration No"><span style={{ textWrap: 'wrap'}}>{employerDetails.registrationNo}</span></Tippy></li>
                                                    <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Blocks /></span> <Tippy content="Current Package"><span style={{ textWrap: 'wrap'}}>{employerDetails.package ?? 'No Package'}</span></Tippy></li>
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
                                                <button className="nav-link active" id="pills-officers-tab" data-bs-toggle="pill" data-bs-target="#pills-officers" type="button" role="tab" aria-controls="pills-officers" aria-selected="false" tabIndex={1}>Responsibility Officers</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-jobs-tab" data-bs-toggle="pill" data-bs-target="#pills-jobs" type="button" role="tab" aria-controls="pills-jobs" aria-selected="false" tabIndex={1}>Jobs Posted</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane show active" id="pills-officers" role="tabpanel" aria-labelledby="pills-officers-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Responsibility Officers ({totalOfficers})</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">S/N</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Contact</th>
                                                                <th scope="col">Position</th>
                                                                <th scope="col">Join Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                officers.map((data, index) => {
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
                                                                            <td>
                                                                                <a href={`mailto:${data.email}`} className="text-start" data-cfemail="bad9d5d4cedbd9cefadbd9d7df94d9d5d7">{ data.email }</a>
                                                                                <br />
                                                                                <span>{ data.phone }</span>
                                                                            </td>
                                                                            <td>{ data.position }</td>
                                                                            <td>{ (new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {
                                                        officers.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                            <span className="px-6 py-4 text-left font-medium text-black">This client hasn't added any responsibility officer</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <div className="flex justify-content-center align-items-center mb-1">
                                                        <p className="text-black">
                                                            Showing { officers.length > 0 ? ((officePageNumber * officerLimit) - officerLimit) + 1 : 0 } to { officers.length > 0 ? (((officePageNumber * officerLimit) - officerLimit) + 1) + (officers.length - 1) : 0 } of { totalOfficers } entries
                                                        </p>
                                                    </div>
                                                    <div className="d-inline-flex flex-wrap">
                                                        {
                                                            officePageNumber > 1 && <a
                                                                href="#"
                                                                onClick={() => { if (officePageNumber > 1) {setOfficePageNumber(officePageNumber - 1);} }}
                                                                className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                                            >
                                                                Previous
                                                            </a>
                                                        }
                                                        <a
                                                            href="#"
                                                            className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                                        >
                                                            { officePageNumber }
                                                        </a>
                                                        {
                                                            (officePageNumber * officerLimit) < totalOfficers && <a
                                                            href="#"
                                                            onClick={() => { setOfficePageNumber(officePageNumber + 1); }}
                                                            className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                                            >
                                                                Next
                                                            </a>
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-jobs" role="tabpanel" aria-labelledby="pills-jobs-tab" tabIndex={1}>
                                            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                                                <h4 className="">Jobs Posted ({totalJobs})</h4>
                                            </div>
                                            <div className="card-body pt-15">
                                                <div className="table-responsive">
                                                    <table id="dataTableDefault" className="table text-nowrap text-start">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    S/N
                                                                </th>
                                                                <th>Title</th>
                                                                <th>Published</th>
                                                                <th>Location</th>
                                                                <th>Date Created</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                jobs.map((data, index) => {
                                                                    return (
                                                                        <tr key={data.jobId ?? index}>
                                                                            <td>{ index + 1 }</td>
                                                                            <td>{data.jobTitle}</td>
                                                                            <td>
                                                                                <div
                                                                                    className={`toggle-switch ${data.published ? 'on' : ''}`}
                                                                                    onClick={() => updateJobStatus(data.jobId, !data.published)}
                                                                                    >
                                                                                    <div className="toggle-knob" />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ maxWidth: '200px', textWrap: 'wrap'}}>
                                                                                <p>{ `${data.city} ${data.city && ','} ${data.state} ${data.state && ','} ${data.country}`}</p>
                                                                            </td>
                                                                            <td>{(new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                                            <td>
                                                                                <div className="d-flex-items gap-10">
                                                                                    <Tippy content="Preview Job">
                                                                                        <NavLink className="btn-icon btn-info-light" to={`/JobMgt/${hashIds.encode(data.jobId)}`}>
                                                                                            <a><Eye /></a>
                                                                                        </NavLink>
                                                                                    </Tippy>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {
                                                        jobs.length === 0 ?
                                                            <div className="py-4 whitespace-nowrap w-full">
                                                            <span className="px-6 py-4 text-left font-medium text-black">This client hasn't added any job</span>
                                                            </div> : <></>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between mt-4">
                                                    <div className="flex justify-content-center align-items-center mb-1">
                                                        <p className="text-black">
                                                            Showing { jobs.length > 0 ? ((jobPageNumber * jobLimit) - jobLimit) + 1 : 0 } to { jobs.length > 0 ? (((jobPageNumber * jobLimit) - jobLimit) + 1) + (jobs.length - 1) : 0 } of { totalJobs } entries
                                                        </p>
                                                    </div>
                                                    <div className="d-inline-flex flex-wrap">
                                                        {
                                                            jobPageNumber > 1 && <a
                                                                href="#"
                                                                onClick={() => { if (jobPageNumber > 1) {setJobPageNumber(jobPageNumber - 1);} }}
                                                                className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                                            >
                                                                Previous
                                                            </a>
                                                        }
                                                        <a
                                                            href="#"
                                                            className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                                        >
                                                            { jobPageNumber }
                                                        </a>
                                                        {
                                                            (jobPageNumber * jobLimit) < totalJobs && <a
                                                            href="#"
                                                            onClick={() => { setJobPageNumber(jobPageNumber + 1); }}
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
                        </>
                    )
                }
                    
            </div>
        </div>
    )
}