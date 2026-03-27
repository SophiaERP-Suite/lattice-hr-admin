import { AlignLeft, CheckSquare, FileText, HelpCircle, Video } from "lucide-react";
import type { InductionItem, InductionItemType } from "../types/induction";

export const ITEM_TYPES = [
  { value: "Text", label: "Text", icon: AlignLeft, color: "#3b82f6", bg: "#eff6ff", hint: "Rich text content or instructions", hasLink: false, hasContent: true },
  { value: "Document", label: "Document", icon: FileText, color: "#f59e0b", bg: "#fffbeb", hint: "Upload or link to a PDF/document", hasLink: true, hasContent: true },
  { value: "Video", label: "Video", icon: Video, color: "#8b5cf6", bg: "#f5f3ff", hint: "YouTube or Vimeo URL", hasLink: true, hasContent: true },
  { value: "Checklist", label: "Checklist", icon: CheckSquare, color: "#10b981", bg: "#f0fdf4", hint: "List of items candidate must tick off", hasLink: false, hasContent: true },
  // { value: "Signature", label: "Signature", icon: Pen, color: "#ec4899", bg: "#fdf4ff", hint: "Candidate must type their name to sign", hasLink: false, hasContent: true },
  { value: "Quiz", label: "Quiz", icon: HelpCircle, color: "#ef4444", bg: "#fef2f2", hint: "Multiple choice questions with pass mark", hasLink: false, hasContent: true },
];

export const itemMeta = (type: InductionItemType) =>
  ITEM_TYPES.find(t => t.value === type) ?? ITEM_TYPES[0];

export const newItem = (order: number, sectionId: string): InductionItem => ({
  inductionItemId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  itemName: "",
  itemType: "Text",
  itemContent: "",
  documentLink: "",
  isMandatory: true,
  sortOrder: order,
  sectionId,
  dateCreated: new Date().toISOString(),
});