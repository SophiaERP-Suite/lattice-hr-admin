import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { toast, ToastContainer } from "react-toastify";
import { AlertCircle, Eye, Search, Users, MapPin, Calendar, Download, Briefcase, ChevronRight } from "lucide-react";
import type { CityData, JobData, StateData } from "./JobMgt";
import { fetchCitiesByStateId, fetchStatesByCountryId } from "../../utils/LocationRequests";
import { getJobById, GetMyFilteredJobsApplications, JobApplications } from "../../utils/JobRequests";

export type JobApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "interview"
  | "selfInterview"
  | "hired";

export interface JobApplicationDto {
  jobApplicationId: number;
  jobTitle: string;
  jobId: number;
  status: JobApplicationStatus;
  applDate: string;
  applicantName: string;
  coverLetter: string;
  comment: string;
  resume: string;
  jobSeeker: UserDto;
  rating: number;
}

export interface UserDto {
  address: string;
  alternateEmail: string | null;
  alternatePhone: string | null;
  city: string;
  country: string;
  dateOfBirth: string;
  dateCreated: string;
  degree: string | null;
  email: string;
  firstName: string;
  gender: string;
  hobbies: string | null;
  interviewLocation: string | null;
  isActive: boolean;
  jobCategory: string | null;
  jobCategoryId: number | null;
  jobLocation: string | null;
  jobSector: string | null;
  jobSectorId: number | null;
  jobSeekerDate: string | null;
  jobSeekerId: number;
  lastName: string;
  maritalStatus: string | null;
  phone: string;
  postCode: string | null;
  profilePhoto: string | null;
  qualification: string | null;
  salaryRange: string | null;
  state: string;
  userId: number;
  workExperience: number;
  CountryId: number;
  StateId: number;
  CityId: number;
}

