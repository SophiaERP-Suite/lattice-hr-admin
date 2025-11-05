import { Routes, Route, Navigate } from "react-router-dom";
import CandidateLayout from "../layout/CandidateLayout";
import CandidateDashboard from "../layout/CandidateDashboard";
import Dashboard from "../pages/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateLayout />}>
      
        <Route index element={<CandidateDashboard />} />
        <Route path="Dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
