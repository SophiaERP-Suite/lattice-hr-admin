import { ArrowDown, ArrowUp, ListChecks, Plus } from "lucide-react";
import ItemEditor from "./ItemEditor";
import type { InductionItem } from "../types/induction";

interface Props {
  items: InductionItem[];
  loading: { page: boolean; save: boolean };
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<InductionItem>) => void;
  onRemove: (item: InductionItem) => void;
  onClone: (item: InductionItem) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

const ItemList = ({ items, loading, onAdd, onUpdate, onRemove, onClone, onMove }: Props) => {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  if (loading.page) return <SkeletonItems />;

  if (sorted.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <ListChecks size={40} className="mb-3 opacity-25" />
        <p className="mb-2">No items in this section yet</p>
        <button className="btn btn-success btn-sm" onClick={onAdd} disabled={loading.save}>
          <Plus size={13} /> Add First Item
        </button>
      </div>
    );
  }

  return (
    <>
      {sorted.map((item, index) => (
        <div key={item.inductionItemId} className="position-relative">
          <ItemEditor
            item={item}
            index={index}
            onUpdate={patch => onUpdate(item.inductionItemId, patch)}
            onRemove={() => onRemove(item)}
            onClone={() => onClone(item)}
            isLoading={loading.save}
          />

          {/* Up / down controls */}
          <div className="position-absolute" style={{ top: "50%", right: -30, transform: "translateY(-50%)" }}>
            <div className="d-flex flex-column gap-1">
              <button
                className="btn btn-sm btn-light p-1"
                onClick={() => onMove(item.inductionItemId, "up")}
                disabled={index === 0 || loading.save}
                title="Move up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                className="btn btn-sm btn-light p-1"
                onClick={() => onMove(item.inductionItemId, "down")}
                disabled={index === sorted.length - 1 || loading.save}
                title="Move down"
              >
                <ArrowDown size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        className="btn btn-outline-success btn-sm w-100 mt-3"
        onClick={onAdd}
        disabled={loading.save}
      >
        <Plus size={16} className="me-1" /> Add Another Item
      </button>
    </>
  );
};

const SkeletonItems = () => (
  <>
    {[1, 2, 3].map(n => (
      <div key={n} className="border rounded mb-2 p-3">
        <div className="d-flex align-items-center gap-3">
          <div className="placeholder-wave">
            <span className="placeholder bg-secondary" style={{ width: 26, height: 26, borderRadius: 6, display: "block" }} />
          </div>
          <div className="placeholder-wave flex-grow-1">
            <span className="placeholder col-8 bg-secondary" style={{ height: 20 }} />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default ItemList;