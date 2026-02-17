/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import avatar1 from "../assets/images/avatar/avatar-thumb-010.webp";
import john from "../assets/images/avatar/avatar-thumb-001.webp";
import mainLogo from "../assets/images/latty.png"
import miniLogo from "../assets/images/latty_mini.png"
import {
  Bell,
  CircleQuestionMark,
  LayoutDashboard,
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
  Users,
  ReceiptText,
} from "lucide-react";
import { useEffect, useState } from "react";
import Modal from 'react-modal';

const sidebarMenus = [
  {
    label: "Dashboard",
    path: "/Dashboard",
    icon: (<LayoutDashboard style={{ color: "#000"}} />)
  },
  {
    label: "Candidate",
    path: "/CandidateMgt",
    icon: (<BookUser style={{ color: "#000"}} />)
  },
  {
    label: "Client",
    path: "/ClientMgt",
    icon: (<Users style={{ color: "#000"}} />)
  },
  {
    label: "Workers",
    path: "/WorkerMgt",
    icon: (<ListChecks style={{ color: "#000"}} />)
  },
  {
    label: "Timesheet & Payslip",
    path: "/Timesheet",
    icon: (<ClipboardClock style={{ color: "#000"}} />)
  },
  {
    label: "Jobs",
    path: "/JobMgt",
    icon: (<BriefcaseBusiness style={{ color: "#000"}} />)
  },
  {
    label: "Packages",
    path: "/Packages",
    icon: (<Blocks style={{ color: "#000"}} />)
  },
  {
    label: "Contracts",
    path: "/Contracts",
    icon: (<ReceiptText style={{ color: "#000"}} />)
  },
  {
    label: "Revenue",
    path: "/RevenueMgt",
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

  useEffect(() => {
    Modal.setAppElement('#lattice-full-body');
  }, [])

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
                  <NavLink
                    to={`${item.path}`}
                    className={`sidebar-menu-item d-flex align-items-center text-decoration-none text-dark p-2 rounded ${
                      isCollapsed ? "justify-content-center" : ""
                    } ${itemIsActive ? "active" : ""}`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div className="me-2" style={{ paddingRight: "10px" }}>
                      {item.icon}
                    </div>
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
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
        id='lattice-full-body'
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
