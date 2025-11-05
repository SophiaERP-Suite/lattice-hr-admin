import { NavLink, Outlet } from "react-router-dom";
import avatar1 from "../assets/images/avatar/avatar-thumb-010.webp";
import john from "../assets/images/avatar/avatar-thumb-001.webp";
import mainLogo from "../assets/images/latty.png"
import {
  Bell,
  CircleQuestionMark,
  LayoutDashboard,
  Briefcase,
  ListChecks,
  ClipboardClock,
  BookUser,
  CreditCard,
  LogOut,
  Search,
  UserCog2,
  UserRound,
  BriefcaseBusiness,
  Blocks,
  BadgeAlert,
  FolderCog,
  UserCog,
} from "lucide-react";

function CandidateDashboard() {
  return (
    <div>
      <div className="">
        <aside className="app-sidebar sticky" id="sidebar">
          <div className="app-sidebar-header">
            <a href="#" className="desktop-logo">
              <img src={mainLogo} alt="image" />
            </a>
            <a href="#" className="desktop-dark">
              <img src="assets/images/logo/logo-white.svg" alt="image" />
            </a>
          </div>
          {/* <!-- end app-sidebar-header --> */}

          {/* <!-- start app-sidebar-wrapper --> */}
          <div className="app-sidebar-wrapper" id="sidebar-scroll">
            <nav className="app-sidebar-menu-wrapper nav flex-column sub-open">
              <div className="sidebar-left" id="sidebar-left"></div>
              <ul className="app-sidebar-main-menu mt-4">
                <li className="slide">
                  <NavLink to="/Dashboard" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <LayoutDashboard style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Dashboard</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <BookUser style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Client Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <Briefcase style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Workers Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <ListChecks style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Compliance Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <ClipboardClock style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Timesheet Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <BriefcaseBusiness style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Jobs Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <Blocks style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Package & Contract</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <CreditCard style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Finance Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <BadgeAlert style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Complaints</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <FolderCog style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">Role Management</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="#" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px" }}>
                      <UserCog style={{ color: "currentcolor"}} />
                    </div>
                    <span className="sidebar-menu-label">User Management</span>
                  </a>
                </li>
              </ul>
              <div className="sidebar-right" id="sidebar-right"></div>
            </nav>
          </div>
          {/* <!-- end app-sidebar-wrapper --> */}
        </aside>
        <div className="app-offcanvas-overlay"></div>
        {/* <!-- end app-sidebar --> */}

        {/* <!-- app-header --> */}
        <div className="app-header-area">
          <header className="app-header" id="header">
            <div className="app-header-inner">
              <div className="app-header-left">
                <div className="d-flex align-center gap-15">
                  <div className="app-header-element">
                    <a
                      className="sidebar-toggle-bar"
                      id="sidebarToggle"
                      href="javascript:void(0);"
                    >
                      <div className="sidebar-menu-bar">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </a>
                  </div>
                  <div className="app-header-ls-logo">
                    <a className="app-header-ls-dark-logo" href="#">
                      <img
                        src={mainLogo}
                        alt="image"
                      />
                    </a>
                    <a className="app-header-ls-light-logo" href="#">
                      <img
                        src={mainLogo}
                        alt="image"
                      />
                    </a>
                  </div>
                  <div className="app-header-mobile-logo">
                    <a className="app-header-dark-logo" href="#">
                      <img
                        src={mainLogo}
                        alt="image"
                      />
                    </a>
                    <a className="app-header-light-logo" href="#">
                      <img
                        src={mainLogo}
                        alt="image"
                      />
                    </a>
                  </div>
                </div>
                <div className="app-header-search d-none d-lg-block">
                  <form action="#">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search..."
                    />
                    <button type="submit">
                      <Search className="" />
                    </button>
                  </form>
                </div>
              </div>
              <div className="app-header-right">
                <div className="app-header-search-modal">
                  <button
                    type="button"
                    className="app-header-circle"
                    data-bs-toggle="modal"
                    data-bs-target="#searchModal"
                  >
                    <Search size={18} className="ri-search-line"/>
                  </button>
                </div>

                <div className="app-header-fullscreen app-header-circle cursor-pointer">
                  <div>
                    <CircleQuestionMark
                      size={18}
                      className="ri-fullscreen-line"
                    />
                  </div>
                </div>

                <div className="app-header-notification">
                  <div className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="javascript:void(0);"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="app-header-circle">
                        {" "}
                        <Bell size={18} className="ri-fullscreen-line" />
                      </span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="dropdown-menu-header">
                        <h5>Notification</h5>
                        <span className="badge bg-label-primary">1 New</span>
                      </li>
                      <li className="dropdown-notifications-list card-scrollbar">
                        <ul>
                          <li className="dropdown-notifications-list-item">
                            <div className="avatar">
                              <img
                                className="radius-100"
                                src={avatar1}
                                alt="image not found"
                              />
                            </div>
                            <div className="content">
                              <h6 className="mb-5">New Package Request 🛒</h6>
                              <p className="mb-5">
                                One Health has just placed a package upgrade request
                              </p>
                              <span className="text-body-secondary">
                                Just now
                              </span>
                            </div>
                            <div className="notifications-actions d-flex direction-column align-center">
                              <a
                                href="javascript:void(0);"
                                className="dropdown-notifications-read d-block pt-5"
                              >
                                <span className="bullet bg-primary"></span>
                              </a>
                              <a
                                href="javascript:void(0);"
                                className="dropdown-notifications-archive"
                              >
                                <i className="ri-close-line"></i>
                              </a>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li className="dropdown-notifications-btn">
                        <a
                          className="btn btn-primary w-100"
                          href="javascript:void(0);"
                        >
                          View all notifications
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="app-header-user">
                  <div className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="javascript:void(0);"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="author">
                        <div className="author-thumb">
                          <img src={john} alt="user" />
                        </div>
                        <h6 className="author-name lh-1">John Wick</h6>
                      </div>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="bd-user-info-list">
                        <a href="app-user-account.html">
                          <UserRound
                            size={17}
                            style={{ marginRight: "7px" }}
                            className=""
                          />
                          Profile
                        </a>
                      </li>
                      <li className="bd-user-info-list">
                        <a href="app-user-security.html">
                          <UserCog2
                            size={17}
                            style={{ marginRight: "7px" }}
                            className=""
                          />
                          Profile Settings
                        </a>
                      </li>
                      <li className="bd-user-info-list">
                        <a href="auth-signin-basic.html">
                          <LogOut
                            size={17}
                            style={{ marginRight: "7px" }}
                            className=""
                          />
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="body__overlay"></div>
        </div>
        {/* <!-- app-header --> */}

        {/* <!-- app-content-area-start --> */}
        <div className="app-content-area">
          <Outlet />
        </div>
        {/* <!-- app-content-area-end --> */}

        {/* <!-- footer area start --> */}
        <footer className="app-footer-area">
          <div className="row">
            <div className="col-xl-12">
              <div className="card-footer d-flex justify-center">
                <p>
                  Copyright © <span id="year"></span>{" "}
                  <span className="text-heading">Lattice HR</span> Designed by{" "}
                  <a href="https://sophiaerp.com/" target="_blank">
                    SophiaERP
                  </a>{" "}
                  All rights reserved
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* <!-- Search Modal Start --> */}
        <div className="modal fade" id="searchModal" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    id="button-addon1"
                  >
                    <i className="ri-search-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-wrap">
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div>
    </div>
  );
}

export default CandidateDashboard;
