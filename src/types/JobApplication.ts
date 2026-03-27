import type { UserDto } from "../pages/JobMgt/JobApplications";

export interface ApplicationTimelineDto {
    createdByName: string;
    createdByUserId: number;
    dateCreated: string;
    description: string;
    eventType: string;
    timelineId: number;
}

export interface CandidateReferences {
    dateCreated: string;
    description: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    referenceId: number;
    referenceType: string;
    referenceTypeId: number;
}

export const getTimelineStyle = (eventType: string) => {
    switch (eventType) {
        case "ApplicationSubmitted":
            return { bg: "bg-success", title: "Application Submitted" };

        case "ApplicationShortlisted":
            return { bg: "bg-primary", title: "Application Shortlisted" };

        case "ApplicationRejected":
            return { bg: "bg-danger", title: "Application Rejected" };

        case "InterviewScheduled":
            return { bg: "bg-warning", title: "Interview Scheduled" };

        case "OfferSent":
            return { bg: "bg-info", title: "Offer Sent" };

        case "OfferAccepted":
            return { bg: "bg-success", title: "Offer Accepted" };

        case "StatusChanged":
            return { bg: "bg-secondary", title: "Status Updated" };

        default:
            return { bg: "bg-dark", title: eventType };
    }
};

export interface JobApplicationDto {
    jobApplicationId: number;
    jobTitle: string;
    jobId: number;
    status: JobApplicationStatus;
    applDate: string;
    applicantName: string;
    coverLetter: string;
    comment: string;
    resume: string;
    jobSeeker: UserDto;
    rating: number;
}


export type JobApplicationStatus =
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "interview"
    | "selfInterview"
    | "hired";
