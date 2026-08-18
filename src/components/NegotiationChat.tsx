import { useEffect, useRef, useState } from "react";
import { Send, Plus, X, MessageSquare, Loader, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import dayjs from "dayjs";
import type { ProposalType, JobOfferDiscussion, SendDiscussionMessageRequest, JobOfferProposal } from "../types/JobOffer";
import { GetDiscussions, SendDiscussionMessage, UpdateProposalStatus } from "../utils/Negotiation";

interface NegotiationChatProps {
  jobOfferId: number;
  currentUserId: number;
  currentUserType: "Candidate" | "Employer";
  currentUserName: string;
}

interface DraftProposal {
  type: ProposalType;
  proposedValue: string;
}

const PROPOSAL_TYPES: ProposalType[] = [
  "Salary", "StartDate", "WorkMode", "Benefits", "WorkHours", "Other",
];

const PROPOSAL_LABELS: Record<ProposalType, string> = {
  Salary: "Salary",
  StartDate: "Start Date",
  WorkMode: "Work Mode",
  Benefits: "Benefits",
  WorkHours: "Work Hours",
  Other: "Other",
};

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-warning text-dark",
  Accepted: "bg-success",
  Rejected: "bg-danger",
};

export default function NegotiationChat({
  jobOfferId,
  currentUserId,
  currentUserType,
  // currentUserName,
}: NegotiationChatProps) {
  const [messages, setMessages] = useState<JobOfferDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [draftProposals, setDraftProposals] = useState<DraftProposal[]>([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [newProposal, setNewProposal] = useState<DraftProposal>({ type: "Salary", proposedValue: "" });
  const [updatingProposalId, setUpdatingProposalId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const isEmployer = currentUserType === "Employer";
  const isCandidate = currentUserType === "Candidate";

  useEffect(() => { fetchMessages(); }, [jobOfferId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await GetDiscussions(jobOfferId);
      setMessages(data);
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  // ── Candidate: draft proposals ────────────────────────────────────────────

  const addProposal = () => {
    if (!newProposal.proposedValue.trim()) return;
    setDraftProposals((prev) => [...prev, { ...newProposal }]);
    setNewProposal({ type: "Salary", proposedValue: "" });
    setShowProposalForm(false);
  };

  const removeProposal = (index: number) => {
    setDraftProposals((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Send message (both sides) ─────────────────────────────────────────────

  const handleSend = async () => {
    if (!message.trim() && draftProposals.length === 0) return;
    setError(null);
    setSending(true);
    const payload: SendDiscussionMessageRequest = {
      jobOfferId,
      message: message.trim(),
      proposals: draftProposals,
    };
    console.log("gdgdgfg id", currentUserId)
    try {
      const newMsg = await SendDiscussionMessage(payload, currentUserId);
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
      setDraftProposals([]);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Employer: accept or reject a proposal ────────────────────────────

  const handleProposalAction = async (
    proposalId: number,
    status: "Accepted" | "Rejected"
  ) => {
    setUpdatingProposalId(proposalId);
    try {
      await UpdateProposalStatus(proposalId, status);

      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          proposals: msg.proposals.map((p) =>
            p.id === proposalId ? { ...p, status } : p
          ),
        }))
      );

      const actionMessage = status === "Accepted"
        ? "✅ I accept this proposal."
        : "❌ I reject this proposal.";

      const returnMsg: SendDiscussionMessageRequest = {
        jobOfferId,
        message: actionMessage,
        proposals: [],
      };

      const newMsg = await SendDiscussionMessage(returnMsg, currentUserId);
      setMessages((prev) => [...prev, newMsg]);

    } catch {
      setError("Failed to update proposal. Please try again.");
    } finally {
      setUpdatingProposalId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      {/* Header */}
      <div className="card-header text-white d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <MessageSquare size={16} className="text-black" />
          <h6 className="mb-0">Negotiation Chat</h6>
        </div>
        <span className="badge bg-info">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Messages */}
      <div
        className="card-body p-3"
        style={{ height: "360px", overflowY: "auto", backgroundColor: "#f8f9fa" }}
      >
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-sm text-primary" />
            <p className="text-muted small mt-2 mb-0">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-5">
            <MessageSquare size={32} className="text-muted mb-2" />
            <p className="text-muted small mb-0">
              {isEmployer
                ? "The candidate has not sent any messages yet."
                : "No messages yet. Start the negotiation."}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = msg.senderUserType === "Employer";
              return (
                <div
                  key={msg.id}
                  className={`d-flex flex-column mb-3 ${isMe ? "align-items-end" : "align-items-start"}`}
                >
                  <small className="text-muted mb-1 px-1">
                    {isMe ? "You" : msg.senderName} · {dayjs(msg.dateCreated).format("DD MMM, h:mm A")}
                  </small>

                  {msg.message && (
                    <div
                      className="px-3 py-2 rounded-3 mb-1"
                      style={{
                        maxWidth: "85%",
                        backgroundColor: isMe ? "#0d6efd" : "#ffffff",
                        color: isMe ? "#fff" : "#212529",
                        border: isMe ? "none" : "1px solid #dee2e6",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {msg.message}
                    </div>
                  )}

                  {msg.proposals?.length > 0 && (
                    <div className="d-flex flex-column gap-2 mt-1" style={{ maxWidth: "90%" }}>
                      {msg.proposals.map((p: JobOfferProposal) => {
                        const isPending = p.status === "Pending";
                        // Employer can act only on candidate's pending proposals (not their own)
                        const canAct = isEmployer && !isMe && isPending;

                        return (
                          <div
                            key={p.id}
                            className="rounded-3 overflow-hidden"
                            style={{ border: "1px solid #dee2e6", backgroundColor: "#fff" }}
                          >
                            {/* Proposal info */}
                            <div
                              className="d-flex align-items-center gap-2 px-3 py-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              <span className="text-muted" style={{ minWidth: "80px" }}>
                                {PROPOSAL_LABELS[p.type as ProposalType] ?? p.type}
                              </span>
                              <strong className="flex-grow-1">{p.proposedValue}</strong>
                              <span className={`badge ${STATUS_BADGE[p.status] ?? "bg-secondary"}`}>
                                {p.status}
                              </span>
                            </div>

                            {/* Employer action buttons */}
                            {canAct && (
                              <div className="d-flex" style={{ borderTop: "1px solid #dee2e6" }}>
                                <button
                                  className="btn btn-sm btn-success flex-grow-1 rounded-0"
                                  style={{ fontSize: "0.75rem" }}
                                  disabled={updatingProposalId === p.id}
                                  onClick={() => handleProposalAction(p.id, "Accepted")}
                                >
                                  <ThumbsUp size={12} className="me-1" />Accept
                                </button>
                                <button
                                  className="btn btn-sm btn-danger flex-grow-1 rounded-0"
                                  style={{ fontSize: "0.75rem" }}
                                  disabled={updatingProposalId === p.id}
                                  onClick={() => handleProposalAction(p.id, "Rejected")}
                                >
                                  <ThumbsDown size={12} className="me-1" />Reject
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-3 pt-2">
          <div className="alert alert-danger py-2 mb-0 small">{error}</div>
        </div>
      )}

      {/* Draft Proposals preview — candidate only */}
      {isCandidate && draftProposals.length > 0 && (
        <div className="px-3 pt-2 d-flex flex-wrap gap-2">
          {draftProposals.map((p, i) => (
            <span
              key={i}
              className="badge bg-warning text-dark d-flex align-items-center gap-1"
              style={{ fontSize: "0.75rem", padding: "6px 10px" }}
            >
              {PROPOSAL_LABELS[p.type]}: {p.proposedValue}
              <X size={12} style={{ cursor: "pointer" }} onClick={() => removeProposal(i)} />
            </span>
          ))}
        </div>
      )}

      {/* Add Proposal form — candidate only */}
      {isCandidate && showProposalForm && (
        <div className="px-3 pt-2">
          <div className="card p-2">
            <div className="d-flex gap-2 align-items-end">
              <div>
                <label className="form-label small mb-1">Type</label>
                <select
                  className="form-select form-select-sm"
                  value={newProposal.type}
                  onChange={(e) =>
                    setNewProposal((prev) => ({ ...prev, type: e.target.value as ProposalType }))
                  }
                >
                  {PROPOSAL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex-grow-1">
                <label className="form-label small mb-1">Proposal</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder='e.g. "$85,000" or "Apr 15, 2025"'
                  value={newProposal.proposedValue}
                  onChange={(e) =>
                    setNewProposal((prev) => ({ ...prev, proposedValue: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addProposal()}
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-sm btn-success" onClick={addProposal}>
                <Check size={14} className="me-1" />Add
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowProposalForm(false)}>
                <X size={14} className="me-1" />Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="card-footer bg-white border-top p-3">
        <div className="d-flex gap-2 align-items-start">
          <div className="flex-grow-1">
            <textarea
              className="form-control form-control-sm"
              rows={2}
              placeholder={isEmployer ? "Reply to the candidate…" : "Type your message…"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ resize: "none", fontFamily: "inherit", fontSize: "0.875rem" }}
            />

            {/* Attach proposal — candidate only */}
            {isEmployer && (
              <button
                className="btn btn-link btn-sm text-muted px-0 mt-1"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setShowProposalForm(true)}
              >
                <Plus size={13} className="me-1" />
                Attach proposal
              </button>
            )}

            {/* Employer hint */}
            {isEmployer && (
              <small className="text-muted d-block mt-1" style={{ fontSize: "0.7rem" }}>
                Use Accept / Reject buttons on each proposal to respond.
              </small>
            )}
          </div>

          <button
            className="btn btn-info"
            onClick={handleSend}
            disabled={sending || (!message.trim() && draftProposals.length === 0)}
          >
            {sending ? <Loader size={16} className="spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}