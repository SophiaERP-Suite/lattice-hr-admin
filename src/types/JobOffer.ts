import type { Terms } from "./terms";

export type ProposalType = "Salary" | "StartDate" | "WorkMode" | "Benefits" | "WorkHours" | "Other";
export type ProposalStatus = "Pending" | "Accepted" | "Rejected" | "Countered";
export type UserType = "Candidate" | "Employer";

export interface JobOfferProposal {
  id: number;
  type: ProposalType;
  proposedValue: string;
  status: ProposalStatus;
}

export interface JobOfferDiscussion {
  id: number;
  jobOfferId: number;
  senderUserId: number;
  senderUserType: UserType;
  senderName: string;
  message: string;
  dateCreated: string;
  proposals: JobOfferProposal[];
}

export interface SendDiscussionMessageRequest {
  jobOfferId: number;
  message: string;
  proposals: {
    type: ProposalType;
    proposedValue: string;
  }[];
}

export interface OfferData {
  jobTitle: string;
  department: string;
  responsibeDepartment: string;
  responseInstructions: string;
  departmentPosition: string;
  introduction: string;
  letterTitle: string;
  level: string;
  employmentType: string;
  salary: number;
  currencySymbol: string;
  terms: string,
  netAnnualPay: string;
  netMonthlyPay: string;
  startDate: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  placeOfWork: string;
  benefits: string;
  otherInformation: string;
  reportingManager: string;
}

export interface JobOfferResponseDto {
  jobOfferId: number;
  jobApplicationId: number;
  employerId: number;

  grossAnnualSalary: number;
  netAnnualPay: number | null;
  netMonthlyPay: number | null;

  department: string | null;
  level: string | null;
  terms: string | null;
  employmentType: string | null;
  reportingManager: string | null;
  responsibleDepartment: string | null;
  responsibleOfficer: string | null;
  benefits: string | null;

  letterTitle: string;
  introduction: string | null;
  responseInstructions: string | null;
  otherInformation: string | null;

  workStartTime: string;
  workEndTime: string;
  startDate: string;
  expiryDate: string;
  currencySymbol: string;
  workDays: DayOfWeek[];

  offerDate: string;
  offerStatus: JobOfferStatus;
}

export type JobOfferStatus = 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired';

export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export interface JobOfferResponse {
  jobOfferId: number;
  jobApplicationId: number;
  employerId: number;

  grossAnnualSalary: number;
  netAnnualPay: number | null;
  netMonthlyPay: number | null;

  department: string | null;
  level: string | null;
  employmentType: string | null;
  reportingManager: string | null;
  responsibleDepartment: string | null;
  responsibleOfficer: string | null;
  benefits: string | null;

  letterTitle: string;
  introduction: string | null;
  responseInstructions: string;
  otherInformation: string | null;

  workStartTime: string;
  workEndTime: string;
  startDate: string;
  expiryDate: string;
  workDays: DayOfWeek[];

  offerDate: string;
  dateAccepted: string;
  dateRejected: string;
  offerStatus: JobOfferStatus;
  employer: EmployerDataDTO;
  job: JobDataDto;
  terms: Terms;
  jobSeeker: JobSeeker;
}

export interface EmployerDataDTO {
  businessName: string;
  country: string;
  state: string;
  city: string;
}

export interface JobSeeker {
  firstName: string;
  lastName: string;
  profilePhoto: string
}

export interface JobDataDto {
  jobId: number;
  jobTitle: string;
  currency: string
}

export interface JobOfferListItem {
  jobOfferId: number;
  jobApplicationId: number;
  grossAnnualSalary: number;
  expiryDate: string;
  offerDate: string;
  offerStatus: JobOfferStatus;
  jobSeeker: JobSeeker;
  job: JobDataDto;
  currencySymbol: string;
  currencyCode: string;
}
