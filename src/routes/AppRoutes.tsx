import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../layout/CandidateDashboard";
import Dashboard from "../pages/Dashboard";
import ClientMgt from "../pages/ClientMgt/ClientMgt";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateDashboard />}>
      
        <Route index element={<CandidateDashboard />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="ClientMgt" element={<ClientMgt />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
