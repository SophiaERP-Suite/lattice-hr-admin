import { useRef } from "react";

import {
  Plus, Trash2, CheckCircle,
  Upload, FileText, Video as VideoIcon, X
} from "lucide-react";
import type { InductionItem, ChecklistLine, QuizQuestion, InductionItemType } from "../types/induction";
import { ITEM_TYPES, itemMeta } from "../constants/ItemTypes";

interface Props {
  item: InductionItem;
  onUpdate: (patch: Partial<InductionItem>) => void;
}

export const buildInductionItemFormData = (item: InductionItem) => {
  const formData = new FormData();

  formData.append("ItemName", item.itemName);
  formData.append("ItemType", item.itemType);
  formData.append("ItemContent", item.itemContent ?? "");
  formData.append("DocumentLink", item.documentLink ?? "");
  formData.append("IsMandatory", String(item.isMandatory));
  formData.append("PassMarkPercent", String(item.passMarkPercent ?? 0));
  formData.append("SortOrder", String(item.sortOrder ?? 0));

  if (item.uploadedFile) {
    formData.append("UploadedFile", item.uploadedFile);
  }

  if (item.checklistLines) {
    item.checklistLines.forEach((line, i) => {
      formData.append(`ChecklistLines[${i}].Id`, line.id);
      formData.append(`ChecklistLines[${i}].LineText`, line.lineText);
      formData.append(`ChecklistLines[${i}].SortOrder`, String(line.sortOrder));
    });
  }

  if (item.quizQuestions) {
    item.quizQuestions.forEach((q, i) => {
      formData.append(`QuizQuestions[${i}].Id`, q.id);
      formData.append(`QuizQuestions[${i}].QuestionText`, q.questionText);
      formData.append(`QuizQuestions[${i}].OptionA`, q.optionA);
      formData.append(`QuizQuestions[${i}].OptionB`, q.optionB);
      formData.append(`QuizQuestions[${i}].OptionC`, q.optionC);
      formData.append(`QuizQuestions[${i}].OptionD`, q.optionD);
      formData.append(`QuizQuestions[${i}].CorrectOption`, q.correctOption);
      formData.append(`QuizQuestions[${i}].SortOrder`, String(q.sortOrder));
    });
  }

  return formData;
};


