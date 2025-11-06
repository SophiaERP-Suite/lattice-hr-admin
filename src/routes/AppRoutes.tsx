import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../layout/CandidateDashboard";
import Dashboard from "../pages/Dashboard";
import ClientMgt from "../pages/ClientMgt/ClientMgt";
import WorkersMgt from "../pages/WorkersMgt/WorkersMgt";
import ComplianceMgt from "../pages/ComplianceMgt/ComplianceMgt";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateDashboard />}>
      
        <Route index element={<Dashboard />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="ClientMgt" element={<ClientMgt />} />
        <Route path="WorkerMgt" element={<WorkersMgt />} />
        <Route path="ComplianceMgt" element={<ComplianceMgt />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
