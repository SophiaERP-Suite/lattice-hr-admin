import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  CircleCheck,
  ClipboardList,
  Gavel,
  PinIcon,
  Eye,
  MoreVertical,
  Edit,
  Trash,
  AlertCircle,
  CheckCheck,
  Pen
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Hashids from "hashids";
import type { Level, Section } from "../../types/induction";
import { getInductionLevelById, getInductionSectionsByLevelId, createInductionSection, updateInductionSection, deleteInductionSection } from "../../utils/InductionRequests";
import Modal from "../../components/modal";

type ModalType = "add" | "edit" | "delete" | null;

const InductionLevelSections = () => {
  const navigate = useNavigate();
  const { categoryId, levelId, clientId } = useParams();

  const [level, setLevel] = useState<Level | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);

  const [loading, setLoading] = useState({
    page: true,
    stats: true,
    action: false
  });

  const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

  const decodedLevelId = useMemo(() => {
    const decoded = hashIds.decode(String(levelId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [levelId]);

  const decodedEmployerId = useMemo(() => {
    const decoded = hashIds.decode(String(clientId));
    return decoded.length > 0 ? Number(decoded[0]) : null;
  }, [clientId]);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft" | "Archived">("All");

  useEffect(() => {
    if (levelId) {
      fetchLevelData();
      fetchSections();
    }
  }, [levelId]);

  useEffect(() => {
    applyFilters();
  }, [sections]);

  // useEffect(() => {
  //   applyFilters();
  // }, [sections, searchTerm, statusFilter]);

  const fetchLevelData = async () => {
    try {
      const response = await getInductionLevelById(Number(decodedLevelId), Number(decodedEmployerId));
      if (response?.data) {
        setLevel(response.data);
      }

    } catch (error) {
      console.error("Failed to load level", error);
      toast.error("Could not load level details");
    }
  };

  const fetchSections = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true, stats: true }));

      const response = await getInductionSectionsByLevelId(Number(decodedLevelId), Number(decodedEmployerId));
      const sectionsData = response?.data || [];

      setSections(sectionsData);
    } catch (error) {
      console.error("Failed to load sections", error);
      toast.error("Could not load induction sections");
      setSections([]);
    } finally {
      setLoading(prev => ({ ...prev, page: false, stats: false }));
    }
  };

  const applyFilters = () => {
    let filtered = [...sections];

    // if (searchTerm) {
    //   filtered = filtered.filter(section =>
    //     section.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     section.instructions?.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    // }

    // if (statusFilter !== "All") {
    //   filtered = filtered.filter(section => section.publishStatus === statusFilter);
    // }

    filtered.sort((a, b) => a.sortOrder - b.sortOrder);

    setFilteredSections(filtered);
  };

  const handleCreateSection = async (data: {
    inputValue?: string;
    inputValue5?: string;
    inputValue2?: string;
    dropdownValue?: string;
  }) => {
    try {
      const { inputValue: sectionName, inputValue5: description, inputValue2, dropdownValue } = data;

      if (!sectionName) {
        toast.error("Please enter a section name");
        return;
      }

      setLoading(prev => ({ ...prev, action: true }));

      const payload = {
        sectionName: sectionName,
        instructions: description || "",
        sortOrder: inputValue2 ? parseInt(inputValue2) : 1,
        status: dropdownValue || "0",
      };

      const response = await createInductionSection(payload, Number(decodedLevelId), Number(decodedEmployerId));
      console.log("ddd", response)
      toast.success("Section created successfully");
      closeModal();
      await fetchSections();
    } catch (error) {
      console.error("Create section error:", error);
      toast.error("Failed to create section");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleUpdateSection = async (data: {
    inputValue?: string;
    inputValue5?: string;
    inputValue2?: string;
    dropdownValue?: string;
  }) => {
    if (!selectedSection) return;

    try {
      const { inputValue: sectionName, inputValue5: description, inputValue2, dropdownValue } = data;

      if (!sectionName) {
        toast.error("Please enter a section name");
        return;
      }

      setLoading(prev => ({ ...prev, action: true }));

      const formData = new FormData();
      formData.append("SectionName", sectionName);
      formData.append("Instructions", description || "");
      formData.append("SortOrder", String(inputValue2 || selectedSection.sortOrder));
      formData.append("Status", dropdownValue || selectedSection.publishStatus);


      const payload = {
        sectionName: sectionName || selectedSection.sectionName,
        instructions: description || selectedSection.instructions,
        sortOrder: inputValue2 || selectedSection.sortOrder,
        status: dropdownValue || selectedSection.publishStatus,
      };

      const response = await updateInductionSection(Number(selectedSection.inductionSectionId), payload, Number(decodedEmployerId));
      console.log("refffs", response)
      toast.success("Section updated successfully");
      closeModal();
      await fetchSections();
    } catch (error) {
      console.error("Update section error:", error);
      toast.error("Failed to update section");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteSection = async () => {
    if (!selectedSectionId) return;

    try {
      setLoading(prev => ({ ...prev, action: true }));

      const response = await deleteInductionSection(Number(selectedSectionId), Number(decodedEmployerId));
      console.log("del", response)
      toast.success("Section deleted successfully");
      closeModal();
      await fetchSections();
    } catch (error) {
      console.error("Delete section error:", error);
      toast.error("Failed to delete section");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleSectionClick = (sectionId: string) => {
    navigate(`/induction/programmes/${categoryId}/stages/${levelId}/modules/${sectionId}/items`);
  };

  const handleViewItems = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/ClientMgt/Induction/Programmes/${categoryId}/Stages/${levelId}/Modules/${hashIds.encode(sectionId.toString())}/Items/${clientId}`);
  };

  const openAddModal = () => {
    setModalType("add");
  };

  const openEditModal = (section: Section, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSection(section);
    setModalType("edit");
  };

  const openDeleteModal = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSectionId(sectionId);
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSection(null);
    setSelectedSectionId(null);
  };

  const stats = {
    total: sections.length,
    published: sections.filter(s => s.publishStatus === "Published").length,
    draft: sections.filter(s => s.publishStatus === "Unpublished").length,
    totalItems: sections.reduce((sum, s) => sum + s.itemCount, 0),
    mandatoryItems: sections.reduce((sum, s) => sum + s.mandatoryCount, 0)
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

  const renderSkeletonSections = () => {
    return [1, 2, 3, 4].map((item) => (
      <div key={item} className="col-md-6 mb-4">
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
                <span className="placeholder bg-secondary" style={{ width: '70px', height: '24px', borderRadius: '4px', display: 'block' }}></span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: '20px', width: '60px' }}></span>
              </div>
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: '20px', width: '60px' }}></span>
              </div>
              <div className="placeholder-wave">
                <span className="placeholder col-8 bg-secondary" style={{ height: '20px', width: '80px' }}></span>
              </div>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-end">
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
            <PinIcon size={64} className="text-muted" style={{ opacity: 0.5 }} />
          </div>
          <h5 className="text-dark mb-2">No Sections Found</h5>
          <p className="text-muted mb-4">
            Get started by creating your first induction section for {level?.name}.
          </p>
          <button
            className="btn btn-success"
            onClick={openAddModal}
          >
            <Plus size={16} className="me-2" />
            Create New Section
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
          title="Create New Module"
          message={`Create a new induction module for ${level?.name || 'this level'}`}
          confirmText="Create Module"
          cancelText="Cancel"
          confirmColor="success"
          inputLabel="Module Name"
          inputPlaceholder="e.g., Welcome & Introduction, Safety Guidelines"
          inputLabel5="Instruction (Optional)"
          inputPlaceholder5="Include instructions for this module ..."
          inputLabel2="Sort Order"
          inputPlaceholder2="Display order"
          defaultInputValue2={String(sections.length + 1)}
          dropdownLabel="Status"
          dropdownOptions={[
            { value: "0", label: "Unpublished" },
            { value: "1", label: "Published" }
          ]}
          defaultDropdownValue="0"
          buttonIcon={<CheckCheck size={16} />}
          headerIcon={<Plus size={20} />}
          loading={loading.action}
          onConfirm={handleCreateSection}
          onCancel={closeModal}
        />

        <Modal
          isOpen={modalType === "edit"}
          title="Edit Module"
          message="Update the induction module details."
          confirmText="Update Module"
          cancelText="Cancel"
          confirmColor="warning"
          inputLabel="Module Name"
          inputPlaceholder=""
          defaultInputValue={selectedSection?.sectionName ?? ""}
          inputLabel5="Description"
          inputPlaceholder5=""
          defaultInputValue5={selectedSection?.instructions ?? ""}
          inputLabel2="Sort Order"
          inputPlaceholder2="Display order"
          defaultInputValue2={String(sections.length + 1)}
          dropdownLabel="Status"
          dropdownOptions={[
            { value: "0", label: "Unpublished" },
            { value: "1", label: "Published" }
          ]}
          defaultDropdownValue="0"
          buttonIcon={<Pen size={16} />}
          headerIcon={<Edit size={20} />}
          loading={loading.action}
          onConfirm={handleUpdateSection}
          onCancel={closeModal}
        />

        <Modal
          isOpen={modalType === "delete"}
          title="Delete Section"
          message="Are you sure you want to delete this module? All items within this module will also be deleted. This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="danger"
          buttonIcon={<Trash size={16} />}
          headerIcon={<AlertCircle size={20} />}
          loading={loading.action}
          onConfirm={handleDeleteSection}
          onCancel={closeModal}
        />

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="page-title-box d-flex-between flex-wrap gap-15">
              <div className="d-flex align-items-center gap-3">
                <div>
                  <h1 className="page-title fs-18 lh-1">
                    {loading.page ? (
                      <div className="placeholder-wave">
                        <span className="placeholder col-6 bg-secondary" style={{ height: '28px', width: '200px' }}></span>
                      </div>
                    ) : (
                      level?.name || 'Modules'
                    )}
                  </h1>
                  <p className="text-muted mb-0">
                    {loading.page ? (
                      <div className="placeholder-wave">
                        <span className="placeholder col-8 bg-secondary" style={{ height: '16px', width: '250px' }}></span>
                      </div>
                    ) : (
                      `Level ${level?.inductionLevelNo} • ${level?.description || 'Manage induction modules'}`
                    )}
                  </p>
                </div>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-example1 mb-0">
                  <li className="breadcrumb-item active">Modules</li>
                  <li className="breadcrumb-item"><NavLink to={`/induction/programmes/${categoryId}`}>Stages</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/induction">Induction</NavLink></li>
                  <li className="breadcrumb-item"><NavLink to="/dashboard">Home</NavLink></li>

                </ol>
              </nav>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-0">
          {loading.stats || loading.page ? (
            renderSkeletonCards()
          ) : (
            <div className="d-none">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-primary-transparent text-primary">
                      <PinIcon size={30} />
                    </div>
                    <div className="card-content">
                      <span className="d-block fs-16 mb-5">Total Sections</span>
                      <h2 className="mb-5">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-success-transparent text-success">
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
                      <ClipboardList size={30} />
                    </div>
                    <div className="card-content">
                      <span className="d-block fs-16 mb-5">Total Items</span>
                      <h2 className="mb-5">{stats.totalItems}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body mini-card-body d-flex align-center gap-16">
                    <div className="avatar avatar-xl bg-warning-transparent text-warning">
                      <Gavel size={30} />
                    </div>
                    <div className="card-content">
                      <span className="d-block fs-16 mb-5">Mandatory Items</span>
                      <h2 className="mb-5">{stats.mandatoryItems}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div >
          )}
        </div>

        {/* Filters and Actions Bar */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <h3 className="fs-18">All Modules</h3>
                {/*  <div className="input-group">
                    <span className="input-group-text bg-transparent">
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search sections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loading.page}
                    />
                  </div> */}
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
                    <option value="Archived">Archived</option>
                  </select> */}
              </div>
              <div className="col-md-5 text-end">
                <button
                  className="btn btn-success"
                  onClick={openAddModal}
                  disabled={loading.action || loading.page}
                >
                  <Plus size={16} className="me-1" />
                  New Module
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        {loading.page ? (
          <div className="row">
            {renderSkeletonSections()}
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="row">
            {renderEmptyState()}
          </div>
        ) : (
          <div className="row">
            {filteredSections.map(section => (
              <div key={section.inductionSectionId} className="col-md-4 mb-4">
                <div
                  className="card h-100 section-card"
                  onClick={() => handleSectionClick(section.inductionSectionId)}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-3">
                        <div className="section-icon mr-20" style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: section.publishStatus === 'Published'
                            ? '#22c55e20' : section.publishStatus === 'Unpublished'
                              ? '#f59e0b20' : '#94a3b820',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <PinIcon size={24} color={
                            section.publishStatus === 'Published' ? '#22c55e' :
                              section.publishStatus === 'Unpublished' ? '#f59e0b' : '#94a3b8'
                          } />
                        </div>
                        <div>
                          <h5 className="mb-1">{section.sectionName}</h5>
                          <span className={`badge ${section.publishStatus === 'Published' ? 'bg-success' :
                            section.publishStatus === 'Unpublished' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                            {section.publishStatus}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark">
                          Order {section.sortOrder}
                        </span>
                        <div className="dropdown">
                          <button
                            className="btn btn-link text-muted p-0"
                            data-bs-toggle="dropdown"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={18} />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={(e) => openEditModal(section, e)}
                              >
                                <Edit size={14} className="me-2" />Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={(e) => openDeleteModal(section.inductionSectionId, e)}
                              >
                                <Trash size={14} className="me-2" />Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {section.instructions && (
                      <p className="text-muted small mt-2 mb-3">{section.instructions}</p>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      {/* <div>
                          <small className="text-muted d-block">Items</small>
                          <span className="fw-bold fs-5">{section.itemCount}</span>
                        </div>
                        <div>
                          <small className="text-muted d-block">Mandatory</small>
                          <span className="fw-bold fs-5 text-danger">{section.mandatoryCount}</span>
                        </div> */}
                      <div className="text-end">
                        <small className="">Created{" "}
                          <span >
                            {new Date(section.dateCreated).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span></small>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={(e) => handleViewItems(section.inductionSectionId, e)}
                      >
                        <Eye size={14} className="me-1" /> View Items
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
        .section-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e5e7eb;
          cursor: pointer;
        }
        .section-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }
        .placeholder-wave {
          width: 100%;
        }
        .bg-success-transparent {
          background: rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </div>
  );
};

export default InductionLevelSections;