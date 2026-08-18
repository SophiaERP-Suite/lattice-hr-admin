import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ListChecks, Plus, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import type { InductionItem, Section } from "../../types/induction";
import { createInductionItem, getInductionItemsBySection, getInductionSectionsBySectionId, updateInductionItem } from "../../utils/InductionRequests";
import Modal from "../../components/modal";
import { newItem, itemMeta } from "../../constants/ItemTypes";
import ItemList from "../../components/ItemList";
import SectionSidebar from "../../components/SectionSidebar";
import PreviewModal from "../../components/PreviewModal";

type ModalType = "delete" | null;

const InductionSectionItems = () => {
  const navigate = useNavigate();
  const { categoryId, levelId, sectionId, clientId } = useParams();

  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<InductionItem[]>([]);
  const [loading, setLoading] = useState({ page: false, save: false, action: false });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<InductionItem | null>(null);

  const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

  const decodedCategoryId = useMemo(() => {
    const decoded = hashIds.decode(String(categoryId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [categoryId]);

  const decodedLevelId = useMemo(() => {
    const decoded = hashIds.decode(String(levelId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [levelId]);

  const decodedEmployerId = useMemo(() => {
    const decoded = hashIds.decode(String(clientId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [clientId]);

  const decodedSectionId = useMemo(() => {
    const decoded = hashIds.decode(String(sectionId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [sectionId]);

  useEffect(() => {
    if (decodedSectionId) {
      fetchSectionData();
      fetchItems();
    }
  }, [decodedSectionId]);

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setLoading(prev => ({ ...prev, save: true }));

      for (const item of items) {
        const isNew = String(item.inductionItemId).startsWith("temp_");

        if (isNew) {
          await createInductionItem(item, Number(decodedSectionId), Number(decodedEmployerId));
        } else {
          await updateInductionItem(item, Number(item.inductionItemId), Number(decodedEmployerId));
        }
      }

      toast.success("Items saved successfully!");
      await fetchItems();
    } catch (err) {
      toast.error("Failed to save items");
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const fetchSectionData = async () => {
    try {
      const response = await getInductionSectionsBySectionId(Number(decodedSectionId), Number(decodedEmployerId));

      if (response.statusCode === 200 || response.statusCode === 201) {
        console.log("gggg res", response)
        setSection(response.data);
      }

    } catch {
      toast.error("Could not load section details");
    }
  };

  const onPreview = () => {
    navigate(
      `/ClientMgt/Induction/Programmes/${categoryId}/Stages/${levelId}/Modules/${sectionId}/Items-Preview/${clientId}`
    )
  }

  const fetchItems = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      const response = await getInductionItemsBySection(Number(decodedSectionId), Number(decodedEmployerId));
      console.log("get datat", response)

      if (response.statusCode === 200 || response.statusCode === 201) {
        const itemsData: InductionItem[] = response.data ?? [];
        setItems(itemsData.length === 0 ? [newItem(1, sectionId!)] : itemsData);
      }
    } catch {
      toast.error("Could not load induction items");
      setItems([newItem(1, sectionId!)]);
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  // ── Save ─────────────────────────────────────────────────────
  const saveItems = async () => {
    if (!validate()) return;
    try {
      setLoading(prev => ({ ...prev, save: true }));
      // await saveInductionItems(sectionId!, items);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Items saved successfully!");
      setShowPreview(false);
      await fetchItems();
    } catch {
      toast.error("Failed to save items");
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  // ── Item mutations ───────────────────────────────────────────
  const addItem = () => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sortOrder)) : 0;
    setItems([...items, newItem(maxOrder + 1, sectionId!)]);
    setErrors({});
  };

  const updateItem = (id: string, patch: Partial<InductionItem>) => {
    setItems(items.map(i => i.inductionItemId === id ? { ...i, ...patch } : i));
    setErrors(prev => {
      const next = { ...prev };
      delete next[`item_${id}`];
      delete next[`item_link_${id}`];
      delete next[`item_content_${id}`];
      return next;
    });
  };

  const removeItem = (id: string) => {
    if (items.length === 1) { toast.warning("Section must have at least one item"); return; }
    setItems(items.filter(i => i.inductionItemId !== id).map((i, idx) => ({ ...i, sortOrder: idx + 1 })));
  };

  const cloneItem = (item: InductionItem) => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sortOrder)) : 0;
    setItems([...items, {
      ...item,
      inductionItemId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemName: `${item.itemName} (Copy)`,
      sortOrder: maxOrder + 1,
    }]);
    toast.success("Item cloned successfully");
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const index = items.findIndex(i => i.inductionItemId === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) return;

    const newItems = [...items];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newItems[index].sortOrder, newItems[swapIndex].sortOrder] = [newItems[swapIndex].sortOrder, newItems[index].sortOrder];
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems);
  };

  // ── Validation ───────────────────────────────────────────────
  const validate = (): boolean => {

    const errs: Record<string, string> = {};

    items.forEach(i => {

      if (!(i.itemName ?? "").trim()) {
        errs[`item_${i.inductionItemId}`] = "All items must have names";
      }

      const meta = itemMeta(i.itemType);

      if (meta.hasLink && !i.uploadedFile && !(i.documentLink ?? "").trim())

        if (meta.hasContent && !(i.itemContent ?? "").trim()) {
          errs[`item_content_${i.inductionItemId}`] =
            `${i.itemType} items require content`;
        }

    });

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix validation errors before saving");
    }

    return Object.keys(errs).length === 0;
  };

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">

        <ToastContainer />

        {/* Delete modal */}
        <Modal
          isOpen={modalType === "delete"}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="danger"
          buttonIcon={<Trash2 size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={loading.action}
          onConfirm={() => {
            if (selectedItem) { removeItem(selectedItem.inductionItemId); }
            setModalType(null);
            setSelectedItem(null);
          }}
          onCancel={() => { setModalType(null); setSelectedItem(null); }}
        />

        {/* Page header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div className="d-flex align-items-center gap-3">
                <div>
                  <h1 className="page-title fs-18 lh-1">
                    {loading.page ? (
                      <div className="placeholder-wave">
                        <span className="placeholder col-6 bg-secondary" style={{ height: 28, width: 250 }} />
                      </div>
                    ) : (
                      `Module: ${section?.sectionName || "Items"}`
                    )}
                  </h1>

                </div>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">Items</li>
                  <li className="breadcrumb-item"><NavLink to={`/induction/programmes/${categoryId}/stages/${levelId}`}>Sections</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to={`/induction/programmes/${categoryId}`}>Levels</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/induction">Induction</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="col-12">
            <div className="page-title-box gap-15">
              <h1 className="page-title fs-16 lh-1">
                Instructions
              </h1>
              <p className="mb-0">
                {loading.page ? (
                  <div className="placeholder-wave">
                    <span className="placeholder col-8 bg-secondary" style={{ height: 16, width: 300 }} />
                  </div>
                ) : (
                  section?.instructions || "Manage items in this module"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="row">

          {/* Left — item list */}
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <ListChecks size={17} /> Module Items
                  {!loading.page && <span className="badge bg-primary ms-1">{items.length}</span>}
                </h5>
                <button className="btn btn-sm btn-success" onClick={addItem} disabled={loading.page || loading.save}>
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="card-body mt-15">
                <ItemList
                  items={items}
                  loading={loading}
                  onAdd={addItem}
                  onUpdate={updateItem}
                  onRemove={item => { setSelectedItem(item); setModalType("delete"); }}
                  onClone={cloneItem}
                  onMove={moveItem}
                />
              </div>
            </div>
          </div>

          {/* Right — sidebar */}
          <div className="col-xl-4">
            <SectionSidebar
              items={items}
              loading={loading}
              errors={errors}
              onPreview={() => onPreview()}
              onSave={() => handleSave()}
            />
          </div>

        </div>
      </div>
      {/* Preview modal */}
      {
        showPreview && (
          <PreviewModal
            sectionName={section?.sectionName || "Section"}
            items={items}
            onClose={() => setShowPreview(false)}
            onSave={saveItems}
            loading={loading.save}
          />
        )
      }

      <style>{`
        .item-editor { transition: all 0.2s; }
        .item-editor:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .drag-handle { cursor: grab; }
        .drag-handle:active { cursor: grabbing; }
      `}</style>
    </div>
  );
};

export default InductionSectionItems;