export interface InductionCategory {
  inductionCategoryId: string;
  name: string;
  description: string;
  dateCreated: string;
}

export interface InductionAssignment {
  assignmentId: number
  candidateName: string
  categoryName: string
  dateAssigned: string
  dateCompleted: string
  status: string
  assigned: boolean
  completedItemCount: number
  totalItemCount: number
}

export interface InductionLevel {
  dateCreated: string
  imageUrl: string
  inductionLevelId: number
  inductionLevelNo: number
  name: string
  status: string
}

export interface Category {
  inductionCategoryId: string;
  name: string;
  description: string;
  dateCreated: string;
}

export interface Section {
  inductionSectionId: string;
  sectionName: string;
  sortOrder: number;
  publishStatus: "Unpublished" | "Published";
  instructions?: string;
  itemCount: number;
  mandatoryCount: number;
  dateCreated: string;
  levelId: string;
}

export interface Level {
  inductionLevelId: string;
  name: string;
  inductionLevelNo: number;
  description?: string;
}
// | "Signature"
export type InductionItemType = "Text" | "Document" | "Video" | "Checklist" | "Quiz";

export interface ChecklistLine {
  id: string;
  lineText: string;
  sortOrder: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  sortOrder: number;
}

export interface InductionItem {
  inductionItemId: string;
  itemName: string;
  itemType: InductionItemType;
  itemContent: string;
  documentLink: string;
  isMandatory: boolean;
  sortOrder: number;
  sectionId: string;
  dateCreated: string;
  passMarkPercent?: number;
  checklistLines?: ChecklistLine[];
  quizQuestions?: QuizQuestion[];

  uploadedFile?: File | null;

  uploadedFilePath?: string | null;
}