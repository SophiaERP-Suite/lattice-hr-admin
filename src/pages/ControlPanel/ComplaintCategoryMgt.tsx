import { CheckCheck, ChevronRight, PenLine, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { addComplaintCategory, deleteComplaintCategory, fetchAllComplaintCategories, updateComplaintCategory } from "../../utils/ComplaintCategoryRequests";
import { useForm } from "react-hook-form";
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import { handleCreateEmployee } from "../../utils/EmployeeResponse";

interface ComplaintCategoryData {
  categoryId: number;
  isEnabled: boolean;
  categoryName: string;
}

interface ComplaintCategoryForm {
    CategoryName: string;
}

export default function ComplaintCategoryMgt() {
    const [complaintCategories, setComplaintCategories] = useState<ComplaintCategoryData[]>([]);
    const { register, formState, handleSubmit, reset } = useForm<ComplaintCategoryForm>();
    const { errors } = formState;
    const {
        register: editRegister,
        formState: editFormState,
        handleSubmit: submitEdit,
        reset: resetEdit,
        setValue
    } = useForm<ComplaintCategoryForm>();
    const { errors: editErrors } = editFormState;
    const [categoryEdit, setCategoryEdit] = useState<ComplaintCategoryData | null>(null);
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [delModalState, setDelModalState] = useState(false);

    useEffect(() => {
        fetchAllComplaintCategories()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setComplaintCategories(data.data);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        if (categoryEdit) {
            setValue('CategoryName', categoryEdit.categoryName);
        }
    }, [categoryEdit])

    const refetchComplaintCategorys = async () => {
        try {
            const res = await fetchAllComplaintCategories();
            if (res.status === 200) {
                const data = await res.json()
                setComplaintCategories(data.data);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitNewComplaintCategory = async (data: ComplaintCategoryForm) => {
        if (!errors.CategoryName) {
            const loader = document.getElementById('query-loader');
            const text = document.getElementById('query-text');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append('CategoryName', data.CategoryName);
            const res = await addComplaintCategory(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(() => {
                setAddModalState(false);
                refetchComplaintCategorys();
            })
        }
    }

    const editComplaintCategory = async (data: ComplaintCategoryForm) => {
        if (!editErrors.CategoryName && categoryEdit) {
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append('CategoryName', data.CategoryName);
            const res = await updateComplaintCategory(formData, categoryEdit.categoryId);
            handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(() => {
                setEditModalState(false);
                refetchComplaintCategorys();
            })
        }
    }

    const delComplaintCategory = async (categoryId: number) => {
        const loader = document.getElementById('query-loader-2');
        const text = document.getElementById('query-text-2');
        if (loader) {
            loader.style.display = 'flex';
        }
        if (text) {
            text.style.display = 'none';
        }
        const res = await deleteComplaintCategory(categoryId);
        handleCreateEmployee(res, loader, text, { toast }, null)
        .finally(() => {
            setDelModalState(false);
            refetchComplaintCategorys();
        })
    }
    
    const updateComplaintCategoryStatus = async (jobTypeId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("IsEnabled", String(status));
        const res = await updateComplaintCategory(formData, jobTypeId);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
        .finally(async () => {
            await refetchComplaintCategorys();
        });
    }

    return <div className="container-fluid">
        <ToastContainer />
        <Modal isOpen={addModalState} onRequestClose={() => { setAddModalState(false); }}
            style={{
            content: {
            width: 'fit-content',
            height: 'fit-content',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(255 255 255)',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            },
            overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }
        }}
        >
            
            <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                <form noValidate onSubmit={handleSubmit(submitNewComplaintCategory)}>
                    <div className="d-flex justify-content-between border-bottom">
                        <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Complaint Category</h1>
                        <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
                    </div>
                    <div className="mt-4">
                        <div className="row gy-15 text-start">
                            <div className="col-xl-12">
                                <label className="form-label">Complaint Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Complaint Category"
                                    {
                                        ...register('CategoryName',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                    }
                                />
                                <p className='error-msg'>{errors.CategoryName?.message}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex justify-content-end gap-10 mt-20">
                            <button type="button" className="btn btn-danger" onClick={() => setAddModalState(false)}>
                                <X size={18} className="mr-2" /> Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                                <div className="dots" id="query-loader">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                                <span id="query-text">
                                    <CheckCheck size={18} className="mr-2" /> Add Complaint Category
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
        <Modal isOpen={editModalState} onRequestClose={() => { setEditModalState(false); }}
            style={{
            content: {
            width: 'fit-content',
            height: 'fit-content',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(255 255 255)',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            },
            overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }
        }}
        >
            {
                categoryEdit && (
                    <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                        <form noValidate onSubmit={submitEdit(editComplaintCategory)}>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Update Complaint Category</h1>
                                <button type="button" className="btn-close"  onClick={() => setEditModalState(false)}></button>
                            </div>
                            <div className="mt-4">
                                <div className="row gy-15 text-start">
                                    <div className="col-xl-12">
                                        <label className="form-label">Complaint Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Complaint Category"
                                            {
                                                ...editRegister('CategoryName',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                            }
                                        />
                                        <p className='error-msg'>{editErrors.CategoryName?.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end gap-10 mt-20">
                                    <button type="button" className="btn btn-danger" onClick={() => setEditModalState(false)}>
                                        <X size={18} className="mr-2" /> Cancel
                                    </button>
                                    <button type="submit" className="btn btn-warning">
                                        <div className="dots" id="query-loader-1">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                        <span id="query-text-1">
                                            <PenLine size={18} className="mr-2" /> Update Complaint Category
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }
            
        </Modal>
        <Modal isOpen={delModalState} onRequestClose={() => { setDelModalState(false); }}
            style={{
            content: {
            width: 'fit-content',
            height: 'fit-content',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(255 255 255)',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            },
            overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
            }
        }}
        >
            {
                categoryEdit && (
                    <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                        <div>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16 text-wrap" id="addNewTimeSheetLabel">Are you sure you want to delete the complaint category - {categoryEdit.categoryName}</h1>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end gap-10 mt-20">
                                    <button type="button" className="btn bg-black text-white" onClick={() => setDelModalState(false)}>
                                        <X size={18} className="mr-2" /> Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger" onClick={() => delComplaintCategory(categoryEdit.categoryId)}>
                                        <div className="dots" id="query-loader-2">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                        <span id="query-text-2">
                                            <Trash2 size={18} className="mr-2" /> Delete Complaint Category
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            
        </Modal>
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Complaint Category</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/ComplaintCategoryMgt">
                                    Complaint Category
                                </NavLink>
                            </li>
                            <li className="mb-2">
                                <ChevronRight size={15} />
                            </li>
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel">
                                    Control Panel
                                </NavLink>
                            </li>
                            <li className="mb-2">
                                <ChevronRight size={15} />
                            </li>
                            <li className="breadcrumb-item">
                                <NavLink to="/Dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header justify-between">
                        <h4 className="d-flex-items gap-10">Complaint Categories<span className="badge bg-label-primary">{complaintCategories.length}</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                <Plus /> Add Complaint Category
                            </button>
                        </div>
                    </div>
                    <div className="card-body pt-15">
                        <div className="table-responsive">
                            <table id="companiesDataTable" className="table text-nowrap text-start w-100">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            S/N
                                        </th>
                                        <th scope="col">Cmplaint Category</th>
                                        <th scope="col">Enabled</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        complaintCategories.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ width: '8%' }}>
                                                        { index + 1 }
                                                    </td>
                                                    <td style={{ width: '72%' }}>
                                                        {data.categoryName}
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={`toggle-switch ${data.isEnabled ? 'on' : ''}`}
                                                            onClick={() => updateComplaintCategoryStatus(data.categoryId, !data.isEnabled)}
                                                            >
                                                            <div className="toggle-knob" />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-warning-light" type="button" onClick={() => { setCategoryEdit(data); setEditModalState(true); }}>
                                                                <a><PenLine /></a>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light" type="button" onClick={() => { setCategoryEdit(data); setDelModalState(true); }}>
                                                                <a><Trash2 /></a>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}