const JobApplication = () => {
  const [job, setJob] = useState<JobData>();
  const [jobApplications, setJobApplications] = useState<JobApplicationDto[]>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isApplicationsLoading, setApplicationsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [state, setState] = useState<StateData[] | null>(null);
  const [city, setCity] = useState<CityData[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalJobApplications, setTotalJobApplications] = useState<number>(0);

  const [filters, setFilters] = useState({
    searchTerm: "",
    stateId: 0,
    cityId: 0,
    status: 0,
  });

  const pageSize = 20

  const { id, clientId } = useParams();
  const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
  const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;

  useEffect(() => {
    fetchJobDetails();
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchMyJobsApplications();
  }, [currentPage, filters]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await getJobById(hashedId);
      const data = await response.json()
      if (response.status === 200) {
        setJob(data.data);
        await fetchState(Number(data.data.countryId));
      }
    } catch {
      setError("Could not fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      const response = await JobApplications(Number(hashedId));
      if (response && response.length > 0) {
        setTotalJobApplications(response.length);
      } else {
        setTotalJobApplications(0);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchState = async (countryId: number) => {
    try {
      const response = await fetchStatesByCountryId(countryId);

      const data = await response.json()
      if (response.status === 200) {
        setState(data.data);
      }
    } catch {
      setState(null);
    }
  };

  const handleStateChange = async (stateId: string) => {
    const stateIdNum = parseInt(stateId);
    setFilters({ ...filters, stateId: stateIdNum, cityId: 0 });

    if (stateIdNum > 0) {
      await fetchCity(stateIdNum);
    } else {
      setCity(null);
    }
  };

  const fetchCity = async (stateId: number) => {
    try {
      const response = await fetchCitiesByStateId(stateId);
      const data = await response.json()
      if (response.status === 200) {
        setCity(data);
      }
    } catch {
      setCity(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMyJobsApplications();
  };

  const fetchMyJobsApplications = async () => {
    try {
      setLoading(true);

      const response = await GetMyFilteredJobsApplications({
        page: currentPage,
        pageSize: pageSize,
        searchTerm: filters.searchTerm || undefined,
        stateId: filters.stateId > 0 ? filters.stateId : undefined,
        cityId: filters.cityId > 0 ? filters.cityId : undefined,
        status: filters.status > 0 ? filters.status : undefined
      }, Number(hashedId));

      if (response) {
        setJobApplications(response || []);
      }

      console.log(response, "sdbiwi")
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobApplications([]);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      stateId: 0,
      cityId: 0,
      status: 0
    });
    setCity(null);

    setCurrentPage(1);
  };

  // Loading State - Focus on Applications
  if (isLoading || isApplicationsLoading) {
    return (
      <div className="app-content-wrap"> <ToastContainer />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="page-title-box d-flex-between flex-wrap gap-15">
                <h1 className="page-title fs-18 lh-1">Job Applications</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb breadcrumb-example1 mb-0">
                    <li className="breadcrumb-item">
                      <NavLink to={`/JobDetails/JobApplications/${id}/${clientId}`}>
                        Job Applications
                      </NavLink>
                    </li>
                    <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                    <li className="breadcrumb-item"><NavLink to={`/ClientMgt/${clientId}`}>Client Management</NavLink></li>
                    <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                    <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>
                  </ol>
                </nav>
              </div>
            </div>

            {/* Job Info Skeleton */}
            <div className="col-xl-12 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="placeholder-wave">
                    <span className="placeholder col-3 bg-secondary mb-2" style={{ height: '28px' }}></span>
                    <span className="placeholder col-2 bg-secondary" style={{ height: '20px' }}></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Skeleton */}
            <div className="col-xl-12 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-12 col-lg-4">
                      <div className="placeholder-wave">
                        <span className="placeholder col-12 bg-secondary" style={{ height: '38px' }}></span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-2">
                      <div className="placeholder-wave">
                        <span className="placeholder col-12 bg-secondary" style={{ height: '38px' }}></span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-2">
                      <div className="placeholder-wave">
                        <span className="placeholder col-12 bg-secondary" style={{ height: '38px' }}></span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-2">
                      <div className="placeholder-wave">
                        <span className="placeholder col-12 bg-secondary" style={{ height: '38px' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count Skeleton */}
            <div className="col-xl-12 mb-3">
              <div className="placeholder-wave">
                <span className="placeholder col-2 bg-secondary" style={{ height: '20px' }}></span>
              </div>
            </div>

            {/* Applications Table Skeleton */}
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header">
                  <div className="placeholder-wave">
                    <span className="placeholder col-4 bg-secondary" style={{ height: '28px' }}></span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Location</th>
                          <th>Date Applied</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map((item) => (
                          <tr key={item}>
                            <td>
                              <div className="d-flex-items gap-10">
                                <div className="avatar radius-100">
                                  <div className="placeholder-wave">
                                    <span className="placeholder bg-secondary" style={{
                                      height: '40px',
                                      width: '40px',
                                      borderRadius: '50%',
                                      display: 'block'
                                    }}></span>
                                  </div>
                                </div>
                                <div>
                                  <div className="placeholder-wave">
                                    <span className="placeholder col-8 bg-secondary" style={{ height: '20px' }}></span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="placeholder-wave">
                                <span className="placeholder col-10 bg-secondary" style={{ height: '20px' }}></span>
                              </div>
                            </td>
                            <td>
                              <div className="placeholder-wave">
                                <span className="placeholder col-8 bg-secondary" style={{ height: '20px' }}></span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <div className="placeholder-wave">
                                  <span className="placeholder bg-secondary" style={{
                                    height: '32px',
                                    width: '90px',
                                    borderRadius: '4px',
                                    display: 'block'
                                  }}></span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="app-content-area">
        <ToastContainer />
        <div className="app-content-wrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                  <h1 className="page-title fs-18 lh-1">Job Applications</h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-example1 mb-0">
                      <li className="breadcrumb-item">
                        <NavLink to={`/JobDetails/JobApplications/${id}/${clientId}`}>
                          Job Applications
                        </NavLink>
                      </li>
                      <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                      <li className="breadcrumb-item"><NavLink to={`/ClientMgt/${clientId}`}>Client Management</NavLink></li>
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
                    <h5 className="text-dark mb-2">Error Loading Applications</h5>
                    <p className="text-muted mb-3">{error}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        fetchJobDetails();
                        fetchApplications();
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Content
  return (

    <div className="app-content-wrap">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <h1 className="page-title fs-18 lh-1">Job Applications</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item">
                    <NavLink to={`/JobDetails/JobApplications/${id}/${clientId}`}>
                      Job Applications
                    </NavLink>
                  </li>
                  <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item"><NavLink to={`/ClientMgt/${clientId}`}>Client Management</NavLink></li>
                  <ChevronRight size={14} style={{ position: "relative", top: "5px" }} />
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Job Info Card */}
          {job && (
            <div className="col-xl-12 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-15 flex-wrap">
                    <div className="d-flex align-items-center gap-10">
                      <Briefcase size={20} className="text-Info" />
                      <h5 className="mb-0">{job.jobTitle}</h5>
                    </div>
                    <span className="badge bg-info">
                      {totalJobApplications} {totalJobApplications === 1 ? 'Application' : 'Applications'}
                    </span>
                    {job.jobExpiration && (
                      <div className="d-flex align-items-center gap-5 ms-auto">
                        <Calendar size={16} className="text-black" />
                        <small className="text-black">
                          Expires: {new Date(job.jobExpiration).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="col-xl-12">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <form onSubmit={handleSearch}>
                  <div className="row g-3">
                    {/* Search Input */}
                    <div className="col-md-12 col-lg-4">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by candidate name..."
                          value={filters.searchTerm}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              searchTerm: e.target.value,
                            })
                          }
                        />
                        <button className="btn btn-info" type="submit">
                          <Search size={18} />
                        </button>
                      </div>
                    </div>

                    {/* State Filter */}
                    <div className="col-md-6 col-lg-2">
                      <select
                        className="form-select"
                        value={filters.stateId}
                        onChange={(e) => handleStateChange(e.target.value)}
                      >
                        <option value={0}>All States</option>
                        {state?.map((type) => (
                          <option key={type.stateId} value={type.stateId}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Filter */}
                    <div className="col-md-6 col-lg-2">
                      <select
                        className="form-select"
                        value={filters.cityId}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            cityId: parseInt(e.target.value),
                          })
                        }
                        disabled={!city || city.length === 0}
                      >
                        <option value={0}>All Cities</option>
                        {city?.map((type) => (
                          <option key={type.cityId} value={type.cityId}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 col-lg-2">
                      <select
                        className="form-select"
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            status: parseInt(e.target.value),
                          })
                        }
                      >
                        <option value="">By Status</option>
                        <option value={0}>
                          Pending
                        </option>
                        <option value={1}>
                          Reviewed
                        </option>
                        <option value={2}>
                          Shortlisted
                        </option>
                        <option value={3}>
                          Interview
                        </option>
                        <option value={4}>
                          Rejected
                        </option>
                        <option value={5}>
                          Hired
                        </option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="col-md-6 col-lg-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>

                    {/* Export Button */}
                    <div className="col-md-6 col-lg-2">
                      <button
                        type="button"
                        className="d-none btn btn-outline-success w-100"
                        onClick={() => toast.info('Export feature coming soon')}
                      >
                        <Download size={16} className="me-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-3">
              <p className="text-black">
                Showing {jobApplications?.length || 0} of {totalJobApplications} applications
              </p>
            </div>
          </div>

          {/* Applications Table */}
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header">
                <h4 className="d-flex-items gap-10 mb-0">
                  <Users size={20} />
                  Applications for {job?.jobTitle}
                </h4>
              </div>

              <div className="card-body">
                <div className="table-responsive">
                  <table className="table text-nowrap w-100">
                    <thead className="">
                      <tr>
                        <th>Candidate</th>
                        <th>Location</th>
                        <th>Date Applied</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobApplications && jobApplications.length > 0 ? (
                        jobApplications.map((item) => (
                          <tr key={item.jobApplicationId}>
                            <td>
                              <div className="d-flex align-items-center gap-10">
                                <div className="avatar radius-100">
                                  <img
                                    src={item.jobSeeker?.profilePhoto
                                      ? `http://localhost:5127/${item.jobSeeker.profilePhoto}`
                                      : "https://img.icons8.com/color/48/gender-neutral-user.png"}
                                    alt={item.applicantName}
                                    className="radius-100"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  />
                                </div>
                                <div>
                                  <h6 className="mb-0">
                                    <NavLink
                                      to={`/jobApplicationDetails/${hashIds.encode(String(item.jobApplicationId))}`}
                                      className="text-decoration-none text-dark fw-semibold"
                                    >
                                      {item.applicantName}
                                    </NavLink>
                                  </h6>
                                  <small className="text-muted">{item.jobSeeker?.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-5">
                                <MapPin size={14} className="text-muted" />
                                <span>
                                  {[
                                    item.jobSeeker?.city,
                                    item.jobSeeker?.state,
                                    item.jobSeeker?.country
                                  ].filter(Boolean).join(", ")}
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="d-flex align-items-center gap-5">
                                <Calendar size={14} className="text-muted" />
                                <span>
                                  {item.applDate
                                    ? new Date(item.applDate).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                    : "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="text-end">
                              <NavLink
                                className="btn btn-sm btn-success"
                                to={`/JobDetails/JobApplications/JobApplicationDetails/${hashIds.encode(String(item.jobApplicationId))}/${clientId}`}
                              >
                                <Eye size={16} className="me-1" />
                                View Details
                              </NavLink>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-5">
                            <div className="text-center">
                              <Users size={48} className="text-muted mb-3" />
                              <h5 className="text-dark mb-2">No Applications Yet</h5>
                              <p className="text-muted mb-0">
                                There are no applications for this job at the moment.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalJobApplications > 10 && (
                  <div className="d-flex justify-content-center mt-4">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(Math.ceil(totalJobApplications / 10))].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === Math.ceil(totalJobApplications / 10) ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalJobApplications / 10)))}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default JobApplication;