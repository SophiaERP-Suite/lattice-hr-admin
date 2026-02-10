import { CheckCheck, ChevronRight, PenLine, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { addJobCategory, deleteJobCategory, fetchAllJobCategories, updateJobCategory } from "../../utils/JobCategoryRequests";
import { useForm, useWatch } from "react-hook-form";
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { fetchJobSectors } from "../../utils/JobSetorRequests";

interface JobCategoryData {
  jobCategoryId: number;
  jobSector: string;
  jobSectorId: string;
  isEnabled: boolean;
  categoryName: string;
}

interface JobSectorData {
  jobSectorId: number;
  name: string;
}

interface JobCategoryForm {
    CategoryName: string;
    JobSectorId: string;
}

interface JobCategoryFilter {
    jobSectorId: string;
}

export default function JobCategoryMgt() {
    const [jobCategories, setJobCategories] = useState<JobCategoryData[]>([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [jobSectors, setJobSectors] = useState<JobSectorData[]>([]);
    const { register, formState, handleSubmit, reset } = useForm<JobCategoryForm>();
    const { register: filterRegister, control} = useForm<JobCategoryFilter>();
    const filters = useWatch({ control });
    const { errors } = formState;
    const {
        register: editRegister,
        formState: editFormState,
        handleSubmit: submitEdit,
        reset: resetEdit,
        setValue
    } = useForm<JobCategoryForm>();
    const { errors: editErrors } = editFormState;

    const [categoryEdit, setCategoryEdit] = useState<JobCategoryData | null>(null);
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [delModalState, setDelModalState] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchAllJobCategories({ pageNumber, limit, ...filters })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setJobCategories(data.data.categories);
                setTotalCategories(data.data.totalCount);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
        .catch((err) => console.log(err))
    }, [pageNumber, limit, filters]);

    useEffect(() => {
        fetchJobSectors()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setJobSectors(data.data);
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

    const refetchJobCategories = async () => {
        try {
            const res = await fetchAllJobCategories({ pageNumber, limit, ...filters });
            if (res.status === 200) {
                const data = await res.json()
                setJobCategories(data.data.categories);
                setTotalCategories(data.data.totalCount);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitNewJobCategory = async (data: JobCategoryForm) => {
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
            formData.append('JobSectorId', data.JobSectorId);
            const res = await addJobCategory(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(() => {
                setAddModalState(false);
                refetchJobCategories();
            })
        }
    }

    const editJobCategory = async (data: JobCategoryForm) => {
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
            const res = await updateJobCategory(formData, categoryEdit.jobCategoryId);
            handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(() => {
                setEditModalState(false);
                refetchJobCategories();
            })
        }
    }

    const delJobCategory = async (jobCategoryId: number) => {
        const loader = document.getElementById('query-loader-2');
        const text = document.getElementById('query-text-2');
        if (loader) {
            loader.style.display = 'flex';
        }
        if (text) {
            text.style.display = 'none';
        }
        const res = await deleteJobCategory(jobCategoryId);
        handleCreateEmployee(res, loader, text, { toast }, null)
        .finally(() => {
            setDelModalState(false);
            refetchJobCategories();
        })
    }
    
    const updateJobCategoriestatus = async (jobCategoryId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("IsEnabled", String(status));
        const res = await updateJobCategory(formData, jobCategoryId);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
        .finally(async () => {
            await refetchJobCategories();
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
                <form noValidate onSubmit={handleSubmit(submitNewJobCategory)}>
                    <div className="d-flex justify-content-between border-bottom">
                        <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Job Category</h1>
                        <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
                    </div>
                    <div className="mt-4">
                        <div className="row gy-15 text-start">
                            <div className="col-xl-12">
                                <label className="form-label">Job Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Job Category"
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
                            <div className="col-xl-12">
                                <label className="form-label">Job Sector</label>
                                <select
                                    className="form-select"
                                    {
                                        ...register('JobSectorId',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                    }>
                                    <option value="">Select Job Sector</option>
                                    {
                                        jobSectors.map((data, index) => (
                                            <option key={index} value={data.jobSectorId}>{ data.name }</option>
                                        ))
                                    }
                                </select>
                                <p className='error-msg'>{errors.JobSectorId?.message}</p>
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
                                    <CheckCheck size={18} className="mr-2" /> Add Job Category
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
                        <form noValidate onSubmit={submitEdit(editJobCategory)}>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Update Job Category</h1>
                                <button type="button" className="btn-close"  onClick={() => setEditModalState(false)}></button>
                            </div>
                            <div className="mt-4">
                                <div className="row gy-15 text-start">
                                    <div className="col-xl-12">
                                        <label className="form-label">Job Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Job Category"
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
                                            <PenLine size={18} className="mr-2" /> Update Job Category
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
                                <h1 className="modal-title fs-16 text-wrap" id="addNewTimeSheetLabel">Are you sure you want to delete the job Category - {categoryEdit.categoryName}</h1>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end gap-10 mt-20">
                                    <button type="button" className="btn bg-black text-white" onClick={() => setDelModalState(false)}>
                                        <X size={18} className="mr-2" /> Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger" onClick={() => delJobCategory(categoryEdit.jobCategoryId)}>
                                        <div className="dots" id="query-loader-2">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                        <span id="query-text-2">
                                            <Trash2 size={18} className="mr-2" /> Delete Job Category
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
                    <h1 className="page-title fs-18 lh-1">Job Category Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/JobCategoryMgt">
                                    Job Category Management
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
                        <h4 className="d-flex-items gap-10">Job Categories<span className="badge bg-label-primary">{totalCategories}</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <div className="dataTables-sorting-control ">
                                <select className="form-select sorting-dropdown" { ...filterRegister('jobSectorId') }>
                                    <option value="">All Job Sectors</option>
                                    {
                                        jobSectors.map((data, index) => (
                                            <option key={index} value={data.jobSectorId}>{ data.name }</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                <Plus /> Add Job Category
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
                                        <th scope="col">Job Category</th>
                                        <th scope="col">Job Sector</th>
                                        <th scope="col">Enabled</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        jobCategories.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ width: '8%' }}>
                                                        { index + 1 }
                                                    </td>
                                                    <td style={{ width: '40%' }}>
                                                        {data.categoryName}
                                                    </td>
                                                    <td style={{ width: '40%' }}>
                                                        {data.jobSector}
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={`toggle-switch ${data.isEnabled ? 'on' : ''}`}
                                                            onClick={() => updateJobCategoriestatus(data.jobCategoryId, !data.isEnabled)}
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
                        <div className="d-flex justify-content-between mt-4">
                            <div className="flex justify-content-center align-items-center mb-1">
                                <p className="text-black">
                                    Showing { jobCategories.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { jobCategories.length > 0 ? (((pageNumber * limit) - limit) + 1) + (jobCategories.length - 1) : 0 } of { totalCategories } entries
                                </p>
                            </div>
                            <div className="d-inline-flex flex-wrap">
                                {
                                    pageNumber > 1 && <a
                                        href="#"
                                        onClick={() => { if (pageNumber > 1) {setPageNumber(pageNumber - 1);} }}
                                        className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start"
                                    >
                                        Previous
                                    </a>
                                }
                                <a
                                    href="#"
                                    className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer"
                                >
                                    { pageNumber }
                                </a>
                                {
                                    (pageNumber * limit) < totalCategories && <a
                                    href="#"
                                    onClick={() => { setPageNumber(pageNumber + 1); }}
                                    className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end"
                                    >
                                        Next
                                    </a>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}