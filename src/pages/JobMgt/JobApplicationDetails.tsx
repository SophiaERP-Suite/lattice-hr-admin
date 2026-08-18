import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Star,
  StarIcon,
  CheckCheck,
  Eye,
  FileSignature,
  Mic,
  MicOff,
  UserX,
  UserPlus,
  ClipboardEdit,
  ChevronRight
} from "lucide-react";

import { type CandidateReferences, type ApplicationTimelineDto, getTimelineStyle } from "../../types/JobApplication";
import type { JobApplicationDto } from "./JobApplications";
import Modal from "../../components/modal";
import { ApplicationFeedback, GetOffer, getReferencesByJobSeekerId, GetResponses, JobApplication, JobApplicationTimeline, UpdateApplicationStatus } from "../../utils/JobApplicationRequests";
import type { CandidateInterviewResponseDto } from "../../types/Interview";
import type { InductionAssignment, InductionCategory } from "../../types/induction";
import { AssignInductionProgramme, getInductionAssigmentsByJobSeekerId, getInductionCategories, ReassignInductionProgramme, UnassignInductionProgramme } from "../../utils/InductionRequests";
import { getJobById } from "../../utils/JobRequests";
import type { JobData } from "../../types/jobData";

const BASE_URL = import.meta.env.VITE_API_URL;

type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired"
  | "interview"
  | "selfInterview";

type ModalType = "assign" | "unassign" | "re-assign" | null;

const JobApplicationDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplicationDto>();
  const [intResponse, setIntResponse] = useState<CandidateInterviewResponseDto>();
  const [references, setReferences] = useState<CandidateReferences[]>();
  const [applicationTimeline, setApplicationTimeline] = useState<ApplicationTimelineDto[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [error, setError] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [employerId, setEmployerId] = useState<number>(0);
  const [jobSeekerId, setJobSeekerId] = useState<number>(0);
  const [jobId, setJobId] = useState<number>(0);
  const [assignmentId, setAssignmentId] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'resume' | 'notes' | 'interview'>('details');
  const [hasOffer, setHasOffer] = useState(false);
  const [inductionCategories, setInductionCategories] = useState<InductionCategory[]>([]);
  const [inductionAssignments, setInductionAssignments] = useState<InductionAssignment[]>([]);
  const [job, setJob] = useState<JobData>();

  const hashIds = new Hashids('LatticeHumanResourceEncode', 10);

  const applicationId = useMemo(() => {
    return params.id ? Number(hashIds.decode(params.id)[0]) : null;
  }, [params.id]);

  // --- Initial load ---
  useEffect(() => {
    if (!applicationId) return;
    fetchApplicationDetails();
    fetchApplicationTimeline();
    checkForOffer();
  }, [applicationId]);

  // --- Runs after applicationDetails loads and sets employerId/jobSeekerId ---
  useEffect(() => {
    if (jobSeekerId) {
      getCandidateReferences();
      fetchJobSeekerAssignedProgrammes();
    }
  }, [jobSeekerId]);

  useEffect(() => {
    if (employerId) {
      fetchInductionCategories();
    }
  }, [employerId]);

  useEffect(() => {
    if (jobId && jobSeekerId) {
      fetchResponses();
      fetchJobDetails()
    }
  }, [jobId, jobSeekerId]);

  // --- Fetchers ---

  const fetchApplicationDetails = async () => {
    try {
      setIsLoading(true);
      const response = await JobApplication(Number(applicationId));
      if (response.statusCode === 200) {
        setApplication(response.data);
        setEmployerId(response.data.jobData.employerId);
        setJobSeekerId(response.data.jobSeekerId);
        setJobId(response.data.jobId);
        setRating(response.data.rating);
        setNotes(response.data.comment || "");
      } else {
        setError("Failed to load application details");
      }
    } catch {
      setError("Failed to load application details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicationTimeline = async () => {
    try {
      const response = await JobApplicationTimeline(Number(applicationId));
      if (response.length > 0) {
        setApplicationTimeline(response);
      }
    } catch (err) {
      console.error("Failed to load timeline", err);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await getJobById(jobId);

      const data = await response.json()
      console.log("job", data)
      if (response.status === 200) {
        setJob(data.data);
      }
    } catch {
      setError("Could not fetch job details");
    }
  };

  const checkForOffer = async () => {
    try {
      const response = await GetOffer(Number(applicationId));
      setHasOffer(response.statusCode === 200);
    } catch {
      setHasOffer(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await GetResponses(Number(jobId), Number(jobSeekerId));
      if (response.statusCode === 200) {
        setIntResponse(response.data);
      }
    } catch (err) {
      console.error("Failed to load interview response", err);
    }
  };

  const fetchInductionCategories = async () => {
    try {
      const response = await getInductionCategories(employerId);
      if (response) {
        setInductionCategories(response.data || []);
      } else {
        setInductionCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
      setInductionCategories([]);
    }
  };

  const fetchJobSeekerAssignedProgrammes = async () => {
    try {
      const response = await getInductionAssigmentsByJobSeekerId(Number(jobSeekerId), employerId);
      if (response.statusCode === 200) {
        setInductionAssignments(response.data);
      } else {
        setInductionAssignments([]);
      }
    } catch {
      setInductionAssignments([]);
    }
  };

  const getCandidateReferences = async () => {
    try {
      const response = await getReferencesByJobSeekerId(jobSeekerId);
      if (response.length > 0) {
        setReferences(response);
      }
    } catch (err) {
      console.error("Failed to load references", err);
    }
  };

  // --- Actions ---

  const saveNotes = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('ApplicationId', String(applicationId));
      formData.append('Rating', String(rating));
      formData.append('Comment', notes);

      const response = await ApplicationFeedback(formData);
      if (response.success === 200 || response.status === true) {
        toast.success(response.message || 'Notes saved successfully');
        fetchApplicationDetails();
      } else {
        toast.error(response.message || 'Failed to save notes');
      }
    } catch {
      toast.error('Something went wrong while saving notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateApplicationStatus = async (status: number, successMessage: string) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('ApplicationId', String(applicationId));
      formData.append('Status', String(status));

      const response = await UpdateApplicationStatus(formData);
      console.log("hhe", response)
      if (response.status === 200) {
        toast.success(successMessage);
        fetchApplicationDetails();
        fetchApplicationTimeline();
      } else {
        toast.error("Failed to update application status");
      }
    } catch {
      toast.error('Something went wrong while updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const rejectApp = () => updateApplicationStatus(4, "Application rejected successfully");
  const reviewedApp = () => updateApplicationStatus(1, "Application marked as reviewed");
  const shorlistApp = () => updateApplicationStatus(2, "Applicant shortlisted successfully");
  const hireApp = () => updateApplicationStatus(5, "Applicant marked as hired");
  const interviewApp = () => updateApplicationStatus(3, "Applicant moved to interview stage");
  const selfInterviewApp = () => updateApplicationStatus(7, "Applicant moved to self-interview stage");

  const downloadResume = () => {
    if (application?.resume) {
      window.open(`${BASE_URL}/${application.resume}`, '_blank');
    }
  };

  const navigateToJobOffer = () => {
    if (hasOffer) {
      navigate(`/JobOfferDetails/${hashIds.encode(String(applicationId))}/${params.clientId}`);
    } else {
      navigate(`/JobOfferForm/${hashIds.encode(String(applicationId))}/${params.clientId}`);
    }
  };

  // --- Induction Action ---

  const AssignInduction = async (data: { dropdownValue?: string }) => {
    try {
      setIsModalLoading(true);
      const formData = new FormData();
      formData.append("JobSeekerId", jobSeekerId.toString());
      formData.append("InductionCategoryId", data.dropdownValue?.toString() || "");
      console.log("dsfsd", employerId)
      const response = await AssignInductionProgramme(formData, employerId);
      if (response.statusCode === 200) {
        toast.success("Induction programme assigned successfully");
      } else {
        toast.error("Failed to assign induction programme");
      }
    } catch (error) {
      console.error("Failed to assign programme", error);
      toast.error("Something went wrong while assigning programme");
    } finally {
      setIsModalLoading(false);
      fetchJobSeekerAssignedProgrammes();
      closeModal();
    }
  };

  const handleUnassignInduction = async () => {
    try {
      setIsModalLoading(true);
      const response = await UnassignInductionProgramme(Number(assignmentId), employerId);
      if (response.statusCode === 200) {
        toast.success("Induction programme unassigned successfully");
      } else {
        toast.error("Failed to unassign induction programme");
      }
    } catch (error) {
      console.error("Failed to unassign programme", error);
      toast.error("Something went wrong while unassigning programme");
    } finally {
      setIsModalLoading(false);
      fetchJobSeekerAssignedProgrammes();
      closeModal();
    }
  };

  const handleReassignInduction = async () => {
    try {
      setIsModalLoading(true);
      const response = await ReassignInductionProgramme(Number(assignmentId), employerId);
      if (response.statusCode === 200) {
        toast.success("Induction programme re-assigned successfully");
      } else {
        toast.error("Failed to re-assign induction programme");
      }
    } catch (error) {
      console.error("Failed to re-assign programme", error);
      toast.error("Something went wrong while re-assigning programme");
    } finally {
      setIsModalLoading(false);
      fetchJobSeekerAssignedProgrammes();
      closeModal();
    }
  };

  // --- Modal helpers ---

  const openAssignModal = () => setModalType("assign");
  const openUnassignModal = (id: number) => { setModalType("unassign"); setAssignmentId(id); };
  const openReassignModal = (id: number) => { setModalType("re-assign"); setAssignmentId(id); };
  const closeModal = () => setModalType(null);

  // --- Status badge ---

  const statusConfig = {
    pending: { class: 'bg-warning', icon: Clock, text: 'Pending' },
    reviewed: { class: 'bg-info', icon: CheckCircle, text: 'Reviewed' },
    shortlisted: { class: 'bg-success', icon: Star, text: 'Shortlisted' },
    rejected: { class: 'bg-danger', icon: XCircle, text: 'Rejected' },
    hired: { class: 'bg-info', icon: Briefcase, text: 'Hired' },
    interview: { class: 'bg-primary', icon: User, text: 'Interview' },
    selfInterview: { class: 'bg-primary', icon: User, text: 'Self Interview' }
  } as const;

  const getStatusBadge = (status: ApplicationStatus) => {
    const config = statusConfig[status] || { class: 'bg-secondary', icon: AlertCircle, text: status || 'Unknown' };
    const Icon = config.icon;
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`} style={{ width: 'fit-content' }}>
        <Icon size={14} />
        {config.text}
      </span>
    );
  };

  // --- Loading state ---

  if (isLoading) {
    return (
      <div className="app-content-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="page-title-box d-flex-between flex-wrap gap-15">
                <h1 className="page-title fs-18 lh-1">Application Details</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-example1 mb-0">

                    <li className="breadcrumb-item active">Application Details</li>
                    <ChevronRight size={15} style={{ position: "relative", top: "3px" }} />

                    <li className="breadcrumb-item">
                      <NavLink to={`/ClientMgt/${params.clientId}`}>Client Mgt</NavLink>
                    </li>
                    <ChevronRight size={15} style={{ position: "relative", top: "3px" }} />
                    <li className="breadcrumb-item">
                      <NavLink to={`/ClientMgt/${params.clientId}`}>Client Mgt</NavLink>
                    </li>

                    <ChevronRight size={15} style={{ position: "relative", top: "3px" }} />
                    <li className="breadcrumb-item"><NavLink to="/dashboard">Dashboard</NavLink></li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="placeholder-wave">
                    <span className="placeholder col-8 bg-secondary mb-4" style={{ height: '40px' }}></span>
                    <div className="d-flex gap-4 mb-4">
                      <span className="placeholder col-2 bg-secondary" style={{ height: '80px', width: '80px', borderRadius: '50%' }}></span>
                      <div className="flex-grow-1">
                        <span className="placeholder col-4 bg-secondary mb-2" style={{ height: '24px', display: 'block' }}></span>
                        <span className="placeholder col-3 bg-secondary" style={{ height: '20px', display: 'block' }}></span>
                      </div>
                    </div>
                    <span className="placeholder col-12 bg-secondary mb-2" style={{ height: '20px' }}></span>
                    <span className="placeholder col-12 bg-secondary mb-2" style={{ height: '20px' }}></span>
                    <span className="placeholder col-8 bg-secondary" style={{ height: '20px' }}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---

  if (error || !application) {
    return (
      <div className="app-content-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="page-title-box d-flex-between flex-wrap gap-15">
                <h1 className="page-title fs-18 lh-1">Application Details</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-example1 mb-0">
                    <li className="breadcrumb-item">
                      <NavLink to={`/JobDetails/JobApplications/JobApplicationDetails/${params.id}/${params.clientId}`}>
                        Job Application Details
                      </NavLink>
                    </li>
                    <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                    <li className="breadcrumb-item">
                      <NavLink to={`/JobDetails/JobApplications/${params.id}/${params.clientId}`}>
                        Job Applications
                      </NavLink>
                    </li>
                    <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                    <li className="breadcrumb-item"><NavLink to={`/ClientMgt/${params.clientId}`}>Client Management</NavLink></li>
                    <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                    <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <AlertCircle size={48} className="text-danger mb-3" />
                  <h5 className="text-dark mb-2">Error Loading Application</h5>
                  <p className="text-muted mb-3">{error || "Application not found"}</p>
                  <button className="btn btn-info" onClick={() => navigate(-1)}>Go Back</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main render ---

  return (
    <div className="app-content-wrap">
      <ToastContainer />

      <Modal
        isOpen={modalType === "unassign"}
        title="Unassign Induction Programme"
        message="Are you sure you want to unassign this induction programme? The candidate will lose access."
        confirmText="Unassign"
        cancelText="Cancel"
        confirmColor="danger"
        buttonIcon={<UserX size={16} />}
        headerIcon={<AlertCircle size={20} />}
        loading={isModalLoading}
        onConfirm={handleUnassignInduction}
        onCancel={closeModal}
      />

      <Modal
        isOpen={modalType === "re-assign"}
        title="Re-assign Induction Programme"
        message="Are you sure you want to re-assign this induction programme? The candidate will regain access."
        confirmText="Re-assign"
        cancelText="Cancel"
        confirmColor="warning"
        buttonIcon={<UserPlus size={16} />}
        headerIcon={<AlertCircle size={20} />}
        loading={isModalLoading}
        onConfirm={handleReassignInduction}
        onCancel={closeModal}
      />

      <Modal
        isOpen={modalType === "assign"}
        title="Assign Induction Programme"
        message="Assign an induction programme to this candidate."
        confirmText="Assign Programme"
        cancelText="Cancel"
        confirmColor="success"
        dropdownLabel="Induction Programmes"
        dropdownOptions={inductionCategories.map((item) => ({
          label: item.name,
          value: item.inductionCategoryId,
        }))}
        defaultDropdownValue="Draft"
        buttonIcon={<CheckCheck size={16} />}
        headerIcon={<UserPlus size={20} />}
        loading={isModalLoading}
        onConfirm={AssignInduction}
        onCancel={closeModal}
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1">Application Details</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item">
                    <NavLink to={`/JobDetails/JobApplications/JobApplicationDetails/${params.id}/${params.clientId}`}>
                      Job Application Details
                    </NavLink>
                  </li>
                  <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item">
                    <NavLink to={`/JobDetails/JobApplications/${params.id}/${params.clientId}`}>
                      Job Applications
                    </NavLink>
                  </li>
                  <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item"><NavLink to={`/ClientMgt/${params.clientId}`}>Client Management</NavLink></li>
                  <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Header with Actions */}
          <div className="col-lg-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-15">
                  <div className="d-flex align-items-center gap-15">
                    <h4 className="mb-0">{application.jobTitle}</h4>
                    {getStatusBadge(application.status)}
                  </div>

                  <div className="d-flex flex-wrap gap-10">
                    {application.resume && (
                      <button className="btn btn-outline-success" onClick={downloadResume}>
                        <Download size={16} className="me-2" />
                        Download Resume
                      </button>
                    )}

                    <button
                      className={`btn ${hasOffer ? 'btn-outline-info' : 'btn-success'}`}
                      onClick={navigateToJobOffer}
                    >
                      {hasOffer ? (
                        <><Eye size={16} className="me-2" />View Job Offer</>
                      ) : (
                        <><FileSignature size={16} className="me-2" />Create Job Offer</>
                      )}
                    </button>

                    <div className="dropdown">
                      <button
                        className="btn btn-info dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <><span className="spinner-border spinner-border-sm me-2" />Updating...</>
                        ) : "Update Status"}
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item" onClick={reviewedApp} disabled={application.status === 'reviewed' || isUpdating}>
                            <CheckCircle size={16} className="me-2 text-info" />Mark as Reviewed
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={shorlistApp} disabled={application.status === 'shortlisted' || isUpdating}>
                            <Star size={16} className="me-2 text-success" />Shortlist Candidate
                          </button>
                        </li>
                        {job && job.hasInterview &&
                          <li>
                            <button className="dropdown-item" onClick={selfInterviewApp} disabled={application.status === 'selfInterview' || isUpdating}>
                              <ClipboardEdit size={16} className="me-2 text-success" />Move to Self Interview
                            </button>
                          </li>
                        }
                        <li>
                          <button className="dropdown-item" onClick={interviewApp} disabled={application.status === 'interview' || isUpdating}>
                            <User size={16} className="me-2 text-success" />Move to Interview
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={hireApp} disabled={application.status === 'hired' || isUpdating}>
                            <Briefcase size={16} className="me-2 text-info" />Mark as Hired
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item text-danger" onClick={rejectApp} disabled={application.status === 'rejected' || isUpdating}>
                            <XCircle size={16} className="me-2" />Reject Application
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                      <User size={16} className="me-2" />Candidate Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
                      <FileText size={16} className="me-2" />Resume & Cover Letter
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                      <StarIcon size={16} className="me-2" />Rating & Comment
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>
                      <Mic size={16} className="me-2" />Self Interview
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <>
                    <div className="d-flex align-items-center gap-20 mb-4" style={{ marginTop: "20px" }}>
                      <div className="avatar avatar-xl">
                        <img
                          src={
                            !application.jobSeeker.profilePhoto
                              ? "https://img.icons8.com/color/48/gender-neutral-user.png"
                              : `http://localhost:5127/${application.jobSeeker.profilePhoto}`
                          }
                          alt={application.applicantName}
                          className="radius-100"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h3 className="mb-5">{application.applicantName}</h3>
                        <div className="d-flex flex-wrap gap-15 text-black">
                          <span className="d-flex align-items-center gap-5">
                            <Mail size={14} />{application.jobSeeker.email}
                          </span>
                          <span className="d-flex align-items-center gap-5">
                            <Phone size={14} />{application.jobSeeker.phone}
                          </span>
                          <span className="d-flex align-items-center gap-5">
                            <MapPin size={14} />
                            {application.jobSeeker.city}, {application.jobSeeker.state}, {application.jobSeeker.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h5 className="mb-3">Application Information</h5>
                        <p className="mb-2">
                          <strong>Applied Date:</strong>{' '}
                          {new Date(application.applDate).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <hr className="my-4" />

                    {references && references.length > 0 && (
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <h5 className="mb-2">Reference{references.length > 1 ? "s" : ""}</h5>
                          {references.map((ref) => (
                            <div
                              key={ref.referenceId}
                              className="verification-item mb-20 p-15"
                              style={{ border: "1px solid #E5E7EB", borderRadius: "8px", marginTop: "15px" }}
                            >
                              <div className="row align-items-center">
                                <div className="col-md-12">
                                  <div className="d-flex align-items-start gap-15">
                                    <div>
                                      <h5 className="mb-5" style={{ color: "blue" }}>
                                        {ref.lastName || "_"} {ref.firstName || "_"}
                                      </h5>
                                      <p className="text-black mb-5" style={{ fontSize: "14px" }}>{ref.description || "_"}</p>
                                      <a href={`mailto:${ref.email}`} className="text-black mb-5" style={{ fontSize: "14px" }}>
                                        <Mail size={14} /> {ref.email || "_"}
                                      </a>
                                      <p className="text-black mb-5" style={{ fontSize: "14px" }}>
                                        <Phone size={14} /> {ref.phone || "_"}
                                      </p>
                                      <span className="badge bg-warning">{ref.referenceType || "_"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Resume Tab */}
                {activeTab === 'resume' && (
                  <>
                    {application.coverLetter && (
                      <div className="mb-4" style={{ marginTop: "20px" }}>
                        <h5 className="mb-3">Cover Letter</h5>
                        <div className="p-4 rounded">
                          <p className="mb-0">{application.coverLetter}</p>
                        </div>
                      </div>
                    )}

                    {application.resume ? (
                      <div style={{ marginTop: "20px" }}>
                        <h5 className="mb-3">Resume</h5>
                        <iframe
                          src={`${BASE_URL}/${application.resume}`}
                          style={{ width: '100%', height: '600px', border: '1px solid #dee2e6', borderRadius: '4px' }}
                          title="Resume"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <FileText size={48} className="text-muted mb-3" />
                        <p className="text-muted">No resume uploaded</p>
                      </div>
                    )}
                  </>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <>
                    <div style={{ marginTop: "20px" }} className="mb-4">
                      <span className="text-danger">
                        <AlertCircle size={13} /> Adding a new comment will replace the existing one
                      </span>
                      <br />
                      <h5 className="mb-3 mt-3">Rating</h5>
                      <div className="d-flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="btn btn-link p-0"
                            onClick={() => setRating(star)}
                            disabled={isUpdating}
                          >
                            <Star
                              size={24}
                              className={star <= rating ? 'text-warning' : 'text-muted'}
                              fill={star <= rating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-3">Comments</h5>
                      <textarea
                        className="form-control"
                        rows={6}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your comments about this candidate..."
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="d-flex justify-content-end">
                      <button className="btn btn-success" onClick={saveNotes} disabled={isUpdating}>
                        {isUpdating ? (
                          <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                        ) : (
                          <><CheckCheck size={16} className="me-2" />Save Comment</>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {/* Interview Tab */}
                {activeTab === 'interview' && (
                  <div style={{ marginTop: "20px" }} className="mb-4">
                    <h5 className="mb-3 d-flex align-items-center gap-2">
                      <Mic size={18} className="text-info" />
                      Candidate Self-Interview Response
                    </h5>
                    {intResponse?.audioUrl ? (
                      <div className="border rounded p-4">
                        <p className="text-black mb-2 fs-13 d-flex align-items-center gap-1">
                          <Mic size={13} /> Audio Response
                        </p>
                        <audio controls style={{ width: "100%" }} src={`${BASE_URL}/${intResponse.audioUrl}`}>
                          Your browser does not support the audio element.
                        </audio>
                        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                          {intResponse?.dateCreated && (
                            <small className="text-muted d-flex align-items-center gap-1">
                              <Clock size={12} />
                              Submitted:{" "}
                              {new Date(intResponse.dateCreated).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </small>
                          )}
                          <a
                            href={`${BASE_URL}/${intResponse.audioUrl}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                          >
                            <Download size={14} /> Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded p-4 d-flex align-items-center gap-3">
                        <div className="bg-secondary bg-opacity-10 rounded-circle p-3">
                          <MicOff size={24} className="text-black" />
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold text-muted">No response submitted</p>
                          <small className="text-muted">
                            This candidate has not completed their self-interview yet.
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {inductionAssignments.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h3>Assigned Induction Programme{inductionAssignments.length > 1 ? "s" : ""}</h3>
                </div>
                <div className="card-body mt-15">
                  {inductionAssignments.map((item) => {
                    const total = item.totalItemCount ?? 0;
                    const completed = item.completedItemCount ?? 0;
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                    const barColor = pct === 100 ? "#22c55e" : pct >= 50 ? "#3b82f6" : "#f59e0b";
                    const badgeClass = item.status === "Completed" ? "bg-success" : item.status === "InProgress" ? "bg-primary" : "bg-warning";

                    return (
                      <div key={item.assignmentId} className="border rounded p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">{item.categoryName}</h5>
                            <span className={`badge mt-10 ${badgeClass}`} style={{ fontSize: 11 }}>
                              {item.status}
                            </span>
                          </div>
                          <div className="d-flex gap-2">
                            {item.assigned ? (
                              <button
                                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                onClick={() => openUnassignModal(item.assignmentId)}
                              >
                                <UserX size={14} /> Unassign
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                onClick={() => openReassignModal(item.assignmentId)}
                              >
                                <UserPlus size={14} /> Re-assign
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-black">{completed} of {total} items completed</small>
                          <small className="fw-semibold" style={{ color: barColor }}>{pct}%</small>
                        </div>
                        <div className="progress mb-3" style={{ height: 6 }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${pct}%`, background: barColor, transition: "width 0.4s" }}
                          />
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                          <small className="text-black">
                            <strong>Assigned:</strong>{" "}
                            {new Date(item.dateAssigned).toLocaleString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </small>
                          {item.status === "Completed" && (
                            <small className="text-success">
                              <strong>Completed:</strong>{" "}
                              {new Date(item.dateCompleted).toLocaleString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-xl-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body mt-15">
                <div className="d-grid gap-10">
                  <button className="d-none btn-modified btn-outline-info text-start" onClick={() => navigate(`/schedule-interview/${params.id}`)}>
                    <Calendar size={16} className="me-2" />Schedule Interview
                  </button>
                  {hasOffer && (
                    <button className="btn-modified btn-outline-success text-start" onClick={openAssignModal}>
                      <UserPlus size={16} className="me-2" />Assign Induction Programme
                    </button>
                  )}
                  <button
                    className="btn-modified btn-outline-info text-start"
                    onClick={() => window.location.href = `mailto:${application.jobSeeker.email}`}
                  >
                    <Mail size={16} className="me-2" />Send Email
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Application Timeline</h5>
              </div>
              <div className="card-body pt-3">
                <div className="timeline-wrapper">
                  <ul className="timeline">
                    {applicationTimeline?.map((item) => {
                      const style = getTimelineStyle(item.eventType);
                      return (
                        <li key={item.timelineId} className="timeline-item">
                          <div className="timeline-content">
                            <h6>{style.title}</h6>
                            {item.description && <p className="mb-1">{item.description}</p>}
                            <p className="text-muted mb-0">
                              {new Date(item.dateCreated).toLocaleString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                            <small className="text-muted">By {item.createdByName ?? "System"}</small>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .timeline { position: relative; padding-left: 0; list-style: none; }
        .timeline-item { position: relative; padding-bottom: 20px; padding-left: 20px; border-left: 2px solid #dee2e6; }
        .timeline-item:last-child { padding-bottom: 0; border-left: 2px solid transparent; }
        .timeline-content { padding-left: 10px; }
        .timeline-item::before { content: ''; position: absolute; left: -8px; top: 0; width: 14px; height: 14px; border-radius: 50%; background: #0dcaf0; border: 2px solid white; }
      `}</style>
    </div >
  );
};

export default JobApplicationDetails;