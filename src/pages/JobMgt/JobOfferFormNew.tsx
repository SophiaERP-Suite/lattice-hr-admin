import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import dayjs from 'dayjs';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Printer,
  Eye,
  Pen,
  Settings,
  Save
} from "lucide-react";

import { TermsType, type Terms } from "../../types/terms";
import type { JobData } from "./JobMgt";
import type { JobOfferResponseDto, OfferData } from "../../types/JobOffer";
import type { EmployerDetailsDto } from "../../types/employer";
import RichTextEditor from "../../layout/RichTextEditor";
import { GetOffer, JobApplication } from "../../utils/JobApplicationRequests";
import { fetchEmployerById } from "../../utils/EmployerRequests";
import { GetAllTerms } from "../../utils/TermsRequest";
import { getJobById } from "../../utils/JobRequests";
import { UpdateOffer, CreateJobOffer, SendJobOffer } from "../../utils/JobOfferRequest";

const WORK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_OF_WEEK_MAP: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
};

const JobOfferFormNew = () => {
  const params = useParams();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [jobOfferId, setJobOfferId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [application, setApplication] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [employerInfo, setEmployerInfo] = useState<EmployerDetailsDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'Draft' | 'Sent' | null>(null);
  const [termsList, setTermsList] = useState<Terms[]>([]);
  const [selectedTermsId, setSelectedTermsId] = useState<number>();
  const [employerId, setEmployerId] = useState<number>();
  const [job, setJob] = useState<JobData>();

  const [offerData, setOfferData] = useState<OfferData>({
    jobTitle: '',
    department: '',
    responsibeDepartment: '',
    responseInstructions: '',
    departmentPosition: '',
    introduction: '',
    letterTitle: '',
    level: '',
    terms: "",
    employmentType: '',
    salary: 0,
    netAnnualPay: '',
    netMonthlyPay: '',
    currencySymbol: '',
    startDate: dayjs().add(14, 'days').format('YYYY-MM-DD'),
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workStartTime: '',
    workEndTime: '',
    placeOfWork: '',
    benefits: '',
    otherInformation: '',
    reportingManager: '',
  });

  const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

  const applicationId = useMemo(() => {
    return params.id ? Number(hashIds.decode(params.id)[0]) : null;
  }, [params.id]);

  const clientId = useMemo(() => {
    return params.clientId ? Number(hashIds.decode(String(params.clientId))[0]) : null;
  }, [params.clientId]);

  // ── Initial Load ───────────────────────────────────────
  useEffect(() => {
    if (clientId) {
      fetchApplicationAndCheckOffer()
      fetchEmployerDetails()
      fetchTerms()
    }
    if (clientId) {
      fetchEmployerDetails();
    }
  }, [applicationId, employerId, clientId]);

  const fetchApplicationAndCheckOffer = async () => {
    try {
      setIsLoading(true)
      const appResponse = await JobApplication(Number(applicationId));
      if (appResponse.statusCode === 200) {
        setApplication(appResponse.data);

        setEmployerId(appResponse.data.jobData.employerId);
        const jobRes = await getJobById(appResponse.data.jobId);
        const data = await jobRes.json()
        if (data) {

          setJob(data.data);
          setOfferData(prev => ({
            ...prev,
            jobTitle: appResponse.data.jobTitle || '',
            department: data.data.jobSector || '',
            employmentType: data.data.jobType || '',
            salary: data.data.jobAmount || 0,
            currency: data.data.currencySymbol || '',
          }));
        }
      }

      try {
        const offerResponse = await GetOffer(Number(applicationId));
        console.log("log", offerResponse)
        if (offerResponse.statusCode === 200 && offerResponse.data) {
          setMode('edit');
          setJobOfferId(offerResponse.data.jobOfferId);
          populateOfferData(offerResponse.data);
        }
      } catch (error) {
        console.error(error)
      }
    } catch (err) {
      setError("Failed to load details");
    } finally {
      setIsLoading(false)
    }
  };

  const populateOfferData = (offer: JobOfferResponseDto) => {
    const workDays = (offer.workDays ?? []).map((d: number | string) =>
      typeof d === 'number' ? DAY_OF_WEEK_MAP[d] ?? String(d) : d
    );
    const toTime = (t: string) => (t ? t.substring(0, 5) : '');

    setOfferData(prev => ({
      ...prev,
      department: offer.department ?? prev.department,
      level: offer.level ?? prev.level,
      employmentType: offer.employmentType ?? prev.employmentType,
      reportingManager: offer.reportingManager ?? prev.reportingManager,
      responsibeDepartment: offer.responsibleDepartment ?? prev.responsibeDepartment,
      departmentPosition: offer.responsibleOfficer ?? prev.departmentPosition,
      salary: offer.grossAnnualSalary ?? prev.salary,
      netAnnualPay: offer.netAnnualPay != null ? String(offer.netAnnualPay) : prev.netAnnualPay,
      netMonthlyPay: offer.netMonthlyPay != null ? String(offer.netMonthlyPay) : prev.netMonthlyPay,
      benefits: offer.benefits ?? prev.benefits,
      letterTitle: offer.letterTitle ?? prev.letterTitle,
      terms: offer.terms ?? prev.terms,
      introduction: offer.introduction ?? prev.introduction,
      responseInstructions: offer.responseInstructions ?? prev.responseInstructions,
      otherInformation: offer.otherInformation ?? prev.otherInformation,
      workStartTime: toTime(offer.workStartTime),
      workEndTime: toTime(offer.workEndTime),
      startDate: offer.startDate ? dayjs(offer.startDate).format('YYYY-MM-DD') : prev.startDate,
      workDays: workDays.length > 0 ? workDays : prev.workDays,
      currencySymbol: offer.currencySymbol,
    }));
  };

  const fetchEmployerDetails = async () => {
    try {
      const response = await fetchEmployerById(Number(clientId));
      console.log("idddiid", clientId)

      const data = await response.json()
      console.log("idddiid2", data)
      setEmployerInfo(data.data);
    } catch { setEmployerInfo(null); }
  };

  const fetchTerms = async () => {
    try {
      const response = await GetAllTerms(Number(clientId));
      if (Array.isArray(response)) setTermsList(response);
    } catch { console.error('Failed to fetch terms'); }
  };

  // ── Helpers ────────────────────────────────────────────
  const handleInputChange = (field: keyof OfferData, value: string | number) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
  };

  const toggleWorkDay = (day: string) => {
    setOfferData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day],
    }));
  };

  const buildFormData = (status: 'Draft' | 'Sent'): FormData => {
    const fd = new FormData();

    if (applicationId) fd.append('JobApplicationId', String(applicationId));
    if (job?.jobId) fd.append('JobId', String(job.jobId));

    fd.append('JobTitle', offerData.jobTitle);
    fd.append('Department', offerData.department);
    fd.append('Level', offerData.level);
    fd.append('EmploymentType', offerData.employmentType);
    if (selectedTermsId) fd.append('TermsId', String(selectedTermsId));
    if (offerData.reportingManager) fd.append('ReportingManager', offerData.reportingManager);
    if (offerData.responsibeDepartment) fd.append('ResponsibleDepartment', offerData.responsibeDepartment);
    if (offerData.departmentPosition) fd.append('ResponsibleOfficer', offerData.departmentPosition);

    fd.append('Currency', offerData.currencySymbol);
    fd.append('GrossAnnualSalary', String(offerData.salary));
    if (offerData.netAnnualPay) fd.append('NetAnnualPay', String(offerData.netAnnualPay));
    if (offerData.netMonthlyPay) fd.append('NetMonthlyPay', String(offerData.netMonthlyPay));
    if (offerData.benefits) fd.append('Benefits', offerData.benefits);

    fd.append('StartDate', offerData.startDate);
    offerData.workDays.forEach(day => fd.append('WorkDays', day));
    fd.append('WorkStartTime', offerData.workStartTime);
    fd.append('WorkEndTime', offerData.workEndTime);
    if (offerData.placeOfWork) fd.append('PlaceOfWork', offerData.placeOfWork);

    fd.append('LetterTitle', offerData.letterTitle);
    fd.append('Introduction', offerData.introduction);
    fd.append('ResponseInstructions', offerData.responseInstructions);
    if (offerData.otherInformation) fd.append('OtherInformation', offerData.otherInformation);
    if (offerData.terms) fd.append('Terms', offerData.terms);

    fd.append('OfferStatus', status);
    fd.append('OfferDate', dayjs().format('YYYY-MM-DD'));
    fd.append('ExpiryDate', dayjs().add(7, 'days').format('YYYY-MM-DD'));

    return fd;
  };

  const validateOfferData = (): boolean => {
    const checks: [boolean, string][] = [
      [!!offerData.jobTitle, 'Job title is required'],
      [!!offerData.department, 'Department is required'],
      [!!offerData.level, 'Level is required'],
      [!!offerData.employmentType, 'Employment type is required'],
      [!!offerData.salary, 'Salary is required'],
      [!!offerData.startDate, 'Start date is required'],
      [!!offerData.workStartTime && !!offerData.workEndTime, 'Work hours are required'],
      [offerData.workDays.length > 0, 'At least one work day is required'],
      [!!offerData.letterTitle, 'Letter title is required'],
      [!!offerData.introduction, 'Letter introduction is required'],
      [!!offerData.responseInstructions, 'Response instructions are required'],
    ];
    for (const [ok, msg] of checks) {
      if (!ok) { setError(msg); return false; }
    }
    setError('');
    return true;
  };

  // ── Submit: Create or Update ───────────────────────────
  const handleSubmit = async (status: 'Draft' | 'Sent') => {
    if (!validateOfferData()) return;

    setIsSubmitting(true);
    setSubmitStatus(status);
    setError('');

    try {
      const fd = buildFormData(status);
      let response;

      if (mode === 'edit' && jobOfferId) {
        response = await UpdateOffer(jobOfferId, fd);
      } else {
        response = await CreateJobOffer(fd, Number(clientId));
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success(
          status === 'Sent'
            ? 'Job offer sent successfully!'
            : 'Job offer saved as draft!'
        );
        setShowTemplate(false);

        if (mode === 'create') {
          await fetchApplicationAndCheckOffer();
        }

        if (status === 'Sent') {
          navigate(`/jobApplicationDetails/${hashIds.encode(String(applicationId))}`);
        }
      } else {
        setError(response.message || 'Failed to save offer');
        toast.error(response.message || 'Failed to save offer');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitStatus(null);
    }
  };

  // ── Send existing draft ────────────────────────────────
  const handleSendDraft = async () => {
    if (!jobOfferId) {
      toast.warning("Draft does not exist")
      return
    };
    setIsSending(true);
    try {
      await SendJobOffer(jobOfferId);
      toast.success("Job offer sent successfully");
      navigate(`/JobDetails/JobApplicationDetails/${params.id}/${params.clientId}`);
    } catch {
      toast.error("Failed to send job offer");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { cls: string; icon: any; text: string }> = {
      create: { cls: 'bg-info', icon: AlertCircle, text: 'New Offer' },
      draft: { cls: 'bg-secondary', icon: AlertCircle, text: 'Draft' },
      sent: { cls: 'bg-primary', icon: Send, text: 'Sent' },
      accepted: { cls: 'bg-success', icon: CheckCircle, text: 'Accepted' },
      rejected: { cls: 'bg-danger', icon: XCircle, text: 'Rejected' },
      expired: { cls: 'bg-warning', icon: AlertCircle, text: 'Expired' },
    };
    const c = config[status?.toLowerCase()] || config.draft;
    const Icon = c.icon;
    return (
      <span className={`badge ${c.cls} d-flex align-items-center gap-1`} style={{ width: 'fit-content' }}>
        <Icon size={14} /> {c.text}
      </span>
    );
  };

  // ── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="app-content-area">
        <div className="app-content-wrap">
          <div className="container-fluid">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" />
                <p className="text-muted">Loading offer details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Template Preview ───────────────────────────────────
  if (showTemplate) {
    return (
      <div className="app-content-wrap">
        <div className="container-fluid">
          <ToastContainer />
          <div className="row mb-4">
            <div className="col-xl-12">
              <div className="page-title-box d-flex-between flex-wrap gap-15">
                <div className="d-flex align-items-center gap-10">

                  <h1 className="page-title fs-18 lh-1 mb-0">Offer Letter Preview</h1>
                  {getStatusBadge(mode === 'create' ? 'create' : 'draft')}
                </div>
                <div className="d-flex gap-10">
                  <button className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
                    onClick={() => window.print()}>
                    <Printer size={15} /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="row">
            <div className="col-xl-9 mx-auto">
              <div className="card shadow-sm" id="offer-template">
                <div className="card-body p-5" style={{ backgroundColor: 'white' }}>

                  {/* Company Header */}
                  <div className="text-center mb-4 pb-3 border-bottom">
                    <h3 className="text-primary mb-1">{employerInfo?.businessName ?? "No name"}</h3>
                    <p className="text-muted mb-0">{offerData.responsibeDepartment}</p>
                    <small className="text-muted">
                      {[employerInfo?.address, employerInfo?.city, employerInfo?.state, employerInfo?.country]
                        .filter(Boolean).join(', ')}
                      {employerInfo?.websiteUrl ? ` | ${employerInfo.websiteUrl.replace(/^https?:\/\//, '')}` : ''}
                    </small>
                  </div>

                  {/* Date */}
                  <div className="text-end mb-4">
                    <p className="mb-0"><strong>Date:</strong> {dayjs().format('DD MMMM YYYY')}</p>
                  </div>

                  {/* Candidate */}
                  <div className="mb-4">
                    <p className="mb-1"><strong>{application?.applicantName}</strong></p>
                    <p className="mb-0 text-muted">
                      {[application?.jobSeeker?.city, application?.jobSeeker?.state, application?.jobSeeker?.country]
                        .filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {/* Letter Title */}
                  <div className="text-center mb-4">
                    <h4 className="text-primary mb-0">{offerData.letterTitle?.toUpperCase()}</h4>
                  </div>

                  {/* Salutation & Introduction */}
                  <div className="mb-4">
                    <p className="mb-3"><strong>Dear {application?.applicantName},</strong></p>
                    {offerData.introduction
                      ? <div dangerouslySetInnerHTML={{ __html: offerData.introduction }} />
                      : <p className="text-muted fst-italic">N/A</p>}
                  </div>

                  {/* Position Details */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 border-bottom pb-2">POSITION DETAILS</h6>
                    <table className="table table-borderless table-sm mb-0">
                      <tbody>
                        <tr><td style={{ width: '35%' }}><strong>Job Title:</strong></td><td>{offerData.jobTitle}</td></tr>
                        <tr><td><strong>Department:</strong></td><td>{offerData.department}</td></tr>
                        <tr><td><strong>Level:</strong></td><td>{offerData.level}</td></tr>
                        <tr><td><strong>Employment Type:</strong></td><td>{offerData.employmentType}</td></tr>
                        {offerData.reportingManager && (
                          <tr><td><strong>Reporting To:</strong></td><td>{offerData.reportingManager}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Compensation */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 border-bottom pb-2">COMPENSATION</h6>
                    <table className="table table-borderless table-sm mb-0">
                      <tbody>
                        <tr>
                          <td style={{ width: '35%' }}><strong>Gross Annual Salary:</strong></td>
                          <td>{offerData.currencySymbol} {Number(offerData.salary).toLocaleString()}</td>
                        </tr>
                        {offerData.netAnnualPay && (
                          <tr><td><strong>Net Annual Pay:</strong></td><td>{offerData.currencySymbol} {offerData.netAnnualPay}</td></tr>
                        )}
                        {offerData.netMonthlyPay && (
                          <tr><td><strong>Net Monthly Pay:</strong></td><td>{offerData.currencySymbol} {offerData.netMonthlyPay}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Benefits */}
                  {offerData.benefits && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-3 border-bottom pb-2">BENEFITS & PERKS</h6>
                      <div dangerouslySetInnerHTML={{ __html: offerData.benefits }} />
                    </div>
                  )}

                  {/* Work Schedule */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3 border-bottom pb-2">WORK SCHEDULE</h6>
                    <table className="table table-borderless table-sm mb-0">
                      <tbody>
                        <tr><td style={{ width: '35%' }}><strong>Start Date:</strong></td><td>{dayjs(offerData.startDate).format('DD MMMM YYYY')}</td></tr>
                        <tr><td><strong>Working Days:</strong></td><td>{offerData.workDays.join(', ')}</td></tr>
                        <tr><td><strong>Working Hours:</strong></td><td>{offerData.workStartTime} – {offerData.workEndTime}</td></tr>
                        {/* {offerData.placeOfWork && (
                            <tr><td><strong>Place of Work:</strong></td><td>{offerData.placeOfWork}</td></tr>
                          )} */}
                        {/* {offerData.probationPeriod && (
                            <tr><td><strong>Probation Period:</strong></td><td>{offerData.probationPeriod}</td></tr>
                          )} */}
                      </tbody>
                    </table>
                  </div>

                  {/* Additional Information */}
                  {offerData.otherInformation && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-3 border-bottom pb-2">ADDITIONAL INFORMATION</h6>
                      <div dangerouslySetInnerHTML={{ __html: offerData.otherInformation }} />
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  {offerData.terms && (
                    <div className="mb-4">
                      <h6 className="text-primary mb-3 border-bottom pb-2">TERMS & CONDITIONS</h6>
                      <div style={{ fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: offerData.terms }} />
                    </div>
                  )}

                  {/* Response Instructions */}
                  {offerData.responseInstructions && (
                    <div className="mb-4">
                      <div dangerouslySetInnerHTML={{ __html: offerData.responseInstructions }} />
                    </div>
                  )}

                  {/* Closing */}
                  <div className="mb-5">
                    <p className="mb-1">We look forward to welcoming you to our team!</p>
                    <p className="mb-0 mt-4">Yours sincerely,</p>
                    <div style={{ marginTop: '60px' }}>
                      <p className="mb-0">_______________________________</p>
                      <p className="mb-0 fw-bold">{offerData.departmentPosition || 'Authorised Signatory'}</p>
                      <p className="text-muted mb-0">{offerData.responsibeDepartment || ''}</p>
                      <p className="text-muted mb-0">{employerInfo?.businessName || ''}</p>
                    </div>
                  </div>

                  {/* Acceptance */}
                  <div className="pt-4 border-top">
                    <h6 className="mb-3 fw-bold">ACCEPTANCE OF OFFER</h6>
                    <p>I, <strong>{application?.applicantName}</strong>, accept the above offer of employment.</p>
                    <div className="row mt-4">
                      <div className="col-md-5">
                        <p className="mb-1">Candidate Signature:</p>
                        <p style={{ borderBottom: '1px solid #333', paddingBottom: 24, marginTop: 32 }}></p>
                      </div>
                      <div className="col-md-2"></div>
                      <div className="col-md-5">
                        <p className="mb-1">Date:</p>
                        <p style={{ borderBottom: '1px solid #333', paddingBottom: 24, marginTop: 32 }}></p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Template Action Buttons */}
              <div className="d-flex justify-content-between gap-10 mt-4 mb-5">
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={() => setShowTemplate(false)} disabled={isSubmitting}>
                  <Pen size={16} /> Edit Details
                </button>
                <div className="d-flex gap-2">
                  <button className="btn btn-warning d-flex align-items-center gap-2"
                    onClick={() => handleSubmit('Draft')} disabled={isSubmitting}>
                    <Save size={16} />
                    {isSubmitting && submitStatus === 'Draft' ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() => handleSubmit('Sent')} disabled={isSubmitting}>
                    {isSubmitting && submitStatus === 'Sent'
                      ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                      : <><Send size={16} /> Send Offer</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            .no-print, .btn, nav, .page-title-box { display: none !important; }
            #offer-template { box-shadow: none !important; border: none !important; }
          }
        `}</style>
      </div>
    );
  }

  // ── Edit / Create Form ─────────────────────────────────
  return (
    <div className="app-content-wrap">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">

          {/* Page Header */}
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div className="d-flex align-items-center gap-10">
                <div>
                  <h1 className="page-title fs-18 lh-1 mb-1">
                    {mode === 'edit' ? 'Edit Job Offer' : 'Create Job Offer'}
                  </h1>
                  {application && (
                    <p className="text-muted mb-0 fs-13">
                      <strong>{application.applicantName}</strong> — {application.jobTitle}
                    </p>
                  )}
                </div>
                {getStatusBadge(mode === 'create' ? 'create' : 'draft')}
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">
                    {mode === 'edit' ? 'Edit Offer' : 'Create Offer'}
                  </li>
                  <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item">
                    <NavLink to={`/JobDetails/JobApplications/JobApplicationDetails/${params.id}/${params.clientId}`}>
                      Job Application Details
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

          {/* Mode Banner */}
          <div className="col-12 mb-3">
            <div className={`alert ${mode === 'edit' ? 'alert-warning' : 'alert-info'} py-2 d-flex align-items-center gap-2`}>
              <AlertCircle size={15} />
              <span className="fs-13">
                {mode === 'edit'
                  ? 'You are editing an existing draft offer. Saving will update the current draft.'
                  : 'You are creating a new job offer. Fill in all required fields then generate the template to preview before sending.'}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="col-12 mb-3">
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2">
                <AlertCircle size={15} /> {error}
              </div>
            </div>
          )}

          {/* Top Action Bar  */}
          {mode === 'edit' && (
            <div className="col-lg-12 mb-4">
              <div className="card">
                <div className="card-body py-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-10">
                    <div>
                      <p className="mb-0 text-muted fs-13">
                        Editing draft offer for <strong>{application?.applicantName}</strong>
                      </p>
                    </div>
                    <div className="d-flex flex-wrap gap-10">
                      <button className="btn btn-success btn-sm d-flex align-items-center gap-2"
                        onClick={handleSendDraft} disabled={isSending}>
                        <Send size={15} />
                        {isSending ? 'Sending...' : 'Send Draft Directly'}
                      </button>
                      {/*   {offerLetterUrl && (
                        <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                          onClick={() => window.open(`${import.meta.env.VITE_API_URL}${offerLetterUrl}`, '_blank')}>
                          <Download size={15} /> Download Offer
                        </button>
                      )}*/}
                      <NavLink
                        to={`/jobApplicationDetails/${hashIds.encode(String(applicationId))}`}
                        className="btn btn-outline-info btn-sm d-flex align-items-center gap-2"
                      >
                        <Eye size={15} /> View Application
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Form */}
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  {mode === 'edit' ? 'Edit Offer Details' : 'Offer Details'}
                </h5>
              </div>
              <div className="card-body mt-15">

                {application && (
                  <div className="alert alert-light border mb-4 d-flex align-items-center gap-10">
                    <img
                      src={application.jobSeeker?.profilePhoto
                        ? `http://localhost:5127/${application.jobSeeker.profilePhoto}`
                        : "https://img.icons8.com/color/48/gender-neutral-user.png"}
                      className="radius-100"
                      style={{ width: 40, height: 40, objectFit: 'cover' }}
                      alt=""
                    />
                    <div>
                      <strong>{application.applicantName}</strong>
                      <span className="text-muted ms-2">|</span>
                      <span className="text-muted ms-2">{application.jobTitle}</span>
                    </div>
                  </div>
                )}

                {/* ── Job Details ── */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0"><i className="bi bi-briefcase me-2"></i>Job Details</h6>
                  </div>
                  <div className="card-body mt-15">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Job Title <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={offerData.jobTitle}
                          onChange={e => handleInputChange('jobTitle', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Department <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={offerData.department}
                          onChange={e => handleInputChange('department', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Level <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="e.g., Junior, Mid-Level, Senior"
                          value={offerData.level} onChange={e => handleInputChange('level', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Employment Type <span className="text-danger">*</span></label>
                        <select className="form-select" value={offerData.employmentType}
                          onChange={e => handleInputChange('employmentType', e.target.value)}>
                          <option value="">Select type</option>
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Freelance</option>
                          <option>Internship</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Reporting Manager</label>
                        <input type="text" className="form-control" placeholder="e.g., John Smith"
                          value={offerData.reportingManager}
                          onChange={e => handleInputChange('reportingManager', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Responsibility Office ── */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0"><i className="bi bi-building me-2"></i>Responsibility Office Details</h6>
                  </div>
                  <div className="card-body mt-15">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <input type="text" className="form-control" value={offerData.responsibeDepartment}
                          onChange={e => handleInputChange('responsibeDepartment', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Officer / Position</label>
                        <input type="text" className="form-control" placeholder="e.g., Head of HR"
                          value={offerData.departmentPosition}
                          onChange={e => handleInputChange('departmentPosition', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Compensation ── */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0"><i className="bi bi-currency-pound me-2"></i>Compensation & Benefits</h6>
                  </div>
                  <div className="card-body mt-15">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Gross Annual Salary <span className="text-danger">*</span></label>
                        <div className="input-group">
                          <span className="input-group-text">{offerData.currencySymbol || '₦'}</span>
                          <input type="number" className="form-control" placeholder="0.00"
                            value={offerData.salary}
                            onChange={e => handleInputChange('salary', e.target.value)} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Net Annual Pay</label>
                        <div className="input-group">
                          <span className="input-group-text">{offerData.currencySymbol || '₦'}</span>
                          <input type="number" className="form-control" placeholder="0.00"
                            value={offerData.netAnnualPay}
                            onChange={e => handleInputChange('netAnnualPay', e.target.value)} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Net Monthly Pay</label>
                        <div className="input-group">
                          <span className="input-group-text">{offerData.currencySymbol || '₦'}</span>
                          <input type="number" className="form-control" placeholder="0.00"
                            value={offerData.netMonthlyPay}
                            onChange={e => handleInputChange('netMonthlyPay', e.target.value)} />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Benefits & Perks</label>
                        <RichTextEditor value={offerData.benefits}
                          onChange={(val: string) => handleInputChange('benefits', val)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Work Schedule ── */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0"><i className="bi bi-calendar-week me-2"></i>Work Schedule</h6>
                  </div>
                  <div className="card-body mt-15">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Start Date <span className="text-danger">*</span></label>
                        <input type="date" className="form-control" value={offerData.startDate}
                          onChange={e => handleInputChange('startDate', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Working Hours <span className="text-danger">*</span></label>
                        <div className="d-flex align-items-center gap-2">
                          <input type="time" className="form-control" value={offerData.workStartTime}
                            onChange={e => handleInputChange('workStartTime', e.target.value)} />
                          <span className="text-muted">to</span>
                          <input type="time" className="form-control" value={offerData.workEndTime}
                            onChange={e => handleInputChange('workEndTime', e.target.value)} />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Work Days <span className="text-danger">*</span></label>
                        <div className="d-flex flex-wrap gap-3 mt-1">
                          {WORK_DAYS.map(day => (
                            <div key={day} className="form-check">
                              <input className="form-check-input" type="checkbox" id={`day-${day}`}
                                checked={offerData.workDays.includes(day)}
                                onChange={() => toggleWorkDay(day)} />
                              <label className="form-check-label" htmlFor={`day-${day}`}>{day}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* ── Offer Letter Content ── */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0"><i className="bi bi-file-text me-2"></i>Offer Letter Content</h6>
                  </div>
                  <div className="card-body mt-15">
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label">Letter Title <span className="text-danger">*</span></label>
                        <input type="text" className="form-control"
                          placeholder="e.g., LETTER OF EMPLOYMENT OFFER"
                          value={offerData.letterTitle}
                          onChange={e => handleInputChange('letterTitle', e.target.value)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Introduction <span className="text-danger">*</span></label>
                        <RichTextEditor value={offerData.introduction}
                          onChange={(val: string) => handleInputChange('introduction', val)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Response Instructions <span className="text-danger">*</span></label>
                        <RichTextEditor value={offerData.responseInstructions}
                          onChange={(val: string) => handleInputChange('responseInstructions', val)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Terms & Conditions</label>
                        {termsList.filter(t => t.termsType === TermsType.EmploymentOffer).length > 0 ? (
                          <>
                            <select className="form-select mb-2" value={selectedTermsId}
                              onChange={e => {
                                const id = Number(e.target.value);
                                setSelectedTermsId(id);
                                const found = termsList.find(t => t.termsId === id);
                                if (found) handleInputChange('terms', found.content);
                              }}>
                              <option value="">-- Select Terms & Conditions --</option>
                              {termsList
                                .filter(t => t.termsType === TermsType.EmploymentOffer)
                                .map(t => (
                                  <option key={t.termsId} value={t.termsId}>{t.title}</option>
                                ))}
                            </select>
                            {selectedTermsId && (
                              <div className="border rounded p-3"
                                style={{ maxHeight: 200, overflowY: 'auto', fontSize: '0.85rem' }}
                                dangerouslySetInnerHTML={{
                                  __html: termsList.find(t => t.termsId === Number(selectedTermsId))?.content ?? ''
                                }} />
                            )}
                          </>
                        ) : (
                          <div className="alert alert-warning d-flex align-items-center justify-content-between mb-0">
                            <span><i className="bi bi-exclamation-triangle me-2" />No Employment Offer terms found.</span>
                            <button className="btn btn-sm btn-warning"
                              onClick={() => navigate('/settings?tab=terms')}>
                              <Settings size={14} className="me-1" /> Create Terms
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Other Information</label>
                        <RichTextEditor value={offerData.otherInformation}
                          onChange={(val: string) => handleInputChange('otherInformation', val)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="card-footer d-flex justify-content-between align-items-center gap-10">
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={() => navigate(-1)}>
                  <ArrowLeft size={15} /> Cancel
                </button>
                <div className="d-flex gap-2">
                  <button className="btn btn-warning d-flex align-items-center gap-2"
                    onClick={() => handleSubmit('Draft')} disabled={isSubmitting}>
                    <Save size={15} />
                    {isSubmitting && submitStatus === 'Draft' ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() => { if (validateOfferData()) setShowTemplate(true); }}
                    disabled={isSubmitting}>
                    <Eye size={15} /> Preview & Send
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobOfferFormNew;