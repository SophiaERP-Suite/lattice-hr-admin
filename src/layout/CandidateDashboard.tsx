/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import avatar1 from "../assets/images/avatar/avatar-thumb-010.webp";
import john from "../assets/images/avatar/avatar-thumb-001.webp";
import mainLogo from "../assets/images/latty.png"
import miniLogo from "../assets/images/latty_mini.png"
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
  Cog,
  ChevronLeft,
  Menu,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const sidebarMenus = [
  {
    label: "Dashboard",
    path: "/Dashboard",
    icon: (<LayoutDashboard style={{ color: "#000"}} />)
  },
  {
    label: "Client Management",
    path: "/ClientMgt",
    icon: (<BookUser style={{ color: "#000"}} />)
  },
  {
    label: "Workers Management",
    path: "/WorkerMgt",
    icon: (<ListChecks style={{ color: "#000"}} />)
  },
  {
    label: "Timesheet Management",
    path: "/Timesheet",
    icon: (<ClipboardClock style={{ color: "#000"}} />)
  },
  {
    label: "Jobs Management",
    path: "/JobMgt",
    icon: (<BriefcaseBusiness style={{ color: "#000"}} />)
  },
  {
    label: "Packages & Contracts",
    path: "/Packages",
    icon: (<Blocks style={{ color: "#000"}} />)
  },
  {
    label: "Finance Management",
    path: "/FinanceMgt",
    icon: (<CreditCard style={{ color: "#000"}} />)
  },
  {
    label: "Complaints",
    path: "/Complaints",
    icon: (<BadgeAlert style={{ color: "#000"}} />)
  },
  {
    label: "Control Panel",
    path: "/ControlPanel",
    icon: (<Cog style={{ color: "#000"}} />)
  },
];

