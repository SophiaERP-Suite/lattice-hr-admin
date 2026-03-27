import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle, Circle,
  FileText, Video, ClipboardList, PenLine,
  HelpCircle, AlignLeft, Eye, ChevronRight,
  CheckCheck
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import type { InductionItem, Section } from "../../types/induction";
import { getInductionSectionsBySectionId, getInductionItemsBySection } from "../../utils/InductionRequests";

const typeIcon: Record<string, React.ElementType> = {
  Text: AlignLeft,
  Document: FileText,
  Video: Video,
  Checklist: ClipboardList,
  Signature: PenLine,
  Quiz: HelpCircle,
};

const typeBadgeColor: Record<string, string> = {
  Text: "#6366f1",
  Document: "#f59e0b",
  Video: "#ef4444",
  Checklist: "#10b981",
  Signature: "#8b5cf6",
  Quiz: "#3b82f6",
};

const TextPreview = ({ item }: { item: InductionItem }) => (
  <div className="p-4 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
    <p className="mb-0" style={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
      {item.itemContent || <span className="text-muted fst-italic">No content provided</span>}
    </p>
  </div>
);

const DocumentPreview = ({ item }: { item: InductionItem }) => {
  const url = `${import.meta.env.VITE_API_URL}${item.documentLink}`;
  const isPdf = url?.toLowerCase().endsWith(".pdf");

  return (
    <div className="d-flex flex-column gap-3">
      {item.itemContent && (
        <p className="text-muted mb-0">{item.itemContent}</p>
      )}
      {url ? (
        isPdf ? (
          <iframe
            src={url}
            style={{ width: "100%", height: 500, border: "1px solid #e2e8f0", borderRadius: 8 }}
            title={item.itemName}
          />
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
            style={{ width: "fit-content" }}
          >
            <FileText size={16} /> Open Document
          </a>
        )
      ) : (
        <div className="text-muted fst-italic">No document attached</div>
      )}
    </div >
  );
};

const VideoPreview = ({ item }: { item: InductionItem }) => {
  const url = item.documentLink ?? "";
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = url.includes("vimeo.com");

  const getEmbedUrl = () => {
    if (isYoutube) {
      const id = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (isVimeo) {
      const id = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${id}`;
    }
    return `${import.meta.env.VITE_API_URL}${item.documentLink}`;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="d-flex flex-column gap-3">
      {item.itemContent && <p className="text-muted mb-0">{item.itemContent}</p>}
      {embedUrl ? (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 8, overflow: "hidden" }}>
          <iframe
            src={embedUrl}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            title={item.itemName}
          />
        </div>
      ) : url ? (
        <video controls style={{ width: "100%", borderRadius: 8, maxHeight: 400 }}>
          <source src={url} />
          Your browser does not support video playback.
        </video>
      ) : (
        <div className="text-muted fst-italic">No video attached</div>
      )}
    </div>
  );
};

const ChecklistPreview = ({ item }: { item: InductionItem }) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const lines = item.checklistLines ?? [];
  const allChecked = lines.length > 0 && lines.every(l => checked[l.id]);

  return (
    <div className="d-flex flex-column gap-2">
      {lines.length === 0 ? (
        <p className="text-muted fst-italic">No checklist lines defined</p>
      ) : (
        <>
          {lines.map(line => (
            <div
              key={line.id}
              className="d-flex align-items-center gap-3 p-3 rounded"
              style={{
                border: `1px solid ${checked[line.id] ? "#22c55e" : "#e2e8f0"}`,
                background: checked[line.id] ? "#f0fdf4" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => toggle(line.id)}
            >
              {checked[line.id]
                ? <CheckCircle size={18} color="#22c55e" />
                : <Circle size={18} color="#9ca3af" />
              }
              <span style={{ textDecoration: checked[line.id] ? "line-through" : "none", color: checked[line.id] ? "#6b7280" : "inherit" }}>
                {line.lineText}
              </span>
            </div>
          ))}

          {allChecked && (
            <div className="d-flex align-items-center gap-2 mt-2 p-2 rounded"
              style={{ background: "#f0fdf4", border: "1px solid #22c55e" }}>
              <CheckCircle size={16} color="#22c55e" />
              <small className="text-success fw-semibold">All items checked!</small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const QuizPreview = ({ item }: { item: InductionItem }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = item.quizQuestions ?? [];
  const passMark = item.passMarkPercent ?? 70;

  const score = submitted
    ? Math.round((questions.filter(q => answers[q.id] === q.correctOption).length / questions.length) * 100)
    : 0;
  const passed = score >= passMark;

  return (
    <div className="d-flex flex-column gap-4">
      {questions.length === 0 ? (
        <p className="text-muted fst-italic">No questions defined</p>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <small className="text-muted">{questions.length} question{questions.length !== 1 ? "s" : ""}</small>
            <small className="text-muted">Pass mark: <strong>{passMark}%</strong></small>
          </div>

          {questions.map((q, qi) => {
            const isAnswered = !!answers[q.id];
            const isCorrect = submitted && answers[q.id] === q.correctOption;
            const isWrong = submitted && isAnswered && !isCorrect;

            return (
              <div key={q.id} className="border rounded p-3"
                style={{ background: submitted ? (isCorrect ? "#f0fdf4" : isWrong ? "#fef2f2" : "white") : "white" }}>
                <p className="fw-semibold mb-3 fs-14">
                  <span className="badge bg-primary me-2">{qi + 1}</span>
                  {q.questionText}
                </p>

                <div className="d-flex flex-column gap-2">
                  {(["A", "B", "C", "D"] as const).map(opt => {
                    const optKey = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                    const optText = q[optKey];
                    if (!optText) return null;

                    const isSelected = answers[q.id] === opt;
                    const isCorrectOpt = q.correctOption === opt;
                    const showCorrect = submitted && isCorrectOpt;
                    const showWrong = submitted && isSelected && !isCorrectOpt;

                    return (
                      <div
                        key={opt}
                        className="d-flex align-items-center gap-2 p-2 rounded"
                        style={{
                          border: `1px solid ${showCorrect ? "#22c55e" : showWrong ? "#ef4444" : isSelected ? "#3b82f6" : "#e2e8f0"}`,
                          background: showCorrect ? "#f0fdf4" : showWrong ? "#fef2f2" : isSelected ? "#eff6ff" : "white",
                          cursor: submitted ? "default" : "pointer",
                          transition: "all 0.15s",
                        }}
                        onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          border: `2px solid ${showCorrect ? "#22c55e" : showWrong ? "#ef4444" : isSelected ? "#3b82f6" : "#d1d5db"}`,
                          background: isSelected ? (showWrong ? "#ef4444" : showCorrect ? "#22c55e" : "#3b82f6") : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                        </div>
                        <span className="fw-semibold" style={{ fontSize: 13, minWidth: 16 }}>{opt}.</span>
                        <span style={{ fontSize: 13 }}>{optText}</span>
                        {showCorrect && <CheckCircle size={14} color="#22c55e" className="ms-auto" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!submitted ? (
            <button
              className="btn btn-success"
              disabled={Object.keys(answers).length < questions.length}
              onClick={() => setSubmitted(true)}
            >
              <CheckCheck size={16} /> Save Answer & Continue
            </button>
          ) : (
            <div className="p-4 rounded text-center"
              style={{ background: passed ? "#f0fdf4" : "#fef2f2", border: `1px solid ${passed ? "#22c55e" : "#ef4444"}` }}>
              <div className="fs-2 fw-bold mb-1" style={{ color: passed ? "#16a34a" : "#dc2626" }}>{score}%</div>
              <div className="fw-semibold" style={{ color: passed ? "#16a34a" : "#dc2626" }}>
                {passed ? "🎉 Passed!" : "❌ Failed — below pass mark"}
              </div>
              <small className="text-muted">
                {questions.filter(q => answers[q.id] === q.correctOption).length} of {questions.length} correct
              </small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ItemPreviewRenderer = ({ item }: { item: InductionItem }) => {
  switch (item.itemType) {
    case "Text": return <TextPreview item={item} />;
    case "Document": return <DocumentPreview item={item} />;
    case "Video": return <VideoPreview item={item} />;
    case "Checklist": return <ChecklistPreview item={item} />;
    // case "Signature": return <SignaturePreview item={item} />;
    case "Quiz": return <QuizPreview item={item} />;
    default: return null;
  }
};

const InductionSectionPreview = () => {
  const { categoryId, levelId, sectionId, clientId } = useParams();
  const navigate = useNavigate();
  const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<InductionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const decodedSectionId = useMemo(() => {
    const decoded = hashIds.decode(String(sectionId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [sectionId]);

  const decodedEmployerId = useMemo(() => {
    const decoded = hashIds.decode(String(clientId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [clientId]);

  useEffect(() => {
    if (!decodedSectionId) return;
    (async () => {
      try {
        const [sectionRes, itemsRes] = await Promise.all([
          getInductionSectionsBySectionId(decodedSectionId, Number(decodedEmployerId)),
          getInductionItemsBySection(decodedSectionId, Number(decodedEmployerId)),
        ]);
        if (sectionRes.statusCode === 200) setSection(sectionRes.data);
        if (itemsRes.statusCode === 200) setItems(itemsRes.data ?? []);
      } catch {
        toast.error("Failed to load preview");
      } finally {
        setLoading(false);
      }
    })();
  }, [decodedSectionId]);

  const current = items[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;
  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;

  const TypeIcon = current ? (typeIcon[current.itemType] ?? AlignLeft) : AlignLeft;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">
        <ToastContainer />

        {/* Admin preview banner */}
        <div className="alert alert-warning d-flex align-items-center gap-2 py-2 mb-4" role="alert">
          <Eye size={16} />
          <span className="fs-13">
            <strong>Admin Preview</strong> — this is how candidates will see this module. Interactions are live for testing.
          </span>
          <button
            className="btn btn-sm btn-outline-warning ms-auto"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} /> Exit Preview
          </button>
        </div>

        {/* Page header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div>
                <h1 className="page-title fs-18 lh-1">{section?.sectionName || "Module Preview"}</h1>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">Preview</li>
                  <li className="breadcrumb-item">
                    <NavLink to={`/induction/programmes/${categoryId}/stages/${levelId}/modules/${sectionId}/items`}>Items</NavLink>
                  </li>
                  <li className="breadcrumb-item"><NavLink to={`/induction/programmes/${categoryId}/stages/${levelId}`}>Module</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to={`/induction/programmes/${categoryId}`}>Stage</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/induction">Induction</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Page header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div>
                <h1 className="page-title fs-18 lh-1">Instructions</h1>
                {section?.instructions && (
                  <p className="text-muted fs-13 mb-0 mt-1">{section.instructions}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">

          {/* Left — step-by-step item viewer */}
          <div className="col-xl-8">

            {/* Progress bar */}
            <div className="card mb-3">
              <div className="card-body mt-15 py-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted fw-semibold">
                    Item {currentIndex + 1} of {items.length}
                  </small>
                  <small className="text-muted">{Math.round(progress)}% complete</small>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${progress}%`, transition: "width 0.3s" }}
                  />
                </div>
              </div>
            </div>

            {/* Current item card */}
            {current && (
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center gap-2">
                  <span
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: 32, height: 32,
                      background: typeBadgeColor[current.itemType] + "20",
                      color: typeBadgeColor[current.itemType],
                      flexShrink: 0,
                    }}
                  >
                    <TypeIcon size={16} />
                  </span>
                  <div className="flex-grow-1">
                    <h5 className="mb-0">{current.itemName}</h5>
                  </div>
                  <span
                    className="badge"
                    style={{ background: typeBadgeColor[current.itemType] + "20", color: typeBadgeColor[current.itemType], fontSize: 11 }}
                  >
                    {current.itemType}
                  </span>
                  {current.isMandatory && (
                    <span className="badge bg-danger" style={{ fontSize: 10 }}>Mandatory</span>
                  )}
                </div>

                <div className="card-body mt-15">
                  <ItemPreviewRenderer item={current} />
                </div>

                {/* Navigation */}
                <div className="card-footer d-flex justify-content-between align-items-center mt-20">
                  <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setCurrentIndex(i => i - 1)}
                    disabled={isFirst}
                  >
                    <ArrowLeft size={14} /> Previous
                  </button>

                  {isLast ? (
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center gap-1"
                      onClick={() => navigate(-1)}
                    >
                      <CheckCircle size={14} /> Finish Preview
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => setCurrentIndex(i => i + 1)}
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — item index sidebar */}
          <div className="col-xl-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Module Contents</h6>
              </div>
              <div className="card-body mt-15 p-2">
                {items.map((item, idx) => {
                  const Icon = typeIcon[item.itemType] ?? AlignLeft;
                  const isCurrent = idx === currentIndex;
                  const isPast = idx < currentIndex;

                  return (
                    <div
                      key={item.inductionItemId}
                      className="d-flex align-items-center gap-2 p-2 rounded mb-1"
                      style={{
                        background: isCurrent ? "#eff6ff" : "transparent",
                        border: isCurrent ? "1px solid #bfdbfe" : "1px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      <span style={{ color: typeBadgeColor[item.itemType], flexShrink: 0 }}>
                        <Icon size={14} />
                      </span>
                      <span className="fs-13 flex-grow-1" style={{
                        color: isCurrent ? "#1d4ed8" : isPast ? "#6b7280" : "inherit",
                        fontWeight: isCurrent ? 600 : 400,
                      }}>
                        {item.itemName}
                      </span>
                      {isPast && <CheckCircle size={13} color="#22c55e" />}
                      {isCurrent && <ChevronRight size={13} color="#3b82f6" />}
                      {item.isMandatory && !isPast && !isCurrent && (
                        <span className="badge bg-danger" style={{ fontSize: 9 }}>req</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InductionSectionPreview;