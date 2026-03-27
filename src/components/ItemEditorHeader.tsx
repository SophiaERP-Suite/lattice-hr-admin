import { ChevronDown, Copy, GripVertical, Trash2 } from "lucide-react";
import { itemMeta } from "../constants/ItemTypes";
import type { InductionItem } from "../types/induction";

interface Props {
  item: InductionItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onClone: () => void;
  onRemove: () => void;
}

const ItemEditorHeader = ({ item, index, onToggle, onClone, onRemove }: Props) => {
  const meta = itemMeta(item.itemType);
  const Icon = meta.icon;

  return (
    <div
      className="d-flex align-items-center gap-2 p-2 px-3"
      style={{ cursor: "pointer" }}
      onClick={onToggle}
    >
      {/* Drag handle */}
      <div className="drag-handle" style={{ cursor: "grab" }} onClick={e => e.stopPropagation()}>
        <GripVertical size={14} className="text-muted flex-shrink-0" />
      </div>

      {/* Type icon */}
      <div style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={13} style={{ color: meta.color }} />
      </div>

      {/* Name */}
      <span className={`flex-grow-1 fs-13 ${!item.itemName ? "text-muted fst-italic" : "fw-semibold"}`}>
        {item.itemName || `Item ${index + 1} — untitled`}
      </span>

      {/* Pills */}
      <div className="d-flex gap-1 align-items-center">
        <span className="badge" style={{ background: meta.bg, color: meta.color, fontSize: 10 }}>
          {item.itemType}
        </span>
        {item.isMandatory && (
          <span className="badge bg-danger" style={{ fontSize: 10 }}>Required</span>
        )}
      </div>

      {/* Dropdown menu */}
      <div className="dropdown">
        <button
          className="btn btn-link text-muted p-0 ms-1"
          data-bs-toggle="dropdown"
          onClick={e => e.stopPropagation()}
        >
          <ChevronDown size={14} />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item" onClick={e => { e.stopPropagation(); onClone(); }}>
              <Copy size={14} className="me-2" /> Clone
            </button>
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={e => { e.stopPropagation(); onRemove(); }}>
              <Trash2 size={14} className="me-2" /> Remove
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ItemEditorHeader;