import { useState } from "react";
import { itemMeta } from "../constants/ItemTypes";
import ItemEditorHeader from "./ItemEditorHeader";
import ItemEditorFields from "./ItemEditorFields";
import type { InductionItem } from "../types/induction";

interface Props {
  item: InductionItem;
  index: number;
  onUpdate: (patch: Partial<InductionItem>) => void;
  onRemove: () => void;
  onClone: () => void;
  isLoading?: boolean;
}

const ItemEditor = ({ item, index, onUpdate, onRemove, onClone, isLoading }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const meta = itemMeta(item.itemType);

  return (
    <div
      className="border rounded mb-2 item-editor"
      style={{
        background: "white",
        borderColor: expanded ? meta.color + "40" : "#e5e7eb",
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? "none" : "auto",
      }}
    >
      <ItemEditorHeader
        item={item}
        index={index}
        expanded={expanded}
        onToggle={() => setExpanded(e => !e)}
        onClone={onClone}
        onRemove={onRemove}
      />

      {expanded && (
        <ItemEditorFields item={item} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default ItemEditor;