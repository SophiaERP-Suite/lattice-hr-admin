import { CalendarFoldIcon, ChevronRight, PenLine, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import female from "../../assets/images/avatar/avatar-thumb-010.webp";
import male from "../../assets/images/avatar/avatar-thumb-007.webp";
import avatar from "../../assets/images/company/company-thumb-008.png";

const complaintsData = [
  {
    image: male,
    user: "Emmanuel Adeyemi",
    type: "Candidate",
    subject: "Job listing expired before I could apply",
    date: "Jul 2, 2025",
    description: "The job posting for Frontend Developer at TechNova closed earlier than the stated deadline."
  },
  {
    image: avatar,
    user: "BrightHire Solutions",
    type: "Employer",
    subject: "Payment not reflecting for job post",
    date: "Jun 18, 2025",
    description: "We made a payment for a premium job slot but it still shows as unpaid in the dashboard."
  },
  {
    image: female,
    user: "Linda Chow",
    type: "Candidate",
    subject: "Unable to upload resume",
    date: "May 29, 2025",
    description: "I've tried multiple times to upload my resume but the system keeps showing an error message."
  },
  {
    image: avatar,
    user: "Skyline Technologies",
    type: "Employer",
    subject: "Candidate contact information missing",
    date: "Aug 5, 2025",
    description: "Some shortlisted applicants are missing contact details after exporting candidate data."
  },
  {
    image: male,
    user: "David Okoro",
    type: "Candidate",
    subject: "Applied but didn't get confirmation email",
    date: "Jun 3, 2025",
    description: "I applied to two positions but didn't receive any confirmation or reference number."
  },
  {
    image: avatar,
    user: "Urban Workforce",
    type: "Employer",
    subject: "Duplicate job posting issue",
    date: "Jul 15, 2025",
    description: "After saving a draft job, it appeared twice on the live job board."
  },
  {
    image: female,
    user: "Fatima Bello",
    type: "Candidate",
    subject: "Job marked as remote but requires office attendance",
    date: "Sep 10, 2025",
    description: "The job was listed as fully remote, but the employer later requested in-person attendance."
  },
  {
    image: male,
    user: "Tunde Afolayan",
    type: "Candidate",
    subject: "Application stuck on ‘In Review'",
    date: "Oct 1, 2025",
    description: "It's been over two weeks since I applied, but my application status hasn't updated."
  },
  {
    image: avatar,
    user: "NextGen Labs",
    type: "Employer",
    subject: "Can't edit published job",
    date: "Jun 25, 2025",
    description: "We need to adjust job details, but the edit option is disabled for active postings."
  },
  {
    image: female,
    user: "Adaobi Nwosu",
    type: "Candidate",
    subject: "Incorrect job match suggestions",
    date: "Jul 20, 2025",
    description: "The system keeps recommending jobs outside my skill set and preferred location."
  },
  {
    image: avatar,
    user: "Workify HR",
    type: "Employer",
    subject: "Applicants not receiving interview invites",
    date: "Sep 2, 2025",
    description: "We sent multiple interview invitations, but candidates report not receiving them."
  },
  {
    image: male,
    user: "Joseph Mensah",
    type: "Candidate",
    subject: "Can't withdraw job application",
    date: "May 17, 2025",
    description: "I want to withdraw my application but there's no option to do so on the dashboard."
  },
  {
    image: avatar,
    user: "TalentLink Africa",
    type: "Employer",
    subject: "Subscription renewal charged twice",
    date: "Aug 23, 2025",
    description: "Our enterprise subscription was renewed twice, and we'd like a refund for the duplicate charge."
  },
  {
    image: female,
    user: "Chinelo Okafor",
    type: "Candidate",
    subject: "Employer requesting payment before interview",
    date: "Oct 10, 2025",
    description: "A recruiter asked for an application fee, which I believe violates the platform policy."
  },
  {
    image: avatar,
    user: "Nordic Shipping AS",
    type: "Employer",
    subject: "Unable to download candidate resumes",
    date: "Jul 8, 2025",
    description: "Clicking the download button on candidate profiles doesn't respond or trigger any action."
  }
]

export default function Complaints() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Complaints</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li>
                                <NavLink to="/Dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="mb-2">
                                <ChevronRight size={15} />
                            </li>
                            <li className="active" aria-current="page">
                                <NavLink to="/Complaints">
                                    Complaints
                                </NavLink>
                            </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="d-flex-items gap-10">Complaints</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewWarning">
                                    Log New Complaint
                                </button>
                                <a className="btn btn-success text-white" href="javascript:void(0);">Export As
                                    CSV</a>
                                <div className="">
                                    <select className="form-select sorting-dropdown">
                                        <option value="">Sort by</option>
                                        <option selected value="date_desc">Newest First</option>
                                        <option value="status">Attendance Status</option>
                                        <option value="checkin_desc">Latest Arrivals</option>
                                        <option value="hours_desc">Longest Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive">
                                <table className="table w-100 text-nowrap text-start" id="employeeAttendanceTable">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            complaintsData.map(data => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <div className="avatar radius-100">
                                                                    <img src={data.image} alt="#" className="radius-100"/>
                                                                </div>
                                                                <div>
                                                                    <h6><a href="#">{data.user}</a>{" "}
                                                                        <span style={{ fontSize: '12px' }}>{`(${data.type})`}</span>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{data.subject}</td>
                                                        <td>{data.date}</td>
                                                        <td>{data.description}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <button className="btn-icon btn-info-light" type="button" data-bs-toggle="modal" data-bs-target="#editWarning">
                                                                    <a><PenLine /></a>
                                                                </button>
                                                                <button className="btn-icon btn-danger-light removeRow" type="button">
                                                                    <a><Trash2 /></a>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="modal fade" id="addNewWarning" tabIndex={-1} aria-labelledby="addNewWarningLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-16" id="addNewWarningLabel">Log New Complaint</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleEmployee" className="form-label">Candidate/Client</label>
                                    <select className="employeeList form-control" id="scheduleEmployee">
                                        <option value="p-1">Select User</option>
                                        <option value="p-1">John Doe</option>
                                        <option value="p-2">Jane Smith</option>
                                        <option value="p-3">Sarah Johnson</option>
                                        <option value="p-4">Michael Brown</option>
                                        <option value="p-5">Emily Davis</option>
                                        <option value="p-6">Robert Wilson</option>
                                    </select>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="subject" className="form-label">Complaint Subject</label>
                                    <input type="text" className="form-control" id="subject" placeholder="Subject"/>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleDate" className="form-label">Complaint Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <CalendarFoldIcon />
                                        </div>
                                        <input type="text" className="form-control flatpickr-input" id="scheduleDate" placeholder="Select Complaint date" readOnly={true} />
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleRemarks" className="form-label">Description</label>
                                    <textarea className="form-control" id="scheduleRemarks" rows={3} placeholder=""></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Complaint Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="modal fade" id="editWarning" tabIndex={-1} aria-labelledby="editWarningLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-16" id="editWarningLabel">Edit Complaint</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleEmployee2" className="form-label">Client/Candidate</label>
                                    <select className="employeeListTwo form-control" id="scheduleEmployee2">
                                        <option value="p-1" selected>John Doe</option>
                                        <option value="p-2">Jane Smith</option>
                                        <option value="p-3">Sarah Johnson</option>
                                        <option value="p-4">Michael Brown</option>
                                        <option value="p-5">Emily Davis</option>
                                        <option value="p-6">Robert Wilson</option>
                                    </select>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="subject2" className="form-label">Complaint Subject</label>
                                    <input type="text" className="form-control" id="subject2" value="Job listing expired before I could apply"/>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleDateTwo" className="form-label">Complaint Date</label>
                                    <div className="input-group">
                                        <div className="input-group-text text-muted">
                                            <CalendarFoldIcon />
                                        </div>
                                        <input type="text" className="form-control flatpickr-input" id="scheduleDateTwo" value="May 12, 2025" readOnly={true} />
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <label htmlFor="scheduleRemarks2" className="form-label">Description</label>
                                    <textarea className="form-control" id="scheduleRemarks2" rows={3} placeholder="">The job posting for Frontend Developer at TechNova closed earlier than the stated deadline.</textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}