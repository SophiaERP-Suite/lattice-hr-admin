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