export function CandidateDashboard() {
  return (
    <div className="body-area">
      <div className="page">
        <aside className="app-sidebar sticky" id="sidebar">
          <div className="app-sidebar-header">
            <NavLink to="/Dashboard" className="desktop-logo">
              <img src={mainLogo} alt="image" />
            </NavLink>
            <NavLink to="/Dashboard" className="desktop-dark">
              <img src={mainLogo} alt="image" />
            </NavLink>
          </div>
          {/* <!-- end app-sidebar-header --> */}

          {/* <!-- start app-sidebar-wrapper --> */}
          <div className="app-sidebar-wrapper" id="sidebar-scroll">
            <nav className="app-sidebar-menu-wrapper nav flex-column sub-open">
              <div className="sidebar-left" id="sidebar-left"></div>
              <ul className="app-sidebar-main-menu mt-4">
                <li className="sidebar-menu-category">
                  <p>ADMIN PORTAL</p>
                </li>
                <li className="slide">
                  <NavLink to="/Dashboard" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                      <LayoutDashboard style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Dashboard</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/ClientMgt" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                      <BookUser style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Client Management</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/WorkerMgt" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <Briefcase style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Workers Management</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/ComplianceMgt" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <ListChecks style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Compliance Management</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/Timesheet" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <ClipboardClock style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Timesheet Management</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/JobMgt" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <BriefcaseBusiness style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Jobs Management</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/Packages" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <Blocks style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Packages & Contracts</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/FinanceMgt" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <CreditCard style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Finance Management</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/Complaints" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <BadgeAlert style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Complaints</span>
                  </NavLink>
                </li>
                <li className="slide">
                  <NavLink to="/ControlPanel" className="sidebar-menu-item">
                    <div style={{ marginInlineEnd: "10px", color: "#000 !important" }}>
                       <Cog style={{ color: "#000"}} />
                    </div>
                    <span className="sidebar-menu-label" style={{ color: "#000" }}>Control Panel</span>
                  </NavLink>
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
                  <div className="app-header-ls-logo">
                    <NavLink to="/Dashboard" className="app-header-ls-dark-logo">
                      <img src={miniLogo} alt="image" style={{ width: '20px', height: 'auto' }} />
                    </NavLink>
                    <NavLink to="/Dashboard" className="app-header-ls-light-logo">
                      <img src={miniLogo} alt="image" style={{ width: '20px', height: 'auto' }} />
                    </NavLink>
                  </div>
                  <div className="app-header-mobile-logo">
                    <NavLink to="/Dashboard" className="app-header-dark-logo">
                      <img src={miniLogo} alt="image" style={{ width: '20px', height: 'auto' }} />
                    </NavLink>
                    <NavLink to="/Dashboard" className="app-header-light-logo">
                      <img src={miniLogo} alt="image" style={{ width: '20px', height: 'auto' }} />
                    </NavLink>
                  </div>
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
                        <h6 className="author-name lh-1">John Ogunsakin</h6>
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
          <div className="app-content-wrap">
            <Outlet />
          </div>
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

function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const isActive = (path?: string) => {
    if (!path) return false;
    const currentPath = location.pathname.replace(/^\//, "");
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  return (
    <div className="page">
      {/* <!-- Start app-sidebar --> */}
      <aside
        className={`app-sidebar sticky bg-white border-end shadow-sm ${
          isCollapsed ? "sidebar-mini" : "sidebar-full"
        } ${isMobileOpen ? "mobile-open" : ""}`}
        id="sidebar"
        style={{ transition: "all 0.3s ease" }}
      >
        {/* Logo */}
        <div className={`text-center py-3 border-bottom ${isMobileOpen && "d-flex justify-content-between align-items-center px-3 my-3"}`}>
          <img
            src={isCollapsed ? miniLogo : mainLogo}
            alt="Logo"
            style={{
              width: isCollapsed ? "72%" : isMobileOpen ? "74%" : "86%",
              padding: "5px",
            }}
          />
          {isMobileOpen && (
            <a onClick={() => setIsMobileOpen(!isMobileOpen)} style={{cursor: "pointer"}}>
              <ChevronLeft size={20} />
            </a>
          )}
        </div>

        {!isCollapsed && (
          <div
            className="sidebar-menu-category mb-2"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <span className="category-name" style={{ color: "#000" }}>
              {" "}
              ADMIN PORTAL{" "}
            </span>{" "}
          </div>
        )}

        {/* Menu */}
        <ul
          className={`list-unstyled mt-3 ${
            isCollapsed ? "text-center" : "px-3"
          }`}
        >
          {sidebarMenus.map((item, index) => {
            const itemIsActive = isActive(item.path);
            return (
              <li
                key={index}
                className="mb-2"
                style={{
                  margin: isCollapsed ? "10px 0px 10px 12px" : "0px",
                }}
              >
                {(
                  <Link
                    to={`/${item.path}`}
                    className={`sidebar-menu-item d-flex align-items-center text-decoration-none text-dark p-2 rounded ${
                      isCollapsed ? "justify-content-center" : ""
                    } ${itemIsActive ? "active" : ""}`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div className="me-2" style={{ paddingRight: "10px" }}>
                      {item.icon}
                    </div>
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="app-offcanvas-overlay"></div>
      <div
        className={`${isCollapsed ? "app-header-area2" : "app-header-area"}`}
      >
        <header className="app-header" id="header">
          <div className="app-header-inner">
            <div className="app-header-left">
              <div className="d-flex align-center gap-15">
                <div className="app-header-element">
                  <a
                    className="sidebar-toggle-bar"
                    id="sidebarToggle2"
                    style={{cursor: "pointer"}}
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                  >
                    <Menu />
                  </a>
                  <a
                    className="sidebar-toggle-bar"
                    id="sidebarToggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    {isCollapsed ? (
                      <ArrowRight className="cursor-pointer" />
                    ) : (
                      <ArrowLeft className="cursor-pointer" />
                    )}
                  </a>
                </div>
                <div className="app-header-ls-logo">
                  {/* <!-- large screen logo --> */}
                  <a className="app-header-ls-dark-logo" href="Dashboard">
                    <img src={mainLogo} alt="image" />
                  </a>
                  <a className="app-header-ls-light-logo" href="Dashboard">
                    <img src={mainLogo} alt="image" />
                  </a>
                </div>
                <div className="app-header-mobile-logo">
                  <a className="app-header-dark-logo" href="Dashboard">
                    <img src={miniLogo} alt="image" style={{ width: '20px', height: 'auto' }} />
                  </a>
                  <a className="app-header-light-logo" href="Dashboard">
                    <img src={miniLogo} alt="image" style={{ width: '20px', height: 'auto' }} />
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
                      <h6 className="author-name lh-1">John Ogunsakin</h6>
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
      
      <div
        className={`${isCollapsed ? "app-content-area2" : "app-content-area"}`}
      >
        <Outlet />
      </div>
      
      <footer className="app-footer-area">
        <div className="row">
          <div className="col-xl-12">
            <div className="card-footer d-flex justify-center">
              <p>
                © {new Date().getFullYear()} Powered by{" "}
                <a
                  className="text-primary-500 dark:text-primary-500 ml-1"
                  href="https://techiefy.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Techiefy UK
                </a>
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
                  <Search />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-wrap">
        <ArrowUp size={20} />
      </div>
    </div>
  );
}

export default AdminDashboard;
