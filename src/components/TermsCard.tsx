import { useState, useEffect, type JSX, useRef } from "react";
import dayjs from "dayjs";
import {
  Plus, Edit, Save, X, CheckCircle, XCircle, AlertCircle,
  FileText, Shield, Lock, Home, Briefcase, FileSignature, PenTool
} from "lucide-react";
import { type Terms, TermsType } from "../types/terms";
import { toast } from "react-toastify";
import { CreateTerms, GetAllTerms, UpdateTerms } from "../utils/TermsRequest";
import RichTextEditor from "../layout/RichTextEditor";

const TERMS_META: Record<TermsType, { label: string; icon: JSX.Element; color: string }> = {
  [TermsType.EmploymentOffer]: { label: "Employment Offer", icon: <FileSignature size={18} />, color: "info" },
  [TermsType.NDA]: { label: "NDA", icon: <Lock size={18} />, color: "danger" },
  [TermsType.ContractorAgreement]: { label: "Contractor Agreement", icon: <Briefcase size={18} />, color: "warning" },
  [TermsType.PrivacyPolicy]: { label: "Privacy Policy", icon: <Shield size={18} />, color: "info" },
  [TermsType.CodeOfConduct]: { label: "Code of Conduct", icon: <PenTool size={18} />, color: "success" },
  [TermsType.RemoteWorkPolicy]: { label: "Remote Work Policy", icon: <Home size={18} />, color: "secondary" },
  [TermsType.Other]: { label: "Other", icon: <FileText size={18} />, color: "dark" },
};

interface Props {
  employerId: number
}

const TERM_TYPES = Object.values(TermsType);

const TermsCard = ({
  employerId
}: Props) => {
  const [activeTab, setActiveTab] = useState<TermsType>(TermsType.EmploymentOffer);
  const [viewMode, setViewMode] = useState<"view" | "edit" | "create">("view");
  const [termsList, setTermsList] = useState<Terms[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<Terms | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);

  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;

    const update = () => {
      const atStart = el.scrollLeft <= 4;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setShowLeftFade(!atStart);
      setShowRightFade(!atEnd);
    };

    update();
    el.addEventListener("scroll", update);

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  useEffect(() => { fetchAllTerms(); }, []);

  useEffect(() => {
    setSelectedTerms(
      termsList.find(t => t.termsType === activeTab) ?? null
    );
    setViewMode("view");
    setError(null);
  }, [activeTab, termsList]);

  const fetchAllTerms = async () => {
    try {
      setLoading(true);
      console.log("hhh id", employerId)
      const response = await GetAllTerms(employerId);
      console.log("Fetched terms:", response);

      if (Array.isArray(response)) {
        setTermsList(response);
      } else {
        setError("Unexpected response format");
      }
    } catch {
      setError("Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;

      if (viewMode === "create") {
        const fd = new FormData();
        fd.append("TermsType", activeTab);
        fd.append("Title", formData.title.trim());
        fd.append("Content", formData.content.trim());

        response = await CreateTerms(fd, employerId);
      } else {
        const fd = new FormData();
        fd.append("Title", formData.title.trim());
        fd.append("Content", formData.content.trim());

        response = await UpdateTerms(selectedTerms!.termsId, fd);
      }

      if (response) {
        toast.success(
          viewMode === "create"
            ? "Terms created successfully."
            : "Terms updated successfully."
        );

        await fetchAllTerms();
        setViewMode("view");
      } else {
        setError("Failed to save terms");
      }
    } catch {
      setError("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setFormData({ title: TERMS_META[activeTab].label, content: "" });
    setViewMode("create");
    setError(null);
  };

  const openEdit = () => {
    if (!selectedTerms) return;
    setFormData({ title: selectedTerms.title, content: selectedTerms.content });
    setViewMode("edit");
    setError(null);
  };

  const cancel = () => { setViewMode("view"); setError(null); };

  return (
    <div className="">

      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FileText size={18} className="me-2" />
          Terms & Conditions
        </h5>
        {viewMode === "view" && (
          <button className="btn btn-success btn-sm" onClick={openCreate} disabled={loading}>
            <Plus size={15} className="me-1" />
            New {TERMS_META[activeTab].label}
          </button>
        )}
      </div>

      <div className="card-body mt-15">

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button className="btn-close" onClick={() => setError(null)} />
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible">
            {success}
            <button className="btn-close" onClick={() => setSuccess(null)} />
          </div>
        )}

        {/* Type tabs */}
        <div style={{ position: "relative" }}>

          {/* Left fade */}
          {showLeftFade && (
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 48,
              background: "linear-gradient(to left, transparent, var(--bs-body-bg, white) 85%)",
              pointerEvents: "none", zIndex: 2,
              display: "flex", alignItems: "center", paddingLeft: 6,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {/* Scrollable nav */}
          <div
            ref={tabScrollRef}
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
            // Hide scrollbar in webkit
            className="hide-scrollbar"
          >
            <ul
              className="nav nav-tabs nav-fill mb-4"
              style={{ flexWrap: "nowrap", minWidth: "max-content", width: "100%" }}
            >
              {TERM_TYPES.map(type => (
                <li className="nav-item" key={type} style={{ flex: "0 0 auto" }}>
                  <button
                    className={`nav-link d-flex align-items-center justify-content-center gap-1 ${activeTab === type ? "active bg-info border-0" : ""}`}
                    onClick={() => setActiveTab(type)}
                    disabled={loading}
                  >
                    <span className={`text-${TERMS_META[type].color}`}>
                      {TERMS_META[type].icon}
                    </span>
                    <span className="d-none d-md-inline">{TERMS_META[type].label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right fade */}
          {showRightFade && (
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 56,
              background: "linear-gradient(to right, transparent, var(--bs-body-bg, white) 85%)",
              pointerEvents: "none", zIndex: 2,
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {/* Hint — only shows when there's actual overflow */}
          {showRightFade && (
            <p style={{ fontSize: 11, color: "#aaa", marginTop: 2, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Scroll to see more
            </p>
          )}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-5">
            <span className="spinner-border text-info" />
          </div>
        )}

        {!loading && (
          <>
            {/* ── VIEW ── */}
            {viewMode === "view" && selectedTerms && (
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className={`badge bg-${TERMS_META[selectedTerms.termsType].color}`}>
                        {TERMS_META[selectedTerms.termsType].label}
                      </span>
                      <h5 className="mb-0">{selectedTerms.title}</h5>
                    </div>

                    <small className="text-muted d-flex flex-wrap gap-2 align-items-center">
                      <span>v{selectedTerms.version}</span>
                      <span>·</span>
                      {selectedTerms.isActive
                        ? <span className="text-success"><CheckCircle size={13} className="me-1" />Active</span>
                        : <span className="text-danger"><XCircle size={13} className="me-1" />Inactive</span>}
                      <span>·</span>
                      <span>{dayjs(selectedTerms.dateCreated).format("DD MMM YYYY")}</span>
                      {selectedTerms.createdByName && (
                        <><span>·</span><span>by {selectedTerms.createdByName}</span></>
                      )}
                    </small>
                  </div>
                  <button className="btn btn-outline-warning btn-sm" onClick={openEdit}>
                    <Edit size={15} className="me-1" />Edit
                  </button>
                </div>

                <div
                  className="p-4 rounded border"
                  style={{ maxHeight: 480, overflowY: "auto", fontSize: "0.875rem" }}
                  dangerouslySetInnerHTML={{ __html: selectedTerms.content }}
                />
              </div>
            )}

            {/* ── EMPTY STATE ─ */}
            {viewMode === "view" && !selectedTerms && (
              <div className="text-center py-5">
                <AlertCircle size={44} className="text-muted mb-3" />
                <h5>No {TERMS_META[activeTab].label} Found</h5>
                <p className="text-muted">None created yet for this type.</p>
                <button className="btn btn-success" onClick={openCreate}>
                  <Plus size={15} className="me-1" />
                  Create {TERMS_META[activeTab].label}
                </button>
              </div>
            )}

            {/* ── CREATE / EDIT FORM ── */}
            {(viewMode === "create" || viewMode === "edit") && (
              <div>
                <h5 className="mb-4">
                  {viewMode === "create" ? "Create" : "Edit"} — {TERMS_META[activeTab].label}
                </h5>
                <p className="text-danger fs-13">Saving any info will result in a change on existing info!</p>
                <div className="row g-3">

                  {/* Title */}
                  <div className="col-md-8">
                    <label className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Standard Employment Offer v2"
                      value={formData.title}
                      onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Type</label>
                    <select
                      className="form-control"
                      value={activeTab}
                      onChange={e => setActiveTab(e.target.value as TermsType)}
                      disabled={viewMode === "edit"}
                    >
                      {TERM_TYPES.map(type => (
                        <option key={type} value={type}>{TERMS_META[type].label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Content */}
                  <div className="col-12">
                    <label className="form-label">
                      Content <span className="text-danger">*</span>
                    </label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={e => setFormData(p => ({ ...p, content: e }))}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                      <Save size={15} className="me-1" />
                      {loading ? "Saving…" : "Save Terms"}
                    </button>
                    <button className="btn btn-dark" onClick={cancel} disabled={loading}>
                      <X size={15} className="me-1" />Cancel
                    </button>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TermsCard;