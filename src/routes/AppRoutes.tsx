import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../layout/CandidateDashboard";
import Dashboard from "../pages/Dashboard";
import ClientMgt from "../pages/ClientMgt/ClientMgt";
import WorkersMgt from "../pages/WorkersMgt/WorkersMgt";
import ComplianceMgt from "../pages/ComplianceMgt/ComplianceMgt";
import TimeSheet from "../pages/TimeSheet/Timesheet";
import JobMgt from "../pages/JobMgt/JobMgt";
import FinanceMgt from "../pages/FinanceMgt/FinanceMgt";
import JobDetails from "../pages/JobMgt/JobDetails";
import Complaints from "../pages/Complaints/Complaints";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateDashboard />}>
      
        <Route index element={<Dashboard />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="ClientMgt" element={<ClientMgt />} />
        <Route path="WorkerMgt" element={<WorkersMgt />} />
        <Route path="ComplianceMgt" element={<ComplianceMgt />} />
        <Route path="Timesheet" element={<TimeSheet />} />
        <Route path="JobMgt" element={<JobMgt />} />
        <Route path="JobMgt/JobDetails" element={<JobDetails />} />
        <Route path="FinanceMgt" element={<FinanceMgt />} />
        <Route path="Complaints" element={<Complaints />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