// FILE UPLOAD FIELD — shared by Document and Video =====================  
const FileUploadField = ({
  label, accept, hint, file, existingUrl,
  onFileChange, onUrlChange, urlPlaceholder, urlLabel, icon: Icon,
}: {
  label: string;
  accept: string;
  hint: string;
  file?: File | null;
  existingUrl: string;
  onFileChange: (f: File | null) => void;
  onUrlChange: (url: string) => void;
  urlPlaceholder: string;
  urlLabel: string;
  icon: React.ElementType;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="d-flex flex-column gap-2">
      <label className="form-label fs-12 mb-0">{label}</label>

      {/* Drop zone */}
      <div
        className="border rounded p-3 text-center"
        style={{
          borderStyle: "dashed",
          background: file ? "#f0fdf4" : "#fafafa",
          borderColor: file ? "#22c55e" : "#d1d5db",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <Icon size={16} className="text-success" />
            <span className="fs-13 text-success fw-semibold">{file.name}</span>
            <small className="text-muted">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </small>
            <button
              className="btn btn-sm p-0 ms-1"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <X size={14} className="text-danger" />
            </button>
          </div>
        ) : (
          <div>
            <Upload size={20} className="text-muted mb-1" />
            <p className="text-muted fs-13 mb-0">
              Click to upload or drag and drop
            </p>
            <small className="text-muted">{hint}</small>
          </div>
        )}
      </div>

      {/* OR divider */}
      <div className="d-flex align-items-center gap-2">
        <hr className="flex-grow-1 my-0" />
        <small className="text-muted px-1">or paste a URL</small>
        <hr className="flex-grow-1 my-0" />
      </div>

      {/* URL fallback */}
      <div>
        <label className="form-label fs-12 mb-1">{urlLabel}</label>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={urlPlaceholder}
          value={existingUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          disabled={!!file}
        />
        {file && (
          <small className="text-muted">
            Clear the uploaded file to use a URL instead
          </small>
        )}
      </div>
    </div>
  );
};

// CHECKLIST BUILDER

const ChecklistBuilder = ({
  lines, onChange,
}: {
  lines: ChecklistLine[];
  onChange: (lines: ChecklistLine[]) => void;
}) => {
  const addLine = () =>
    onChange([...lines, { id: crypto.randomUUID(), lineText: "", sortOrder: lines.length + 1 }]);

  const updateLine = (id: string, text: string) =>
    onChange(lines.map((l) => (l.id === id ? { ...l, lineText: text } : l)));

  const removeLine = (id: string) =>
    onChange(lines.filter((l) => l.id !== id).map((l, i) => ({ ...l, sortOrder: i + 1 })));

  return (
    <div>
      <label className="form-label fs-12">
        Checklist Lines
        <span className="text-muted ms-2 fw-normal fs-12">
          — each line becomes a checkbox for the candidate
        </span>
      </label>

      <div className="d-flex flex-column gap-2 mb-2">
        {lines.length === 0 && (
          <p className="text-muted fs-13 mb-1">No lines yet. Click Add Line below.</p>
        )}
        {lines.map((line, index) => (
          <div key={line.id} className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border flex-shrink-0" style={{ minWidth: 26 }}>
              {index + 1}
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. Collected access card"
              value={line.lineText}
              onChange={(e) => updateLine(line.id, e.target.value)}
            />
            <button className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={() => removeLine(line.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={addLine}>
        <Plus size={13} /> Add Line
      </button>
    </div>
  );
};


// QUIZ BUILDER

const QuizBuilder = ({
  questions, passMarkPercent, onChange, onPassMarkChange,
}: {
  questions: QuizQuestion[];
  passMarkPercent: number;
  onChange: (questions: QuizQuestion[]) => void;
  onPassMarkChange: (v: number) => void;
}) => {
  const addQuestion = () =>
    onChange([
      ...questions,
      {
        id: crypto.randomUUID(),
        questionText: "", optionA: "", optionB: "", optionC: "", optionD: "",
        correctOption: "A" as const,
        sortOrder: questions.length + 1,
      },
    ]);

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const removeQuestion = (id: string) =>
    onChange(questions.filter((q) => q.id !== id).map((q, i) => ({ ...q, sortOrder: i + 1 })));

  return (
    <div>
      {/* Pass mark */}
      <div className="mb-4">
        <label className="form-label fs-12">Pass Mark</label>
        <div className="input-group" style={{ maxWidth: 160 }}>
          <input
            type="number" className="form-control form-control-sm"
            min={1} max={100} value={passMarkPercent}
            onChange={(e) => onPassMarkChange(Number(e.target.value))}
          />
          <span className="input-group-text">%</span>
        </div>
        <small className="text-muted">Candidate needs {passMarkPercent}% or above to pass</small>
      </div>

      <label className="form-label fs-12">Questions</label>

      <div className="d-flex flex-column gap-3 mb-3">
        {questions.length === 0 && (
          <p className="text-muted fs-13">No questions yet. Click Add Question below.</p>
        )}
        {questions.map((q, qi) => (
          <div key={q.id} className="border rounded p-3" style={{ background: "#fff" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-primary">Question {qi + 1}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={() => removeQuestion(q.id)}>
                <Trash2 size={13} />
              </button>
            </div>

            <div className="mb-3">
              <input
                type="text" className="form-control form-control-sm"
                placeholder="e.g. What should you do if you see a fire hazard?"
                value={q.questionText}
                onChange={(e) => updateQuestion(q.id, { questionText: e.target.value })}
              />
            </div>

            <label className="form-label fs-12 mb-2">
              Options — <span className="text-muted fw-normal">click the circle to mark the correct answer</span>
            </label>

            <div className="d-flex flex-column gap-2">
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const isCorrect = q.correctOption === opt;
                const optKey = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                return (
                  <div
                    key={opt}
                    className="d-flex align-items-center gap-2 border rounded p-2"
                    style={{ background: isCorrect ? "#f0fdf4" : "white", borderColor: isCorrect ? "#22c55e" : "" }}
                  >
                    <button
                      className="btn p-0 flex-shrink-0"
                      onClick={() => updateQuestion(q.id, { correctOption: opt })}
                      style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: `2px solid ${isCorrect ? "#22c55e" : "#d1d5db"}`,
                        background: isCorrect ? "#22c55e" : "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {isCorrect && <CheckCircle size={12} color="white" />}
                    </button>

                    <span className="fw-bold text-muted flex-shrink-0" style={{ fontSize: 12, width: 16 }}>
                      {opt}
                    </span>

                    <input
                      type="text"
                      className="form-control form-control-sm border-0 p-0 bg-transparent"
                      placeholder={`Option ${opt}`}
                      value={q[optKey]}
                      onChange={(e) => updateQuestion(q.id, { [optKey]: e.target.value })}
                    />

                    {isCorrect && (
                      <span className="badge bg-success flex-shrink-0" style={{ fontSize: 10 }}>Correct</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={addQuestion}>
        <Plus size={13} /> Add Question
      </button>
    </div>
  );
};


// TYPE-SPECIFIC SWITCHER

const TypeSpecificFields = ({ item, onUpdate }: Props) => {
  switch (item.itemType) {

    case "Text":
      return (
        <div>
          <label className="form-label fs-12">Content / Instructions</label>
          <textarea
            className="form-control form-control-sm" rows={4}
            placeholder="Write the content or instructions here..."
            value={item.itemContent ?? ""}
            onChange={(e) => onUpdate({ itemContent: e.target.value })}
          />
        </div>
      );

    case "Document":
      return (
        <div className="d-flex flex-column gap-3">
          <FileUploadField
            label="Upload Document"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            hint="PDF, Word, PowerPoint, Excel — max 20MB"
            file={item.uploadedFile ?? null}
            existingUrl={item.documentLink ?? ""}
            onFileChange={(f) => onUpdate({ uploadedFile: f ?? undefined, documentLink: "" })}
            onUrlChange={(url) => onUpdate({ documentLink: url, uploadedFile: undefined })}
            urlPlaceholder="https://... or /uploads/file.pdf"
            urlLabel="Or paste document URL"
            icon={FileText}
          />
          <div>
            <label className="form-label fs-12">Description for candidate</label>
            <textarea
              className="form-control form-control-sm" rows={2}
              placeholder="e.g. Please read this document carefully before proceeding"
              value={item.itemContent ?? ""}
              onChange={(e) => onUpdate({ itemContent: e.target.value })}
            />
          </div>
        </div>
      );

    case "Video":
      return (
        <div className="d-flex flex-column gap-3">
          <FileUploadField
            label="Upload Video"
            accept="video/mp4,video/webm,video/ogg"
            hint="MP4, WebM, OGG — max 500MB"
            file={item.uploadedFile ?? null}
            existingUrl={item.documentLink ?? ""}
            onFileChange={(f) => onUpdate({ uploadedFile: f ?? undefined, documentLink: "" })}
            onUrlChange={(url) => onUpdate({ documentLink: url, uploadedFile: undefined })}
            urlPlaceholder="https://www.youtube.com/watch?v=..."
            urlLabel="Or paste YouTube / Vimeo URL"
            icon={VideoIcon}
          />
          <div>
            <label className="form-label fs-12">Instructions for candidate</label>
            <textarea
              className="form-control form-control-sm" rows={2}
              placeholder="e.g. Watch this welcome message from the CEO"
              value={item.itemContent ?? ""}
              onChange={(e) => onUpdate({ itemContent: e.target.value })}
            />
          </div>
        </div>
      );

    case "Checklist":
      return (
        <ChecklistBuilder
          lines={item.checklistLines ?? []}
          onChange={(lines) => onUpdate({ checklistLines: lines })}
        />
      );

    // case "Signature":
    //   return (
    //     <div className="d-none">
    //       <label className="form-label fs-12">
    //         Policy / statement candidate must read and sign
    //         <span className="text-danger ms-1">*</span>
    //       </label>
    //       <textarea
    //         className="form-control form-control-sm" rows={6}
    //         placeholder="Type or paste the full policy text here..."
    //         value={item.itemContent ?? ""}
    //         onChange={(e) => onUpdate({ itemContent: e.target.value })}
    //       />
    //       <small className="text-muted">
    //         Candidate will read this, then type their full name as a digital signature
    //       </small>
    //     </div>
    //   );

    case "Quiz":
      return (
        <QuizBuilder
          questions={item.quizQuestions ?? []}
          passMarkPercent={item.passMarkPercent ?? 70}
          onChange={(questions) => onUpdate({ quizQuestions: questions })}
          onPassMarkChange={(v) => onUpdate({ passMarkPercent: v })}
        />
      );

    default:
      return null;
  }
};


// MAIN EXPORT

const ItemEditorFields = ({ item, onUpdate }: Props) => {
  const meta = itemMeta(item.itemType);
  const Icon = meta.icon;

  return (
    <div className="border-top p-3" style={{ background: "#fafafa" }}>
      <div className="row g-3">

        <div className="col-md-8">
          <label className="form-label fs-12">Item Name <span className="text-danger">*</span></label>
          <input
            type="text" className="form-control form-control-sm"
            placeholder="e.g., Read Health & Safety Policy"
            value={item.itemName}
            onChange={(e) => onUpdate({ itemName: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fs-12">Type</label>
          <select
            className="form-select form-select-sm"
            value={item.itemType}
            onChange={(e) =>
              onUpdate({
                itemType: e.target.value as InductionItemType,
                itemContent: "",
                documentLink: "",
                uploadedFile: undefined,
                checklistLines: [],
                quizQuestions: [],
                passMarkPercent: 70,
              })
            }
          >
            {ITEM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <small className="d-flex align-items-center gap-1" style={{ color: meta.color }}>
            <Icon size={12} /> {meta.hint}
          </small>
        </div>

        <div className="col-12">
          <TypeSpecificFields item={item} onUpdate={onUpdate} />
        </div>

        <div className="col-12">
          <div className="form-check form-switch mb-0" style={{ paddingLeft: "2.5rem" }}>
            <input
              className="form-check-input" type="checkbox"
              id={`mandatory-${item.inductionItemId}`}
              checked={item.isMandatory}
              onChange={(e) => onUpdate({ isMandatory: e.target.checked })}
              style={{ width: "2em", height: "1.1em" }}
            />
            <label className="form-check-label fs-13" htmlFor={`mandatory-${item.inductionItemId}`}>
              Mandatory — candidate must complete this item to progress
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItemEditorFields;