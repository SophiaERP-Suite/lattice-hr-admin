import { CheckCircle, ListChecks, Monitor } from "lucide-react";
import { itemMeta } from "../constants/ItemTypes";
import type { InductionItem } from "../types/induction";

interface Props {
  sectionName: string;
  items: InductionItem[];
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
}

const PreviewModal = ({ sectionName, items, onClose, onSave, loading }: Props) => {
  const mandatoryItems = items.filter(i => i.isMandatory).length;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <Monitor size={18} className="me-2" />
              Preview: {sectionName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <div className="mb-3 d-flex gap-3">
              <span className="badge bg-primary">Total Items: {items.length}</span>
              <span className="badge bg-danger">Mandatory: {mandatoryItems}</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <ListChecks size={40} className="mb-3 opacity-25" />
                <p>No items to preview</p>
              </div>
            ) : (
              items.map((item, idx) => <PreviewItem key={item.inductionItemId} item={item} index={idx} />)
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Continue Editing
            </button>
            <button type="button" className="btn btn-success" onClick={onSave} disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" /> Saving...</>
              ) : (
                <><CheckCircle size={16} className="me-1" /> Save Section</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const PreviewItem = ({ item, index }: { item: InductionItem; index: number }) => {
  const meta = itemMeta(item.itemType);
  const Icon = meta.icon;

  return (
    <div className="card mb-3">
      <div className="card-body">

        {/* Title row */}
        <div className="d-flex align-items-center gap-3 mb-2">
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon size={16} style={{ color: meta.color }} />
          </div>
          <h6 className="mb-0 flex-grow-1">
            {item.itemName || `Item ${index + 1}`}
            {item.isMandatory && <span className="badge bg-danger ms-2">Required</span>}
          </h6>
          <small className="text-muted">{item.itemType}</small>
        </div>

        {/* Content */}
        {item.itemContent && (
          <div className="mt-2 p-2 rounded small bg-light">
            {item.itemType === "Checklist" ? (
              item.itemContent.split("\n").map((line, i) =>
                line.trim() && (
                  <div key={i} className="form-check">
                    <input type="checkbox" className="form-check-input" disabled />
                    <label className="form-check-label">{line}</label>
                  </div>
                )
              )
            ) : (
              <p className="mb-0 text-muted" style={{ whiteSpace: "pre-wrap" }}>{item.itemContent}</p>
            )}
          </div>
        )}

        {/* Link */}
        {item.documentLink && (
          <div className="mt-2 small">
            <strong>Link:</strong>
            <a href={item.documentLink} target="_blank" rel="noopener noreferrer" className="ms-2">
              {item.documentLink}
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default PreviewModal;