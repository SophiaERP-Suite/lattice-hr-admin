export interface InterviewQuestion {
  interviewQuestionId: number;
  questionText: string;
  questionHint?: string;
  order: number;
}

export interface QuestionFormData {
  question: string;
  hint?: string;
  displayOrder: number;
}


export interface CandidateInterviewResponseDto {
  candidateInterviewResponseId: number;
  interviewQuestionId: number;
  jobId: number;
  jobSeekerId: number;
  audioUrl: string;
  dateCreated: string;
  jobSeeker: any | null;
}