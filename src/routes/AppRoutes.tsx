import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../layout/AdminDashboard";
import Dashboard from "../pages/Dashboard";
import ClientMgt from "../pages/ClientMgt/ClientMgt";
import WorkersMgt from "../pages/WorkersMgt/WorkersMgt";
import ComplianceMgt from "../pages/ComplianceMgt/ComplianceMgt";
import TimeSheet from "../pages/TimeSheet/Timesheet";
import JobMgt from "../pages/JobMgt/JobMgt";
import FinanceMgt from "../pages/FinanceMgt/FinanceMgt";
import JobDetails from "../pages/JobMgt/JobDetails";
import Complaints from "../pages/Complaints/Complaints";
import Packages from "../pages/Packages/Packages";
import ControlPanel from "../pages/ControlPanel/ControlPanel";
import RoleMgt from "../pages/ControlPanel/RoleMgt";
import UserMgt from "../pages/ControlPanel/UserMgt";
import IndustryMgt from "../pages/ControlPanel/IndustryMgt";
import CurrencyMgt from "../pages/ControlPanel/CurrencyMgt";
import PackageDetails from "../pages/Packages/PackageDetails";
import CandidatesMgt from "../pages/CandidateMgt/CandidatesMgt";
import PaymentDetails from "../pages/FinanceMgt/PaymentDetails";
import ClientDetails from "../pages/ClientMgt/ClientDetails";
import CandidateDetails from "../pages/CandidateMgt/CandidateDetails";
import JobSectorMgt from "../pages/ControlPanel/JobSectorMgt";
import JobTypeMgt from "../pages/ControlPanel/JobTypeMgt";
import JobCategoryMgt from "../pages/ControlPanel/JobCategoryMgt";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateDashboard />}>
      
        <Route index element={<Dashboard />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="ClientMgt" element={<ClientMgt />} />
        <Route path="ClientMgt/:id" element={<ClientDetails />} />
        <Route path="CandidateMgt" element={<CandidatesMgt />} />
        <Route path="CandidateMgt/:id" element={<CandidateDetails />} />
        <Route path="WorkerMgt" element={<WorkersMgt />} />
        <Route path="ComplianceMgt" element={<ComplianceMgt />} />
        <Route path="Timesheet" element={<TimeSheet />} />
        <Route path="JobMgt" element={<JobMgt />} />
        <Route path="JobMgt/:id" element={<JobDetails />} />
        <Route path="RevenueMgt" element={<FinanceMgt />} />
        <Route path="RevenueMgt/:id" element={<PaymentDetails />} />
        <Route path="Complaints" element={<Complaints />} />
        <Route path="Packages" element={<Packages />} />
        <Route path="Packages/:id" element={<PackageDetails />} />
        <Route path="ControlPanel" element={<ControlPanel />} />
        <Route path="ControlPanel/RoleMgt" element={<RoleMgt />} />
        <Route path="ControlPanel/UserMgt" element={<UserMgt />} />
        <Route path="ControlPanel/IndustryMgt" element={<IndustryMgt />} />
        <Route path="ControlPanel/CurrencyMgt" element={<CurrencyMgt />} />
        <Route path="ControlPanel/JobSectorMgt" element={<JobSectorMgt />} />
        <Route path="ControlPanel/JobTypeMgt" element={<JobTypeMgt />} />
        <Route path="ControlPanel/JobCategoryMgt" element={<JobCategoryMgt />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
