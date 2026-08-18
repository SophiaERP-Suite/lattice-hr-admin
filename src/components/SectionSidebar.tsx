import { AlertCircle, CheckCheck, Monitor } from "lucide-react";
import type { InductionItem } from "../types/induction";

interface Props {
  items: InductionItem[];
  loading: { page: boolean; save: boolean };
  errors: Record<string, string>;
  onPreview: () => void;
  onSave: () => void;
}

const SectionSidebar = ({ items, loading, errors, onPreview, onSave }: Props) => {
  const totalItems = items.length;
  const mandatoryItems = items.filter(i => i.isMandatory).length;
  const mandatoryPct = totalItems > 0 ? Math.round((mandatoryItems / totalItems) * 100) : 0;

  return (
    <div style={{ position: "sticky", top: 20 }}>

      {/* Actions */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">Actions</h6>
        </div>
        <div className="card-body mt-15">
          <button
            className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
            onClick={onPreview}
            disabled={totalItems === 0 || loading.page || loading.save}
          >
            <Monitor size={15} /> Preview Module
          </button>

          <button
            className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={onSave}
            disabled={loading.save || loading.page}
          >
            {loading.save ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Saving...</>
            ) : (
              <><CheckCheck size={15} /> Save Items</>
            )}
          </button>
        </div>
      </div>

      {/* Summary */}
      {!loading.page && (
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">Summary</h6>
          </div>
          <div className="card-body mt-15">
            <div className="d-flex justify-content-between mb-2">
              <small className="text-muted">Total Items</small>
              <span className="fw-bold">{totalItems}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <small className="text-muted">Mandatory Items</small>
              <span className="fw-bold text-danger">{mandatoryItems}</span>
            </div>
            <div className="d-flex justify-content-between">
              <small className="text-muted">Optional Items</small>
              <span className="fw-bold">{totalItems - mandatoryItems}</span>
            </div>

            {totalItems > 0 && (
              <>
                <hr />
                <div className="progress" style={{ height: 5 }}>
                  <div className="progress-bar bg-danger" style={{ width: `${mandatoryPct}%` }} />
                </div>
                <small className="text-muted mt-1 d-block">{mandatoryPct}% mandatory</small>
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="card border-danger">
          <div className="card-header bg-danger text-white py-2">
            <h6 className="mb-0 d-flex align-items-center gap-2">
              <AlertCircle size={16} /> Validation Errors
            </h6>
          </div>
          <div className="card-body mt-15">
            <ul className="mb-0 ps-3 text-danger small">
              {Object.values(errors).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default SectionSidebar;