import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, FolderOpen, MoreVertical, Edit, Eye, CircleCheck, ChartBarIncreasing,
  ClipboardList, CheckCheck, Trash, Pen, FolderX
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../components/modal";
import Hashids from "hashids";
import type { InductionCategory } from "../types/induction";
import {
  getInductionItems, getInductionSections, getInductionLevels,
  getInductionCategories, createInductionCategory, deleteInductionCategory, updateInductionCategory
} from "../utils/InductionRequests";

type ModalType = "add" | "edit" | "delete" | null;

interface Props {
  employerId: number;
}

const InductionDashboard = ({ employerId }: Props) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<InductionCategory[]>([]);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [loading, setLoading] = useState({ page: true, stats: true, action: false });
  const [selectedCategory, setSelectedCategory] = useState<InductionCategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSections: 0,
    totalItems: 0,
    totalLevels: 0,
  });

  const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

  const openDeleteModal = (id: number) => { setSelectedCategoryId(id); setModalType("delete"); };
  const openEditModal = (category: InductionCategory) => { setSelectedCategory(category); setModalType("edit"); };
  const openAddModal = () => setModalType("add");
  const closeModal = () => { setModalType(null); setSelectedCategory(null); };

  useEffect(() => {
    console.log("emp", employerId)
    Promise.all([getCategories(), getCardStats()]);
  }, []);

  const getCardStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const [itemsRes, sectionsRes, levelsRes] = await Promise.all([
        getInductionItems(employerId),
        getInductionSections(employerId),
        getInductionLevels(employerId),
      ]);
      setStats(prev => ({
        ...prev,
        totalSections: sectionsRes?.data?.length ?? 0,
        totalItems: itemsRes?.data?.length ?? 0,
        totalLevels: levelsRes?.data?.length ?? 0,
      }));
    } catch (error) {
      console.error("Failed to load stats", error);
      toast.error("Could not load dashboard stats");
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const getCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      const response = await getInductionCategories(employerId);
      console.log("cat res", response, employerId)
      const data = response.data || [];
      setCategories(data);
      setStats(prev => ({ ...prev, totalCategories: data.length }));
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Could not load categories");
      setCategories([]);
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/ClientMgt/Induction/Programmes/${hashIds.encode(Number(categoryId))}/${hashIds.encode(Number(employerId))}`);
  };

  const handleCreateCategory = async (data: { inputValue?: string; inputValue5?: string }) => {
    const { inputValue, inputValue5 } = data;
    if (!inputValue || !inputValue5) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(prev => ({ ...prev, action: true }));
      const formData = new FormData();
      formData.append("Name", inputValue);
      formData.append("Description", inputValue5);
      const response = await createInductionCategory(formData, employerId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Category created successfully");
        closeModal();
        await Promise.all([getCategories(), getCardStats()]);
      } else {
        toast.error("Could not add category");
      }
    } catch (error: any) {
      toast.error(error?.message || "Could not create category");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setLoading(prev => ({ ...prev, action: true }));
      const response = await deleteInductionCategory(Number(selectedCategoryId), employerId);
      if (response.status === 200 || response.status === 204) {
        toast.success("Category Deleted");
        closeModal();
        await Promise.all([getCategories(), getCardStats()]);
      } else {
        toast.error("Could not delete category");
      }
    } catch {
      toast.error("Could not delete category");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleEditCategory = async (data: { inputValue?: string; inputValue5?: string }) => {
    if (!selectedCategory) return;
    const { inputValue, inputValue5 } = data;
    if (!inputValue || !inputValue5) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(prev => ({ ...prev, action: true }));
      const formData = new FormData();
      formData.append("Name", inputValue);
      formData.append("Description", inputValue5);
      const response = await updateInductionCategory(Number(selectedCategory.inductionCategoryId), formData, employerId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Category updated");
        closeModal();
        await getCategories();
      } else {
        toast.error("Could not update category");
      }
    } catch {
      toast.error("Could not update category");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const renderSkeletonCards = () =>
    [1, 2, 3, 4].map(item => (
      <div key={item} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body mini-card-body d-flex align-center gap-16">
            <div className="avatar avatar-xl bg-light">
              <div className="placeholder-wave">
                <span className="placeholder col-12 bg-secondary" style={{ height: 40, width: 40, borderRadius: 12, display: "block" }} />
              </div>
            </div>
            <div className="card-content" style={{ width: "100%" }}>
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary mb-2" style={{ height: 16 }} />
                <span className="placeholder col-4 bg-secondary" style={{ height: 28, display: "block" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  const renderSkeletonGrid = () =>
    [1, 2, 3, 4, 5, 6].map(item => (
      <div key={item} className="col-md-6 col-xl-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center gap-3 w-75">
                <div className="placeholder-wave">
                  <span className="placeholder bg-secondary" style={{ width: 48, height: 48, borderRadius: 12, display: "block" }} />
                </div>
                <div className="w-100">
                  <div className="placeholder-wave">
                    <span className="placeholder col-10 bg-secondary mb-2" style={{ height: 20 }} />
                  </div>
                </div>
              </div>
              <div className="placeholder-wave">
                <span className="placeholder bg-secondary" style={{ width: 32, height: 32, borderRadius: 4, display: "block" }} />
              </div>
            </div>
            <div className="placeholder-wave mb-3">
              <span className="placeholder col-12 bg-secondary mb-2" style={{ height: 16 }} />
              <span className="placeholder col-8 bg-secondary" style={{ height: 16 }} />
            </div>
            <hr className="my-3" />
            <div className="d-flex justify-content-between align-items-center">
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: 14, width: 120 }} />
              </div>
              <div className="placeholder-wave">
                <span className="placeholder bg-secondary" style={{ height: 36, width: 100, borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  const renderEmptyState = () => (
    <div className="col-12">
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="mb-4">
            <FolderX size={64} className="" style={{ opacity: 0.5 }} />
          </div>
          <h5 className="text-dark mb-2">No Induction Programme Found</h5>
          <p className=" mb-4">Get started by creating your first induction category.</p>
          <button className="btn btn-success" onClick={openAddModal}>
            <Plus size={16} className="me-2" />
            Create Induction Programme
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <ToastContainer />

      <Modal
        isOpen={modalType === "delete"}
        title="Delete Induction Programme"
        message="Are you sure you want to delete this induction programme? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        buttonIcon={<Trash size={16} />}
        headerIcon={<Trash size={20} />}
        loading={loading.action}
        onConfirm={handleDeleteCategory}
        onCancel={closeModal}
      />

      <Modal
        isOpen={modalType === "add"}
        title="Add New Induction Programme"
        message="Create a new induction programme to organize your content."
        confirmText="Create Programme"
        cancelText="Cancel"
        confirmColor="success"
        inputLabel="Programme Name"
        inputPlaceholder="e.g., General Induction, Safety Training"
        inputLabel5="Programme Description"
        inputPlaceholder5="Describe the purpose of this programme..."
        buttonIcon={<CheckCheck size={16} />}
        headerIcon={<Plus size={20} />}
        loading={loading.action}
        onConfirm={handleCreateCategory}
        onCancel={closeModal}
      />

      <Modal
        isOpen={modalType === "edit"}
        title="Edit Induction Programme"
        message="Update the induction programme details."
        confirmText="Update Programme"
        cancelText="Cancel"
        confirmColor="warning"
        inputLabel="Programme Name"
        inputPlaceholder=""
        defaultInputValue={selectedCategory?.name ?? ""}
        inputLabel5="Programme Description"
        inputPlaceholder5=""
        defaultInputValue5={selectedCategory?.description ?? ""}
        buttonIcon={<Pen size={16} />}
        headerIcon={<Pen size={20} />}
        loading={loading.action}
        onConfirm={handleEditCategory}
        onCancel={closeModal}
      />

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="page-title fs-18 lh-1">Induction Management</h1>
          <p className=" mb-0">Manage induction programmes, levels, and content</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {loading.stats || loading.page ? renderSkeletonCards() : (
          <>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-primary-transparent text-primary">
                    <FolderOpen size={30} />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Total Programmes</span>
                    <h2 className="mb-5">{stats.totalCategories}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-warning-transparent text-warning">
                    <CircleCheck size={30} />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Total Module</span>
                    <h2 className="mb-5">{stats.totalSections}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-info-transparent text-info">
                    <ChartBarIncreasing size={30} />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Total Stages</span>
                    <h2 className="mb-5">{stats.totalLevels}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body mini-card-body d-flex align-center gap-16">
                  <div className="avatar avatar-xl bg-purple-transparent text-purple">
                    <ClipboardList size={30} />
                  </div>
                  <div className="card-content">
                    <span className="d-block fs-16 mb-5">Total Tasks</span>
                    <h2 className="mb-5">{stats.totalItems}</h2>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions Bar */}
      <section className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-7" />
          <div className="col-md-5 text-end">
            <button className="btn btn-success" onClick={openAddModal} disabled={loading.action}>
              <Plus size={16} className="me-1" />
              New Programme
            </button>
          </div>
        </div>
      </section>

      {/* Content Area — grid only */}
      <div className="row g-4">
        {loading.page ? (
          renderSkeletonGrid()
        ) : categories.length === 0 ? (
          renderEmptyState()
        ) : (
          categories.map(category => (
            <div key={category.inductionCategoryId} className="col-md-6 col-xl-4">
              <div className="card h-100 category-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {/* <div className="category-icon" style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                        flexShrink: 0,
                      }}>
                        <FolderOpen size={24} />
                      </div> */}
                      <div>
                        <h5 className="mb-1">{category.name}</h5>
                      </div>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-link bg-light p-2" data-bs-toggle="dropdown">
                        <MoreVertical size={18} />
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item" onClick={() => handleCategoryClick(category.inductionCategoryId)}>
                            <Eye size={14} className="me-2" /> View Details
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); openEditModal(category); }}>
                            <Edit size={14} className="me-2" /> Edit
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item text-danger" onClick={() => openDeleteModal(Number(category.inductionCategoryId))}>
                            <Trash size={14} className="me-2" /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="fs-14 mb-3" style={{ minHeight: 40 }}>
                    {category.description || "No description provided"}
                  </p>

                  <hr className="my-3" />

                  <div className="mb-0">
                    <small className="">
                      Created on {new Date(category.dateCreated).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </small>
                    <button
                      className="btn btn-outline-info w-100 btn-sm mt-15"
                      onClick={() => handleCategoryClick(category.inductionCategoryId)}
                    >
                      <Eye size={14} className="me-1" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .category-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e5e7eb;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }
        .placeholder-wave { width: 100%; }
      `}</style>
    </div>
  );
};

export default InductionDashboard;