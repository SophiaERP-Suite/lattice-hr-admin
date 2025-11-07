import { Bookmark, Briefcase, CheckCircle, ChevronRight, Info, MailCheck, MapPin, Printer, Send, Share } from "lucide-react";
import { NavLink } from "react-router-dom";
import avatar from "../../assets/images/company/company-thumb-008.png";

export default function JobDetails() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Job Details</h1>
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
                                    <NavLink to="/JobMgt">
                                        Job Management
                                    </NavLink>
                                </li>
                                <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li className="active" aria-current="page">
                                    <NavLink to="/JobMgt/JobDetails">
                                        Job Details
                                    </NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <div className="">
                                <h2 className="mb-15">Senior Frontend Developer (React)</h2>
                                <div className="d-flex align-items-center">
                                    <div className="avatar avatar-big">
                                        <img src={avatar} alt="Company Logo" className="radius-50"/>
                                    </div>
                                    <div>
                                        <h4 className="mb-5">TechSolutions Inc.</h4>
                                        <div className="text-muted">
                                            <span className="me-3"><MapPin size={18} /> San
                                                Francisco, CA
                                                94105</span>
                                            <span><Briefcase size={18} /> Full-time</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div className="d-flex flex-wrap justify-content-between gap-10 mb-4">
                                <div>
                                    <span className="badge bg-success me-2">Urgently hiring</span>
                                    <span className="badge bg-primary">Responsive employer</span>
                                </div>
                                <div className="d-flex align-items-center gap-10">
                                    <button className="btn btn-outline-primary btn-sm">
                                        <Bookmark size={15} /> Save
                                    </button>
                                    <button className="btn btn-outline-primary btn-sm">
                                        <Share size={15} /> Share
                                    </button>
                                </div>
                            </div>
                            <div className="p-15 mb-15 gray-bg-2 text-start">
                                <h5 className="mb-5">$120,000 - $150,000 a year</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-5"><CheckCircle size={15}/> {" "}
                                            Health insurance</p>
                                        <p className="mb-5"><CheckCircle size={15}/> {" "}
                                            401(k) matching</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-5"><CheckCircle size={15}/> {" "}
                                            Flexible schedule</p>
                                        <p className="mb-5"><CheckCircle size={15}/> {" "} Paid
                                            time off</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-15 text-start">
                                <h4 className="mb-5">Job Details</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-5"><strong>Salary:</strong> $120,000 - $150,000 per
                                            year
                                        </p>
                                        <p className="mb-0"><strong>Job Type:</strong> Full-time</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-5"><strong>Schedule:</strong> Monday to Friday</p>
                                        <p className="mb-0"><strong>Experience:</strong> 5+ years (Required)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-15 text-start">
                                <h4 className="mb-5">Full Job Description</h4>
                                <p>TechSolutions Inc. is looking for an experienced Senior Frontend
                                    Developer to
                                    join our growing team. You will be responsible for building user
                                    interfaces
                                    and implementing features for our flagship products.</p>
                            </div>
                            <div className="mb-15 text-start">
                                <h5 className="mb-10">Responsibilities:</h5>
                                <ul className="list-bullet">
                                    <li>Develop new user-facing features using React.js</li>
                                    <li>Build reusable components and front-end libraries</li>
                                    <li>Optimize applications for maximum performance</li>
                                    <li>Collaborate with UX/UI designers to implement designs</li>
                                    <li>Work with backend developers to integrate APIs</li>
                                    <li>Mentor junior developers and conduct code reviews</li>
                                </ul>
                            </div>
                            <div className="mb-15 text-start">
                                <h5 className="mb-1">Requirements:</h5>
                                <ul className="list-bullet">
                                    <li>5+ years of professional frontend development experience</li>
                                    <li>Strong proficiency in JavaScript, including ES6+ syntax</li>
                                    <li>Extensive experience with React.js and its core principles</li>
                                    <li>Familiarity with modern frontend build pipelines and tools</li>
                                    <li>Experience with RESTful APIs and GraphQL</li>
                                    <li>Knowledge of modern authorization mechanisms</li>
                                    <li>Familiarity with code versioning tools (Git)</li>
                                </ul>
                            </div>
                            <div className="mb-15 text-start">
                                <h5 className="mb-10">Nice to Have:</h5>
                                <ul className="list-bullet">
                                    <li>Experience with TypeScript</li>
                                    <li>Knowledge of server-side rendering</li>
                                    <li>Experience with testing frameworks (Jest, Cypress)</li>
                                    <li>Understanding of CI/CD pipelines</li>
                                </ul>
                            </div>
                            <div className="d-flex flex-wrap align-items-center gap-10 bg-info-transparent p-2 raduis-4">
                                <h5><Info size={20} /> Hiring Insights</h5>
                                <p className="mb-0 text-black"><strong>Job activity:</strong> Posted 3 days ago • 25
                                    applicants</p>
                                <p className="mb-0 text-black"><strong>Hiring:</strong> 2 candidates needed</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body text-start">
                            <h4 className="mb-10">About TechSolutions Inc.</h4>
                            <p className="mb-5">TechSolutions is a leading provider of enterprise software
                                solutions, helping
                                businesses transform their operations through innovative technology. Founded
                                in 2010, we've grown to serve over 500 clients worldwide with our
                                cutting-edge products.</p>
                            <p className="mb-5">Our team of 200+ professionals is dedicated to creating software
                                that makes a
                                real difference in our clients' businesses. We value innovation,
                                collaboration, and continuous learning.</p>
                            <p className="mb-5"><strong>Company size:</strong> 201-500 employees</p>
                            <p><strong>Industry:</strong> Software Development</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <button className="btn btn-outline-primary w-100 mb-10">
                                <Send size={18} /> Apply Now
                            </button>
                            <button className="btn btn-outline-info w-100 mb-10">
                                <MailCheck size={18} /> Email Job
                            </button>
                            <button className="btn btn-outline-warning w-100">
                                <Printer size={18} /> Print Job
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body text-start">
                            <h4 className="mb-10">Job Summary</h4>
                            <p className="mb-5"><strong>Posted:</strong> 3 days ago</p>
                            <p className="mb-5"><strong>Employment Type:</strong> Full-time</p>
                            <p className="mb-5"><strong>Job Function:</strong> Engineering</p>
                            <p className="mb-0"><strong>Industries:</strong> Software Development</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body text-start">
                            <h4 className="mb-10">Location</h4>
                            <div className="mb-3">
                                <p className="mb-5"><strong>TechSolutions Inc.</strong></p>
                                <p className="mb-5">123 Tech Street</p>
                                <p>San Francisco, CA 94105</p>
                            </div>
                            <div className="ratio ratio-16x9">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.53831530585!2d-122.4038466846826!3d37.78688297975939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d10af6e51%3A0x1122879c36e6d3aa!2s123%20Tech%20St%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" allowFullScreen={true} loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body text-start">
                            <h4 className="mb-10">Similar Jobs</h4>
                            <div className="mb-10">
                                <h6 className="mb-1"><a href="javascript:void(0);">Frontend Developer (React)</a></h6>
                                <p className="mb-1 text-muted">Digital Creations • San Francisco, CA</p>
                                <p className="mb-0">$110,000 - $140,000 a year</p>
                            </div>
                            <div className="mb-10">
                                <h6 className="mb-1"><a href="javascript:void(0);">UI Engineer</a></h6>
                                <p className="mb-1 text-muted">WebCraft • Remote</p>
                                <p className="mb-0">$115,000 - $145,000 a year</p>
                            </div>
                            <div>
                                <h6 className="mb-1"><a href="javascript:void(0);">JavaScript Developer</a></h6>
                                <p className="mb-1 text-muted">CodeMasters • Oakland, CA</p>
                                <p className="mb-0">$105,000 - $135,000 a year</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}