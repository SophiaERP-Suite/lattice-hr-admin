import { Routes, Route } from "react-router-dom";
import CandidateDashboard from "../layout/AdminDashboard";
import Dashboard from "../pages/Dashboard";
import ClientMgt from "../pages/ClientMgt/ClientMgt";
import WorkersMgt from "../pages/WorkersMgt/WorkersMgt";
import ComplianceMgt from "../pages/ComplianceMgt/ComplianceMgt";
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
import WorkModeMgt from "../pages/ControlPanel/WorkModeMgt";
import ComplaintCategoryMgt from "../pages/ControlPanel/ComplaintCategoryMgt";
import ServiceTypeMgt from "../pages/ControlPanel/ServiceTypeMgt";
import Contracts from "../pages/ContractMgt/Contracts";
import RequestDetails from "../pages/ContractMgt/RequestsDetails";
import ResponsibilityTypeMgt from "../pages/ControlPanel/ResponsibilityTypeMgt";
import ContractDetails from "../pages/ContractMgt/ContractDetails";
import WorkerDetails from "../pages/WorkersMgt/WorkerDetails";
import JobApplication from "../pages/JobMgt/JobApplications";
import JobApplicationDetails from "../pages/JobMgt/JobApplicationDetails";
import JobOfferFormNew from "../pages/JobMgt/JobOfferFormNew";
import JobOfferDetails from "../pages/JobMgt/JobOfferDetails";
import InductionCategoryLevels from "../pages/Induction/CreateInductionLevel";
import InductionLevelSections from "../pages/Induction/CreateInductionSection";
import InductionSectionItems from "../pages/Induction/CreateInductionItem";
import InductionSectionPreview from "../pages/Induction/InductionSectionPreview";
import TimeOffRequests from "../pages/Leave/TimeOffRequests";
import EmployerTimesheets from "../pages/timesheet/GeneralTimeSheet";
import EmployeeTimesheets from "../pages/timesheet/TimeSheet";
import EmployeeLeaveRequests from "../pages/Leave/LeaveRequest";
import InterviewQuestionsPageLocal from "../pages/JobMgt/InterviewQuestionsForm";

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
        <Route path="ClientMgt/WorkerDetails/:jobSeekerId/:clientId" element={<WorkerDetails />} />
        {/* <Route path="WorkerMgt/:id" element={<WorkerDetails />} /> */}
        <Route path="ComplianceMgt" element={<ComplianceMgt />} />
        <Route path="JobMgt" element={<JobMgt />} />
        <Route path="JobMgt/:id/:clientId" element={<JobDetails />} />
        <Route path="RevenueMgt" element={<FinanceMgt />} />
        <Route path="RevenueMgt/:id" element={<PaymentDetails />} />
        <Route path="Complaints" element={<Complaints />} />
        <Route path="Packages" element={<Packages />} />
        <Route path="Packages/:id" element={<PackageDetails />} />
        <Route path="Contracts" element={<Contracts />} />
        <Route path="Contracts" element={<Contracts />} />
        <Route path="Contracts/Requests/:id" element={<RequestDetails />} />
        <Route path="Contracts/:id" element={<ContractDetails />} />
        <Route path="ControlPanel" element={<ControlPanel />} />
        <Route path="ControlPanel/RoleMgt" element={<RoleMgt />} />
        <Route path="ControlPanel/UserMgt" element={<UserMgt />} />
        <Route path="ControlPanel/IndustryMgt" element={<IndustryMgt />} />
        <Route path="ControlPanel/CurrencyMgt" element={<CurrencyMgt />} />
        <Route path="ControlPanel/JobSectorMgt" element={<JobSectorMgt />} />
        <Route path="ControlPanel/JobTypeMgt" element={<JobTypeMgt />} />
        <Route path="ControlPanel/ServiceTypeMgt" element={<ServiceTypeMgt />} />
        <Route path="ControlPanel/JobCategoryMgt" element={<JobCategoryMgt />} />
        <Route path="ControlPanel/WorkModeMgt" element={<WorkModeMgt />} />
        <Route path="ControlPanel/ComplaintCategoryMgt" element={<ComplaintCategoryMgt />} />
        <Route path="ControlPanel/ResponsibilityTypeMgt" element={<ResponsibilityTypeMgt />} />
        <Route path="JobDetails/JobApplications/:id/:clientId" element={<JobApplication />} />
        <Route path="JobDetails/JobApplications/JobApplicationDetails/:id/:clientId" element={<JobApplicationDetails />} />
        <Route path="JobOfferForm/:id/:clientId" element={<JobOfferFormNew />} />
        <Route path="JobOfferDetails/:id/:clientId" element={<JobOfferDetails />} />
        <Route path="ClientMgt/Induction/Programmes/:categoryId/:clientId" element={<InductionCategoryLevels />} />
        <Route path="ClientMgt/Induction/Programmes/:categoryId/Stages/:levelId/:clientId" element={<InductionLevelSections />} />
        <Route path="ClientMgt/Induction/Programmes/:categoryId/Stages/:levelId/Modules/:sectionId/Items/:clientId" element={<InductionSectionItems />} />
        <Route
          path="ClientMgt/Induction/Programmes/:categoryId/Stages/:levelId/Modules/:sectionId/Items-Preview/:clientId"
          element={<InductionSectionPreview />}
        />

        <Route path="ClientMgt/Timesheet/:employeeId/:employeeName/:clientId" element={<EmployeeTimesheets />} />
        <Route path="ClientMgt/Timesheet/:clientId" element={<EmployerTimesheets />} />
        <Route path="ClientMgt/TimeOffRequests/:employeeId/:employeeName/:clientId" element={<EmployeeLeaveRequests />} />
        <Route path="ClientMgt/TimeOffRequests/:clientId" element={<TimeOffRequests />} />
        <Route
          path="/JobDetails/Interview/:jobId/:clientId"
          element={<InterviewQuestionsPageLocal />}
        />
      </Route>
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default AppRoutes;
