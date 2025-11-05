import { Outlet } from "react-router-dom";
import avatar1 from "../assets/images/avatar/avatar-thumb-010.webp";
import john from "../assets/images/avatar/avatar-thumb-001.webp";
import mainLogo from "../assets/images/latty.png"
import {
  Bell,
  ChevronDown,
  CircleQuestionMark,
  CreditCard,
  LogOut,
  Search,
  UserCog2,
  UserRound,
} from "lucide-react";

function CandidateDashboard() {
  return (
    <div>
      {/* // <!-- Dashboard page wrapper start --> */}
      <div className="">
        {/* <!-- Start app-sidebar --> */}
        <aside className="app-sidebar sticky" id="sidebar">
          {/* <!-- start app-sidebar-header --> */}
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
              <ul className="app-sidebar-main-menu">
                <li className="sidebar-menu-category">
                  <span className="category-name">Main</span>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14 21C13.4477 21 13 20.5523 13 20V12C13 11.4477 13.4477 11 14 11H20C20.5523 11 21 11.4477 21 12V20C21 20.5523 20.5523 21 20 21H14ZM4 13C3.44772 13 3 12.5523 3 12V4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4V12C11 12.5523 10.5523 13 10 13H4ZM9 11V5H5V11H9ZM4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 3.44772 15 4 15H10C10.5523 15 11 15.4477 11 16V20C11 20.5523 10.5523 21 10 21H4ZM5 19H9V17H5V19ZM15 19H19V13H15V19ZM13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 20.5523 9 20 9H14C13.4477 9 13 8.55228 13 8V4ZM15 5V7H19V5H15Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Dashboard</span>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a className="sidebar-menu-item" href="#">
                        Ecommerce
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="index-2.html">
                        CRM
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="index-3.html">
                        HRM
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="index-4.html">
                        Job
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-menu-category">
                  <span className="category-name">Apps</span>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3.16113 4.46875C5.58508 2.0448 9.44716 1.9355 12.0008 4.14085C14.5528 1.9355 18.4149 2.0448 20.8388 4.46875C23.2584 6.88836 23.3716 10.741 21.1785 13.2947L13.4142 21.0858C12.6686 21.8313 11.4809 21.8652 10.6952 21.1874L10.5858 21.0858L2.82141 13.2947C0.628282 10.741 0.741522 6.88836 3.16113 4.46875ZM4.57534 5.88296C2.86819 7.59011 2.81942 10.3276 4.42902 12.0937L4.57534 12.2469L12 19.6715L17.3026 14.3675L13.7677 10.8327L12.7071 11.8934C11.5355 13.0649 9.636 13.0649 8.46443 11.8934C7.29286 10.7218 7.29286 8.8223 8.46443 7.65073L10.5656 5.54823C8.85292 4.17713 6.37076 4.23993 4.7286 5.73663L4.57534 5.88296ZM13.0606 8.71139C13.4511 8.32086 14.0843 8.32086 14.4748 8.71139L18.7168 12.9533L19.4246 12.2469C21.1819 10.4896 21.1819 7.64032 19.4246 5.88296C17.7174 4.17581 14.9799 4.12704 13.2139 5.73663L13.0606 5.88296L9.87864 9.06494C9.51601 9.42757 9.49011 9.99942 9.80094 10.3919L9.87864 10.4792C10.2413 10.8418 10.8131 10.8677 11.2056 10.5569L11.2929 10.4792L13.0606 8.71139Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">CRM Apps</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a href="crm-contacts.html" className="sidebar-menu-item">
                        Contacts
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="crm-companies.html"
                        className="sidebar-menu-item"
                      >
                        Companies
                      </a>
                    </li>
                    <li className="slide">
                      <a href="crm-deals.html" className="sidebar-menu-item">
                        Deals
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="crm-deals-details.html"
                        className="sidebar-menu-item"
                      >
                        Deals Overview
                      </a>
                    </li>
                    <li className="slide">
                      <a href="crm-leads.html" className="sidebar-menu-item">
                        Leads
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="crm-leads-details.html"
                        className="sidebar-menu-item"
                      >
                        Leads Overview
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 11C14.7614 11 17 13.2386 17 16V22H15V16C15 14.4023 13.7511 13.0963 12.1763 13.0051L12 13C10.4023 13 9.09634 14.2489 9.00509 15.8237L9 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5.5 14C5.77885 14 6.05009 14.0326 6.3101 14.0942C6.14202 14.594 6.03873 15.122 6.00896 15.6693L6 16L6.0007 16.0856C5.88757 16.0456 5.76821 16.0187 5.64446 16.0069L5.5 16C4.7203 16 4.07955 16.5949 4.00687 17.3555L4 17.5V22H2V17.5C2 15.567 3.567 14 5.5 14ZM18.5 14C20.433 14 22 15.567 22 17.5V22H20V17.5C20 16.7203 19.4051 16.0796 18.6445 16.0069L18.5 16C18.3248 16 18.1566 16.03 18.0003 16.0852L18 16C18 15.3343 17.8916 14.694 17.6915 14.0956C17.9499 14.0326 18.2211 14 18.5 14ZM5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5C3 9.11929 4.11929 8 5.5 8ZM18.5 8C19.8807 8 21 9.11929 21 10.5C21 11.8807 19.8807 13 18.5 13C17.1193 13 16 11.8807 16 10.5C16 9.11929 17.1193 8 18.5 8ZM5.5 10C5.22386 10 5 10.2239 5 10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5C6 10.2239 5.77614 10 5.5 10ZM18.5 10C18.2239 10 18 10.2239 18 10.5C18 10.7761 18.2239 11 18.5 11C18.7761 11 19 10.7761 19 10.5C19 10.2239 18.7761 10 18.5 10ZM12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">HRM Apps</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-employee-dashboard.html"
                        className="sidebar-menu-item"
                      >
                        Employee Dashboard
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-employee.html" className="sidebar-menu-item">
                        Employee
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-employee-details.html"
                        className="sidebar-menu-item"
                      >
                        Employee Details
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-designations.html"
                        className="sidebar-menu-item"
                      >
                        Designations
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-attendance.html"
                        className="sidebar-menu-item"
                      >
                        Admin Attendance
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-employee-attendance.html"
                        className="sidebar-menu-item"
                      >
                        Employee Attendance
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-biometric-attendance.html"
                        className="sidebar-menu-item"
                      >
                        Biometric Attendance
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-office-loan.html"
                        className="sidebar-menu-item"
                      >
                        Office Loan
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-personal-loan.html"
                        className="sidebar-menu-item"
                      >
                        Personal Loan
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-leaves.html" className="sidebar-menu-item">
                        Admin Leave
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-leaves-employee.html"
                        className="sidebar-menu-item"
                      >
                        Employee Leave
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-holidays.html" className="sidebar-menu-item">
                        Holidays
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-timesheet.html"
                        className="sidebar-menu-item"
                      >
                        Time Sheet
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-schedule.html" className="sidebar-menu-item">
                        Schedule
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-overtime.html" className="sidebar-menu-item">
                        Overtime
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-warning.html" className="sidebar-menu-item">
                        Warning
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-termination.html"
                        className="sidebar-menu-item"
                      >
                        Termination
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-training.html" className="sidebar-menu-item">
                        Training
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-resignation.html"
                        className="sidebar-menu-item"
                      >
                        Resignation
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a
                        href="hrm-promotion.html"
                        className="sidebar-menu-item"
                      >
                        Promotion
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-award.html" className="sidebar-menu-item">
                        Award
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-meeting.html" className="sidebar-menu-item">
                        Meeting
                      </a>
                    </li>
                    <li className="slide">
                      {" "}
                      <a href="hrm-transfer.html" className="sidebar-menu-item">
                        Transfer
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21 11.6458V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11.6458C2.37764 10.9407 2 10.0144 2 9V3C2 2.44772 2.44772 2 3 2H21C21.5523 2 22 2.44772 22 3V9C22 10.0144 21.6224 10.9407 21 11.6458ZM19 12.874C18.6804 12.9562 18.3453 13 18 13C16.8053 13 15.7329 12.4762 15 11.6458C14.2671 12.4762 13.1947 13 12 13C10.8053 13 9.73294 12.4762 9 11.6458C8.26706 12.4762 7.19469 13 6 13C5.6547 13 5.31962 12.9562 5 12.874V20H19V12.874ZM14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9C16 10.1046 16.8954 11 18 11C19.1046 11 20 10.1046 20 9V4H4V9C4 10.1046 4.89543 11 6 11C7.10457 11 8 10.1046 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Ecommerce Admin</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-product-list.html"
                      >
                        Products List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-product-grid.html"
                      >
                        Product Grid
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-add-product.html"
                      >
                        Add Products
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-edit-product.html"
                      >
                        Edit Products
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-product-details.html"
                      >
                        Product Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-order-list.html"
                      >
                        Order List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-order-details.html"
                      >
                        Order Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-cart.html"
                      >
                        Shop Cart
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-checkout.html"
                      >
                        Checkout
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-wishlist.html"
                      >
                        Shopping Wishlist
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-payment-methods.html"
                      >
                        Payment Methods
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-refund-requests.html"
                      >
                        Refund Requests
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-sellers.html"
                      >
                        Sellers
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-seller-details.html"
                      >
                        Seller Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-become-seller.html"
                      >
                        Become A Seller
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-customer-list.html"
                      >
                        Customers List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-add-customer.html"
                      >
                        Add Customer
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-manage-reviews.html"
                      >
                        Customer Reviews
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7.00488 7.99966V5.99966C7.00488 3.23824 9.24346 0.999664 12.0049 0.999664C14.7663 0.999664 17.0049 3.23824 17.0049 5.99966V7.99966H20.0049C20.5572 7.99966 21.0049 8.44738 21.0049 8.99966V20.9997C21.0049 21.5519 20.5572 21.9997 20.0049 21.9997H4.00488C3.4526 21.9997 3.00488 21.5519 3.00488 20.9997V8.99966C3.00488 8.44738 3.4526 7.99966 4.00488 7.99966H7.00488ZM7.00488 9.99966H5.00488V19.9997H19.0049V9.99966H17.0049V11.9997H15.0049V9.99966H9.00488V11.9997H7.00488V9.99966ZM9.00488 7.99966H15.0049V5.99966C15.0049 4.34281 13.6617 2.99966 12.0049 2.99966C10.348 2.99966 9.00488 4.34281 9.00488 5.99966V7.99966Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">
                      Ecommerce Customer
                    </span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-customer-details.html"
                      >
                        Customer Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-customer-billing.html"
                      >
                        Cards & Address
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-customer-tracker.html"
                      >
                        Track Order
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="ecommerce-customer-setting.html"
                      >
                        Setting
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7 5V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7ZM4 16V19H20V16H4ZM4 14H20V7H4V14ZM9 3V5H15V3H9ZM11 11H13V13H11V11Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Jobs Apps</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="apps-job-list.html"
                      >
                        Job List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="apps-job-details.html"
                      >
                        Job Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="apps-job-applicants-lists.html"
                      >
                        Applicants List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="apps-job-applicants-details.html"
                      >
                        Applicants Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="apps-job-categories.html"
                      >
                        Job Categories
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V19H19V11H17V9H20C20.5523 9 21 9.44772 21 10V19ZM5 5V19H13V5H5ZM7 11H11V13H7V11ZM7 7H11V9H7V7Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Company</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a className="sidebar-menu-item" href="companies.html">
                        Company
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="company-details.html"
                      >
                        Company Details
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM11.126 12H4V19H20V12H18.874C18.4299 13.7252 16.8638 15 15 15C13.1362 15 11.5701 13.7252 11.126 12ZM11.126 10C11.5701 8.27477 13.1362 7 15 7C16.8638 7 18.4299 8.27477 18.874 10H20V5H4V10H11.126ZM15 13C16.1046 13 17 12.1046 17 11C17 9.89543 16.1046 9 15 9C13.8954 9 13 9.89543 13 11C13 12.1046 13.8954 13 15 13ZM6 15H8V17H6V15Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Projects</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a className="sidebar-menu-item" href="project.html">
                        Projects
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="project-details.html"
                      >
                        Projects Details
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="project-create.html"
                      >
                        Create Projects
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM12.0049 20.0027C16.4232 20.0027 20.0049 16.421 20.0049 12.0027C20.0049 7.58447 16.4232 4.00275 12.0049 4.00275C7.5866 4.00275 4.00488 7.58447 4.00488 12.0027C4.00488 16.421 7.5866 20.0027 12.0049 20.0027ZM8.50488 14.0027H14.0049C14.281 14.0027 14.5049 13.7789 14.5049 13.5027C14.5049 13.2266 14.281 13.0027 14.0049 13.0027H10.0049C8.62417 13.0027 7.50488 11.8835 7.50488 10.5027C7.50488 9.12203 8.62417 8.00275 10.0049 8.00275H11.0049V6.00275H13.0049V8.00275H15.5049V10.0027H10.0049C9.72874 10.0027 9.50488 10.2266 9.50488 10.5027C9.50488 10.7789 9.72874 11.0027 10.0049 11.0027H14.0049C15.3856 11.0027 16.5049 12.122 16.5049 13.5027C16.5049 14.8835 15.3856 16.0027 14.0049 16.0027H13.0049V18.0027H11.0049V16.0027H8.50488V14.0027Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Payroll</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a className="sidebar-menu-item" href="payroll.html">
                        Payroll List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="payroll-payslip.html"
                      >
                        Payslip
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="payroll-payslip-create.html"
                      >
                        Payslip Create
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="payroll-payslip-edit.html"
                      >
                        Payslip Edit
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Invoice</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a className="sidebar-menu-item" href="invoice.html">
                        Invoice List
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="invoice-preview.html"
                      >
                        Invoice
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="invoice-create.html"
                      >
                        Invoice Create
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="invoice-edit.html">
                        Invoice Edit
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide">
                  <a href="contacts.html" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 7H24V9H19V7ZM17 12H24V14H17V12ZM20 17H24V19H20V17ZM2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Contacts</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="full-calendar.html" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Full Calendar</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="chat.html" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM10 3H14V5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17H14C17.3137 17 20 14.3137 20 11H22C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Chat</span>
                  </a>
                </li>
                <li className="slide">
                  <a href="email.html" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Email</span>
                  </a>
                </li>

                <li className="sidebar-menu-category">
                  <span className="category-name">Pages</span>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM12 7C13.1046 7 14 7.89543 14 9C14 9.73984 13.5983 10.3858 13.0011 10.7318L13 15H11L10.9999 10.7324C10.4022 10.3866 10 9.74025 10 9C10 7.89543 10.8954 7 12 7Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Authentication</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Sign In
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-signin-basic.html"
                          >
                            Basic
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-signin-cover.html"
                          >
                            Cover
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Sign Up
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-signup-basic.html"
                          >
                            Basic
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-signup-cover.html"
                          >
                            Cover
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Reset Password
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-reset-password-basic.html"
                          >
                            Basic
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-reset-password-cover.html"
                          >
                            Cover
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Forgot Password
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-forgot-password-basic.html"
                          >
                            Basic
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-forgot-password-cover.html"
                          >
                            Cover
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Lock Screen
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-lockscreen-basic.html"
                          >
                            Basic
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-lockscreen-cover.html"
                          >
                            Cover
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Coming Soon
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-coming-soon-basic.html"
                          >
                            Basic
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="auth-coming-soon-cover.html"
                          >
                            Cover
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="auth-maintenance.html"
                      >
                        Under Maintenance
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="auth-offline.html">
                        Offline
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Error</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="auth-404-error.html"
                      >
                        404 Basic
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="auth-404-error-cover.html"
                      >
                        404 Cover
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="auth-500-error.html"
                      >
                        500
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">User</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="app-user-account.html"
                      >
                        Account
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="app-user-billing.html"
                      >
                        Billing & Plans
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="app-user-security.html"
                      >
                        Security
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5 8V20H19V8H5ZM5 6H19V4H5V6ZM20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM7 10H11V14H7V10ZM7 16H17V18H7V16ZM13 11H17V13H13V11Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Pages</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Blog
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a className="sidebar-menu-item" href="blog.html">
                            Blog Grid
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="blog-list.html"
                          >
                            Blog List
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="blog-details.html"
                          >
                            Blog Details
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="blog-create.html"
                          >
                            Create Blog
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="search-results.html"
                      >
                        Search Result
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="team.html">
                        Team
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="timeline.html">
                        Timeline
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="faq.html">
                        FAq's
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="terms-conditions.html"
                      >
                        Terms & Conditions
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="privacy-policy.html"
                      >
                        Privacy & Policy
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="refund-policy.html"
                      >
                        Refund Policy
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="blank-page.html">
                        Blank Page
                      </a>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Pricing
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a className="sidebar-menu-item" href="pricing.html">
                            Pricing Plan
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            className="sidebar-menu-item"
                            href="pricing-details.html"
                          >
                            Pricing Details
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-menu-category">
                  <span className="category-name">Components</span>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 21C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4ZM8 10H5V19H8V10ZM19 10H10V19H19V10ZM19 5H5V8H19V5Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Base UI</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        href="ui-accordions.html"
                        className="sidebar-menu-item"
                      >
                        Accordion
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-alerts.html" className="sidebar-menu-item">
                        Alerts
                      </a>
                    </li>

                    <li className="slide">
                      <a href="ui-badges.html" className="sidebar-menu-item">
                        Badges
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-buttons.html" className="sidebar-menu-item">
                        Buttons
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-colors.html" className="sidebar-menu-item">
                        Colors
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-cards.html" className="sidebar-menu-item">
                        Cards
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-carousel.html" className="sidebar-menu-item">
                        Carousel
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-dropdowns.html" className="sidebar-menu-item">
                        Dropdowns
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="ui-list-group.html"
                        className="sidebar-menu-item"
                      >
                        List group
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-grid.html" className="sidebar-menu-item">
                        Grid
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-tabs.html" className="sidebar-menu-item">
                        Tabs
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-modals.html" className="sidebar-menu-item">
                        Modals
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-offcanvas.html" className="sidebar-menu-item">
                        Offcanvas
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="ui-pagination.html"
                        className="sidebar-menu-item"
                      >
                        Pagination
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="ui-placeholders.html"
                        className="sidebar-menu-item"
                      >
                        Placeholders
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-popovers.html" className="sidebar-menu-item">
                        Popovers
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-progress.html" className="sidebar-menu-item">
                        Progress
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-toasts.html" className="sidebar-menu-item">
                        Toasts
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-tooltip.html" className="sidebar-menu-item">
                        Tooltip
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="ui-embed-video.html"
                        className="sidebar-menu-item"
                      >
                        Embed Video
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-ribbons.html" className="sidebar-menu-item">
                        Ribbons
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-avatar.html" className="sidebar-menu-item">
                        Avatar
                      </a>
                    </li>
                    <li className="slide">
                      <a href="ui-link.html" className="sidebar-menu-item">
                        Link
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.0833 15.1999L21.2854 15.9212C21.5221 16.0633 21.5989 16.3704 21.4569 16.6072C21.4146 16.6776 21.3557 16.7365 21.2854 16.7787L12.5144 22.0412C12.1977 22.2313 11.8021 22.2313 11.4854 22.0412L2.71451 16.7787C2.47772 16.6366 2.40093 16.3295 2.54301 16.0927C2.58523 16.0223 2.64413 15.9634 2.71451 15.9212L3.9166 15.1999L11.9999 20.0499L20.0833 15.1999ZM20.0833 10.4999L21.2854 11.2212C21.5221 11.3633 21.5989 11.6704 21.4569 11.9072C21.4146 11.9776 21.3557 12.0365 21.2854 12.0787L11.9999 17.6499L2.71451 12.0787C2.47772 11.9366 2.40093 11.6295 2.54301 11.3927C2.58523 11.3223 2.64413 11.2634 2.71451 11.2212L3.9166 10.4999L11.9999 15.3499L20.0833 10.4999ZM12.5144 1.30864L21.2854 6.5712C21.5221 6.71327 21.5989 7.0204 21.4569 7.25719C21.4146 7.32757 21.3557 7.38647 21.2854 7.42869L11.9999 12.9999L2.71451 7.42869C2.47772 7.28662 2.40093 6.97949 2.54301 6.7427C2.58523 6.67232 2.64413 6.61343 2.71451 6.5712L11.4854 1.30864C11.8021 1.11864 12.1977 1.11864 12.5144 1.30864ZM11.9999 3.33233L5.88723 6.99995L11.9999 10.6676L18.1126 6.99995L11.9999 3.33233Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Advance UI</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        href="advance-ui-sweet-alert.html"
                        className="sidebar-menu-item"
                      >
                        Sweet Alerts
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="advance-ui-media-player.html"
                        className="sidebar-menu-item"
                      >
                        Media Player
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="advance-ui-rating.html"
                        className="sidebar-menu-item"
                      >
                        Rating
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="advance-ui-sortable.html"
                        className="sidebar-menu-item"
                      >
                        SortableJS
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="advance-ui-tour.html"
                        className="sidebar-menu-item"
                      >
                        Tour
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="advance-ui-animation.html"
                        className="sidebar-menu-item"
                      >
                        Animation
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="advance-ui-swiper.html"
                        className="sidebar-menu-item"
                      >
                        Swiper Slider
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Forms</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="form-basic-input.html"
                      >
                        Form Basic Input
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="form-checkboxs-radios.html"
                      >
                        Checkboxs & Radios
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-input-groups.html"
                      >
                        Forms Input Groups
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="forms-range.html">
                        Range
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-advance.html"
                      >
                        Form Advance
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-validation.html"
                      >
                        Form Validation
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="forms-layout.html">
                        Form Layout
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-editors.html"
                      >
                        Form Editors
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-date-and-time-pickr.html"
                      >
                        Date & Time Picker
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-file-uploads.html"
                      >
                        File Upload
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-select2.html"
                      >
                        Select2
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        className="sidebar-menu-item"
                        href="forms-custom-options.html"
                      >
                        Custom Option
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="forms-wizard.html">
                        Forms Wizard
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 8H20V5H4V8ZM14 19V10H10V19H14ZM16 19H20V10H16V19ZM8 19V10H4V19H8ZM3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Tables</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a className="sidebar-menu-item" href="tables.html">
                        Tables
                      </a>
                    </li>
                    <li className="slide">
                      <a className="sidebar-menu-item" href="data-tables.html">
                        Data Tables
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 12H5V21H3V12ZM19 8H21V21H19V8ZM11 2H13V21H11V2Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Charts</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Apexcharts
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            href="apex-charts-line.html"
                            className="sidebar-menu-item"
                          >
                            Line Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-area.html"
                            className="sidebar-menu-item"
                          >
                            Area Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-column.html"
                            className="sidebar-menu-item"
                          >
                            Column Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-bar.html"
                            className="sidebar-menu-item"
                          >
                            Bar Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-mixed.html"
                            className="sidebar-menu-item"
                          >
                            Mixed Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-range-area.html"
                            className="sidebar-menu-item"
                          >
                            Range Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-timeline.html"
                            className="sidebar-menu-item"
                          >
                            Timeline Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-funnel.html"
                            className="sidebar-menu-item"
                          >
                            Funnel Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-candlestick.html"
                            className="sidebar-menu-item"
                          >
                            Candlestick Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-box-whisker.html"
                            className="sidebar-menu-item"
                          >
                            Box & Whisker Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-pie.html"
                            className="sidebar-menu-item"
                          >
                            Pie Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-radial-bar.html"
                            className="sidebar-menu-item"
                          >
                            Radial Bar Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-radar.html"
                            className="sidebar-menu-item"
                          >
                            Radar Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-polar-area.html"
                            className="sidebar-menu-item"
                          >
                            Polar Area Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-treemap.html"
                            className="sidebar-menu-item"
                          >
                            Tree Map Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-heatmap.html"
                            className="sidebar-menu-item"
                          >
                            Heatmap Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-bubble.html"
                            className="sidebar-menu-item"
                          >
                            Bubble Charts
                          </a>
                        </li>
                        <li className="slide">
                          <a
                            href="apex-charts-scatter.html"
                            className="sidebar-menu-item"
                          >
                            Scatter Charts
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="slide">
                      <a href="chartjs.html" className="sidebar-menu-item">
                        Chart.js
                      </a>
                    </li>
                    <li className="slide">
                      <a href="echarts.html" className="sidebar-menu-item">
                        E Charts
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6.36461 6L15.1491 15.6629L15.8699 15.38C17.5538 14.719 18.7326 13.2237 18.9607 11.4839C18.8083 11.4946 18.655 11.5 18.501 11.5C15.2512 11.5 12.5584 9.11509 12.0774 6H6.36461ZM14.001 5C14.001 7.48528 16.0157 9.5 18.501 9.5C19.306 9.5 20.0617 9.28861 20.7155 8.91831C20.9013 9.53558 21.001 10.1891 21.001 10.8654C21.001 13.7561 19.1794 16.2295 16.6006 17.2417L20.001 21H3.00098V4H14.001C14.0381 4 14.0753 4.00028 14.1123 4.00085C14.0394 4.3222 14.001 4.65661 14.001 5ZM18.501 7.5C17.1203 7.5 16.001 6.38071 16.001 5C16.001 3.61929 17.1203 2.5 18.501 2.5C19.8817 2.5 21.001 3.61929 21.001 5C21.001 6.38071 19.8817 7.5 18.501 7.5ZM5.00098 7.47V19H15.481L5.00098 7.47Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Icons</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        href="icon-remixicon.html"
                        className="sidebar-menu-item"
                      >
                        Remix Icon
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="icon-tabler-icons.html"
                        className="sidebar-menu-item"
                      >
                        Tabler Icon
                      </a>
                    </li>
                    <li className="slide">
                      <a
                        href="icon-line-awesome.html"
                        className="sidebar-menu-item"
                      >
                        Line Awesome
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">Maps</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a href="maps-google.html" className="sidebar-menu-item">
                        Google
                      </a>
                    </li>
                    <li className="slide">
                      <a href="maps-vector.html" className="sidebar-menu-item">
                        Vector
                      </a>
                    </li>
                    <li className="slide">
                      <a href="maps-leaflet.html" className="sidebar-menu-item">
                        Leaflet
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-menu-category">
                  <span className="category-name">MultiLevel</span>
                </li>
                <li className="slide has-sub">
                  <a href="javascript:void(0);" className="sidebar-menu-item">
                    <div className="side-menu-icon">
                      <i className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M10 2C10.5523 2 11 2.44772 11 3V7C11 7.55228 10.5523 8 10 8H8V10H13V9C13 8.44772 13.4477 8 14 8H20C20.5523 8 21 8.44772 21 9V13C21 13.5523 20.5523 14 20 14H14C13.4477 14 13 13.5523 13 13V12H8V18H13V17C13 16.4477 13.4477 16 14 16H20C20.5523 16 21 16.4477 21 17V21C21 21.5523 20.5523 22 20 22H14C13.4477 22 13 21.5523 13 21V20H7C6.44772 20 6 19.5523 6 19V8H4C3.44772 8 3 7.55228 3 7V3C3 2.44772 3.44772 2 4 2H10ZM19 18H15V20H19V18ZM19 10H15V12H19V10ZM9 4H5V6H9V4Z"></path>
                        </svg>
                      </i>
                    </div>
                    <span className="sidebar-menu-label">MultiLevel Menu</span>
                     <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                  </a>
                  <ul className="sidebar-menu child1">
                    <li className="slide">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Level-1.0
                      </a>
                    </li>
                    <li className="slide has-sub">
                      <a
                        href="javascript:void(0);"
                        className="sidebar-menu-item"
                      >
                        Level-2.0
                         <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                      </a>
                      <ul className="sidebar-menu child2">
                        <li className="slide">
                          <a
                            href="javascript:void(0);"
                            className="sidebar-menu-item"
                          >
                            Level-2.1
                          </a>
                        </li>
                        <li className="slide has-sub">
                          <a
                            href="javascript:void(0);"
                            className="sidebar-menu-item"
                          >
                            Level-2.2
                             <ChevronDown size={16} className="ri-arrow-down-s-fill side-menu-angle"/>
                          </a>
                          <ul className="sidebar-menu child3">
                            <li className="slide">
                              <a
                                href="javascript:void(0);"
                                className="sidebar-menu-item"
                              >
                                Level-3.0
                              </a>
                            </li>
                            <li className="slide">
                              <a
                                href="javascript:void(0);"
                                className="sidebar-menu-item"
                              >
                                Level-3.0
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
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
                    {/* <!-- large screen logo --> */}
                    <a className="app-header-ls-dark-logo" href="#">
                      <img
                        src="../assets/images/logo/logo-black.svg"
                        alt="image"
                      />
                    </a>
                    <a className="app-header-ls-light-logo" href="#">
                      <img
                        src="../assets/images/logo/logo-white.svg"
                        alt="image"
                      />
                    </a>
                  </div>
                  <div className="app-header-mobile-logo">
                    <a className="app-header-dark-logo" href="#">
                      <img
                        src="../assets/images/logo/mobile-logo.svg"
                        alt="image"
                      />
                    </a>
                    <a className="app-header-light-logo" href="#">
                      <img
                        src="../assets/images/logo/mobile-logo-light.svg"
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
                    <i className="ri-search-line"></i>
                  </button>
                </div>
                {/* <div className="app-header-link">
                            <div className="dropdown">
                                <a className="dropdown-toggle" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="app-header-circle"><i className="ri-global-line"></i></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-lang" href="javascript:void(0);"><img src="assets/images/flags/us-flag.jpg" alt="image not found"/> English</a></li>
                                    <li><a className="dropdown-lang" href="javascript:void(0);"><img src="assets/images/flags/uae-flag.jpg" alt="image not found"/> العربية</a></li>
                                    <li><a className="dropdown-lang" href="javascript:void(0);"><img src="assets/images/flags/china-flag.jpg" alt="image not found"/> 中文</a></li>
                                    <li><a className="dropdown-lang" href="javascript:void(0);"><img src="assets/images/flags/spain-flag.jpg" alt="image not found"/> Español</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="app-header-switcher app-header-circle">
                            <div className="theme-switcher">
                                <i className="ri-sun-line change-theme theme-button"></i>
                            </div>
                        </div> */}

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
                        <span className="badge bg-label-primary">2 New</span>
                      </li>
                      <li className="dropdown-notifications-list card-scrollbar">
                        <ul>
                          <li className="dropdown-notifications-list-item">
                            <div className="avatar">
                              <img
                                className="radius-100"
                                src={john}
                                alt="image not found"
                              />
                            </div>
                            <div className="content">
                              <h6 className="mb-5">New Order Received 🛒</h6>
                              <p className="mb-5">
                                Order #14523 has been placed by John Doe
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
                          <li className="dropdown-notifications-list-item">
                            <div className="avatar">
                              <img
                                className="radius-100"
                                src={avatar1}
                                alt="image not found"
                              />
                            </div>
                            <div className="content">
                              <h6 className="mb-5">Low Stock Alert ⚠️</h6>
                              <p className="mb-5">
                                Only 3 items left in stock for "Smartwatch Pro
                                X"
                              </p>
                              <span className="text-body-secondary">
                                10 mins ago
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
                        <a href="app-user-billing.html">
                          <CreditCard
                            size={17}
                            style={{ marginRight: "7px" }}
                            className=""
                          />
                          Plans & Billing
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
                  <span className="text-heading">Dashnix</span> Designed by{" "}
                  <a href="https://themeforest.net/user/topylo" target="_blank">
                    Topylo
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
