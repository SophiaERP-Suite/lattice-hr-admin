import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  Plus, Layers, CircleCheck, ClipboardList, Eye,
  MoreVertical, Edit, Trash, AlertCircle, FolderOpen,
  CheckCheck, Pen,
  ChevronRight
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import type { Category, InductionLevel } from "../../types/induction";
import Modal from "../../components/modal";
import { getInductionCategory, getInductionCategoryByCategoryId, createInductionLevel, updateInductionLevel, deleteInductionLevel } from "../../utils/InductionRequests";

type ModalType = "add" | "edit" | "delete" | null;

const InductionCategoryLevels = () => {
  const navigate = useNavigate();
  const { categoryId, clientId } = useParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [levels, setLevels] = useState<InductionLevel[]>([]);
  // const [filteredLevels, setFilteredLevels] = useState<InductionLevel[]>([]);

  const [loading, setLoading] = useState({
    page: true,
    stats: true,
    action: false
  });

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedLevel, setSelectedLevel] = useState<InductionLevel | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

  const decodedCategoryId = useMemo(() => {
    const decoded = hashIds.decode(String(categoryId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [categoryId]);

  const decodedEmployerId = useMemo(() => {
    const decoded = hashIds.decode(String(clientId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [clientId]);

  useEffect(() => {
    if (decodedCategoryId && decodedEmployerId) {
      fetchCategoryData();
      fetchLevels();
    }
  }, [decodedCategoryId, decodedEmployerId]);

  useEffect(() => {
    applyFilters();
  }, [levels]);

  // useEffect(() => {
  //   applyFilters();
  // }, [levels, searchTerm, statusFilter]);

  const fetchCategoryData = async () => {
    try {
      const response = await getInductionCategory(decodedCategoryId!, Number(decodedEmployerId));
      if (response?.data) {
        setCategory(response.data);
      }
    } catch (error) {
      console.error("Failed to load category", error);
      toast.error("Could not load category details");
    } finally {
      setLoading(prev => ({ ...prev, page: false, stats: false }));
    }
  };

  const fetchLevels = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true, stats: true }));

      const response = await getInductionCategoryByCategoryId(Number(decodedCategoryId), Number(decodedEmployerId));
      if (response.statusCode === 200 || response.ststusCode === 201) {
        const levelsData = response?.data || [];

        setLevels(levelsData)
      }
    } catch (error) {
      console.error("Failed to load levels", error);
      toast.error("Could not load induction levels");
      setLevels([]);
    } finally {
      setLoading(prev => ({ ...prev, page: false, stats: false }));
    }
  };

  const applyFilters = () => {
    let filtered = [...levels];

    // if (searchTerm) {
    //   filtered = filtered.filter(level =>
    //     level.name.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    // }

    // if (statusFilter !== "All") {
    //   filtered = filtered.filter(level => level.status === statusFilter);
    // }

    filtered.sort((a, b) => a.inductionLevelNo - b.inductionLevelNo);

    // setFilteredLevels(filtered);
  };

  const handleCreateLevel = async (data: {
    inputValue?: string;
    inputValue2?: string;
    dropdownValue?: string;
    file?: File;
  }) => {
    try {
      const { inputValue: name, file, inputValue2, dropdownValue } = data;

      if (!name) {
        toast.error("Please enter a level name");
        return;
      }

      if (!file) {
        console.error("Missing required fields");
        return;
      }

      setLoading(prev => ({ ...prev, action: true }));

      const formData = new FormData();
      formData.append("Name", name);
      formData.append("InductionLevelNo", String(inputValue2 || 1));
      formData.append("Status", dropdownValue || "");
      formData.append("CategoryId", decodedCategoryId?.toString() || "0");
      formData.append("File", file);

      const response = await createInductionLevel(formData, Number(decodedCategoryId), Number(decodedEmployerId));
      console.log("log res", response)
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Level created successfully");
        closeModal();
        await fetchLevels();
      } else {
        toast.error("Could not create level");
      }
    } catch (error) {
      console.error("Create level error:", error);
      toast.error("Failed to create level");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleUpdateLevel = async (data: {
    inputValue?: string;
    inputValue2?: string;
    dropdownValue?: string;
    file?: File;
  }) => {
    if (!selectedLevel) return;

    try {
      const { inputValue: name, inputValue2, dropdownValue, file } = data;

      if (!name) {
        toast.error("Please enter a level name");
        return;
      }

      setLoading(prev => ({ ...prev, action: true }));

      const formData = new FormData();
      formData.append("Name", name);
      formData.append("InductionLevelNo", String(inputValue2 ?? selectedLevel.inductionLevelNo));
      formData.append("Status", dropdownValue ?? selectedLevel.status);

      if (file instanceof File) {
        formData.append("File", file);
      }

      const response = await updateInductionLevel(formData, selectedLevel.inductionLevelId, Number(decodedEmployerId));

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Level updated successfully");
        closeModal();
        await fetchLevels();
      } else {
        toast.error("Could not update level");
      }
    } catch (error) {
      console.error("Update level error:", error);
      toast.error("Failed to update level");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteLevel = async () => {
    if (!selectedLevelId) return;

    try {
      setLoading(prev => ({ ...prev, action: true }));

      const response = await deleteInductionLevel(selectedLevelId, Number(decodedEmployerId));

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Level deleted successfully");
        closeModal();
        await fetchLevels();
      } else {
        toast.error("Could not delete level");
      }
    } catch (error) {
      console.error("Delete level error:", error);
      toast.error("Failed to delete level");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleLevelClick = (levelId: number) => {
    navigate(`/ClientMgt/Induction/Programmes/${categoryId}/stages/${hashIds.encode(levelId.toString())}/${clientId}`);
  };

  const openAddModal = () => {
    setModalType("add");
  };

  const openEditModal = (level: InductionLevel) => {
    setSelectedLevel(level);
    setModalType("edit");
  };

  const openDeleteModal = (levelId: number) => {
    setSelectedLevelId(levelId);
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedLevel(null);
    setSelectedLevelId(null);
  };

  const stats = {
    total: levels.length,
    published: levels.filter(l => l.status === "Published").length,
    draft: levels.filter(l => l.status === "Draft").length,
    totalSections: 0,
    totalItems: 0
  };

  const renderSkeletonCards = () => {
    return [1, 2, 3, 4].map((item) => (
      <div key={item} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body mini-card-body d-flex align-center gap-16">
            <div className="avatar avatar-xl bg-light">
              <div className="placeholder-wave">
                <span className="placeholder col-12 bg-secondary" style={{ height: '40px', width: '40px', borderRadius: '12px', display: 'block' }}></span>
              </div>
            </div>
            <div className="card-content" style={{ width: '100%' }}>
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary mb-2" style={{ height: '16px' }}></span>
                <span className="placeholder col-4 bg-secondary" style={{ height: '28px', display: 'block' }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const renderSkeletonLevels = () => {
    return [1, 2, 3, 4, 5, 6].map((item) => (
      <div key={item} className="col-md-6 col-xl-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center gap-3 w-75">
                <div className="placeholder-wave">
                  <span className="placeholder bg-secondary" style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'block' }}></span>
                </div>
                <div className="w-100">
                  <div className="placeholder-wave">
                    <span className="placeholder col-10 bg-secondary mb-2" style={{ height: '20px' }}></span>
                  </div>
                </div>
              </div>
              <div className="placeholder-wave">
                <span className="placeholder bg-secondary" style={{ width: '60px', height: '24px', borderRadius: '4px', display: 'block' }}></span>
              </div>
            </div>

            <div className="d-flex justify-content-around text-center mt-4">
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: '20px', width: '60px' }}></span>
              </div>
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: '20px', width: '60px' }}></span>
              </div>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-center">
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: '14px', width: '120px' }}></span>
              </div>
              <div className="placeholder-wave">
                <span className="placeholder bg-secondary" style={{ height: '36px', width: '120px', borderRadius: '4px' }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const renderEmptyState = () => (
    <div className="col-12">
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="mb-4">
            <Layers size={64} className="text-muted" style={{ opacity: 0.5 }} />
          </div>
          <h5 className="text-dark mb-2">No Induction Stages Found</h5>
          <p className="text-muted mb-4">
            Get started by creating your first induction stage for {category?.name}.
          </p>
          <button
            className="btn btn-success"
            onClick={openAddModal}
          >
            <Plus size={16} className="me-2" />
            Create New Stages
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-content-wrap">
      <div className="container-fluid">

        <ToastContainer />

        {/* Modals */}
        <Modal
          isOpen={modalType === "add"}
          title="Create New Induction Stage"
          message={`Create a new induction stage for ${category?.name || 'this'} programme.`}
          confirmText="Create Stage"
          cancelText="Cancel"
          confirmColor="success"
          inputLabel="Level Name"
          inputPlaceholder="e.g., Company Overview, Safety Basics"
          inputLabel2="Level Number"
          defaultInputValue2="1"
          dropdownLabel="Status"
          dropdownOptions={[
            { value: "Draft", label: "Draft" },
            { value: "Published", label: "Published" }
          ]}
          fileLabel="Select File"
          fileAccept="image/*,.jpg,.png,.jpeg"
          defaultDropdownValue={selectedLevel?.status ?? "Draft"}
          buttonIcon={<CheckCheck size={16} />}
          headerIcon={<Plus size={20} />}
          loading={loading.action}
          onConfirm={handleCreateLevel}
          onCancel={closeModal}
        />

        <Modal
          isOpen={modalType === "edit"}
          title="Edit Induction Stage"
          message="Update the induction stage details."
          confirmText="Update Stage"
          cancelText="Cancel"
          confirmColor="warning"
          inputLabel="Statge Name"
          inputPlaceholder=""
          defaultInputValue={selectedLevel?.name ?? ""}
          inputLabel2="Stage Number"
          defaultInputValue2={String(selectedLevel?.inductionLevelNo ?? 1)}
          dropdownLabel="Status"
          dropdownOptions={[
            { value: "Draft", label: "Draft" },
            { value: "Published", label: "Published" }
          ]}
          defaultDropdownValue={selectedLevel?.status ?? "Draft"}
          fileLabel="Select File"
          fileAccept="image/*,.jpg,.png,.jpeg"
          buttonIcon={<Pen size={16} />}
          headerIcon={<Edit size={20} />}
          loading={loading.action}
          onConfirm={handleUpdateLevel}
          onCancel={closeModal}
        />

        <Modal
          isOpen={modalType === "delete"}
          title="Delete Induction Level"
          message="Are you sure you want to delete this induction stage? All modules and items within this stage will also be deleted. This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="danger"
          buttonIcon={<Trash size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={loading.action}
          onConfirm={handleDeleteLevel}
          onCancel={closeModal}
        />

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-xl-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div>
                <h1 className="page-title fs-18 lh-1">
                  Programme:  {loading.page ? (
                    <div className="placeholder-wave">
                      <span className="placeholder col-6 bg-secondary" style={{ height: '28px', width: '200px' }}></span>
                    </div>
                  ) : (
                    category?.name || 'Induction Stages'
                  )}
                </h1>
                <p className="text-muted mb-0">
                  {loading.page ? (
                    <div className="placeholder-wave">
                      <span className="placeholder col-8 bg-secondary" style={{ height: '16px', width: '300px' }}></span>
                    </div>
                  ) : (
                    category?.description || 'Manage induction stages for this category'
                  )}
                </p>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="active breadcrumb-item" aria-current="page">
                    <NavLink to={`/ClientMgt/Induction/Programmes/${categoryId}/${clientId}`}>Induction Details</NavLink>
                  </li>
                  <li className="mb-2"><ChevronRight size={15} /></li>
                  <li className="active breadcrumb-item" aria-current="page">
                    <NavLink to={`/ClientMgt/${hashIds.encode(String(decodedEmployerId))}`}>Client Details</NavLink>
                  </li>
                  <li className="mb-2"><ChevronRight size={15} /></li>
                  <li className="breadcrumb-item">
                    <NavLink to="/Dashboard">Dashboard</NavLink>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4 d-none">
          {loading.stats || loading.page ? (
            renderSkeletonCards()
          ) : (
            <>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-primary-transparent text-primary">
                      <Layers size={30} />
                    </div>
                    <div className="card-content">
                      <span className="d-block fs-16 mb-5">Total Stages</span>
                      <h2 className="mb-5">{stats.total}</h2>
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
                      <span className="d-block fs-16 mb-5">Published</span>
                      <h2 className="mb-5">{stats.published}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-info-transparent text-info">
                      <FolderOpen size={30} />
                    </div>
                    <div className="card-content">
                      <span className="d-block fs-16 mb-5">Sections</span>
                      <h2 className="mb-5">{stats.totalSections}</h2>
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
                      <span className="d-block fs-16 mb-5">Total Items</span>
                      <h2 className="mb-5">{stats.totalItems || 0}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters and Actions Bar */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <h3 className="fs-18">All Stages</h3>
                {/* <input
                    type="text"
                    className="form-control"
                    placeholder="Search levels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading.page}
                  /> */}
              </div>
              <div className="col-md-3">
                {/* <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    disabled={loading.page}
                  >
                    <option value="All">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select> */}
              </div>
              <div className="col-md-5 text-end">
                <button
                  className="btn btn-success"
                  onClick={openAddModal}
                  disabled={loading.action || loading.page}
                >
                  <Plus size={16} className="me-1" />
                  New Stages
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        {loading.page ? (
          <div className="row">
            {renderSkeletonLevels()}
          </div>
        ) : levels.length === 0 ? (
          <div className="row">
            {renderEmptyState()}
          </div>
        ) : (
          <div className="row">
            {levels.map(level => (
              <div key={level.inductionLevelId} className="col-md-6 col-xl-4 mb-4">
                <div className="card h-100 level-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="level-icon" style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${level.status === 'Published' ? '#22c55e' :
                            level.status === 'Draft' ? '#f59e0b' : '#94a3b8'
                            }20, transparent)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Layers size={24} color={
                            level.status === 'Published' ? '#22c55e' :
                              level.status === 'Draft' ? '#f59e0b' : '#94a3b8'
                          } />
                        </div>
                        <div>
                          <h5 className="mb-1">{level.name}</h5>
                          <span className={`badge ${level.status === 'Published' ? 'bg-success' :
                            level.status === 'Draft' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                            {level.status}
                          </span>
                        </div>
                      </div>
                      <div className="dropdown">
                        <button
                          className="btn btn-link text-muted p-2"
                          data-bs-toggle="dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={18} />
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(level);
                              }}
                            >
                              <Edit size={14} className="me-2" />Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(level.inductionLevelId);
                              }}
                            >
                              <Trash size={14} className="me-2" />Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* {level.description && (
                        <p className="text-muted small mb-3">{level.description}</p>
                      )} */}

                    <div className="d-flex justify-content-around text-center mt-4">
                      {/* <div>
                          <h6 className="mb-1">{level.sectionCount || 0}</h6>
                          <small className="text-muted">Modules</small>
                        </div>
                        <div>
                          <h6 className="mb-1">{level.itemCount || 0}</h6>
                          <small className="text-muted">Items</small>
                        </div> */}
                      <div>
                        <span className="badge bg-info">Stage No {level.inductionLevelNo}</span>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Created {new Date(level.dateCreated).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleLevelClick(level.inductionLevelId)}
                      >
                        <Eye size={14} className="me-1" /> View Modules
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .level-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e5e7eb;
        }
        .level-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }
        .placeholder-wave {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default InductionCategoryLevels;