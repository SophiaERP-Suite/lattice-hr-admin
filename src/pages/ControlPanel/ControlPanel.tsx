import { Briefcase, BriefcaseBusiness, ChevronRight, Columns3Cog, FileCog, FolderKanban, LocateFixed, Receipt, ShieldCheck, UserCog } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function ControlPanel() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Control Panel</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/ControlPanel">
                                        Control Panel
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
                <NavLink to="/ControlPanel/RoleMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-purple-transparent text-purple">
                                <ShieldCheck size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Role</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/ControlPanel/UserMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-success-transparent text-success">
                                <UserCog size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">User</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/ControlPanel/CurrencyMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                <Receipt size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Currency</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/ControlPanel/JobSectorMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <Columns3Cog size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Job Sector</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/ControlPanel/JobTypeMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-purple-transparent text-purple">
                                <Briefcase size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Job Type</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/ControlPanel/JobCategoryMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-success-transparent text-success">
                                <FolderKanban size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Job Category</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <NavLink to="/ControlPanel/WorkModeMgt" className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-info-transparent text-info">
                                <BriefcaseBusiness size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Work Mode</span>
                            </div>
                        </div>
                    </div>
                </NavLink>
                <div className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-primary-transparent text-primary">
                                <LocateFixed size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Location</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6 col-12">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-danger-transparent text-danger">
                                <FileCog size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Permission</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}