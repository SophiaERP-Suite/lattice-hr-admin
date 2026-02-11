import { CheckCheck, ChevronRight, PenLine, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { addWorkMode, deleteWorkMode, fetchAllWorkModes, updateWorkMode } from "../../utils/WorkModeRequests";
import { useForm } from "react-hook-form";
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import { handleCreateEmployee } from "../../utils/EmployeeResponse";

interface WorkModeData {
  workModeId: number;
  isEnabled: boolean;
  modeName: string;
}

interface WorkModeForm {
    ModeName: string;
}

export default function WorkModeMgt() {
    const [workModes, setWorkModes] = useState<WorkModeData[]>([]);
    const { register, formState, handleSubmit, reset } = useForm<WorkModeForm>();
    const { errors } = formState;
    const {
        register: editRegister,
        formState: editFormState,
        handleSubmit: submitEdit,
        reset: resetEdit,
        setValue
    } = useForm<WorkModeForm>();
    const { errors: editErrors } = editFormState;
    const [modeEdit, setModeEdit] = useState<WorkModeData | null>(null);
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [delModalState, setDelModalState] = useState(false);

    useEffect(() => {
        fetchAllWorkModes()
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    setWorkModes(data.data);
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
        if (modeEdit) {
            setValue('ModeName', modeEdit.modeName);
        }
    }, [modeEdit])

    const refetchWorkModes = async () => {
        try {
            const res = await fetchAllWorkModes();
            if (res.status === 200) {
                const data = await res.json()
                setWorkModes(data.data);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitNewWorkMode = async (data: WorkModeForm) => {
        if (!errors.ModeName) {
            const loader = document.getElementById('query-loader');
            const text = document.getElementById('query-text');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append('ModeName', data.ModeName);
            const res = await addWorkMode(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(() => {
                setAddModalState(false);
                refetchWorkModes();
            })
        }
    }

    const editWorkMode = async (data: WorkModeForm) => {
        if (!editErrors.ModeName && modeEdit) {
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append('ModeName', data.ModeName);
            const res = await updateWorkMode(formData, modeEdit.workModeId);
            handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(() => {
                setEditModalState(false);
                refetchWorkModes();
            })
        }
    }

    const delWorkMode = async (workModeId: number) => {
        const loader = document.getElementById('query-loader-2');
        const text = document.getElementById('query-text-2');
        if (loader) {
            loader.style.display = 'flex';
        }
        if (text) {
            text.style.display = 'none';
        }
        const res = await deleteWorkMode(workModeId);
        handleCreateEmployee(res, loader, text, { toast }, null)
        .finally(() => {
            setDelModalState(false);
            refetchWorkModes();
        })
    }
    
    const updateWorkModeStatus = async (workModeId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("IsEnabled", String(status));
        const res = await updateWorkMode(formData, workModeId);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
        .finally(async () => {
            await refetchWorkModes();
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
                <form noValidate onSubmit={handleSubmit(submitNewWorkMode)}>
                    <div className="d-flex justify-content-between border-bottom">
                        <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Work Mode</h1>
                        <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
                    </div>
                    <div className="mt-4">
                        <div className="row gy-15 text-start">
                            <div className="col-xl-12">
                                <label className="form-label">Work Mode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Work Mode"
                                    {
                                        ...register('ModeName',
                                            {
                                                required: 'Required'
                                            }
                                        )
                                    }
                                />
                                <p className='error-msg'>{errors.ModeName?.message}</p>
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
                                    <CheckCheck size={18} className="mr-2" /> Add Work Mode
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
                modeEdit && (
                    <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                        <form noValidate onSubmit={submitEdit(editWorkMode)}>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Update Work Mode</h1>
                                <button type="button" className="btn-close"  onClick={() => setEditModalState(false)}></button>
                            </div>
                            <div className="mt-4">
                                <div className="row gy-15 text-start">
                                    <div className="col-xl-12">
                                        <label className="form-label">Work Mode</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Work Mode"
                                            {
                                                ...editRegister('ModeName',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )
                                            }
                                        />
                                        <p className='error-msg'>{editErrors.ModeName?.message}</p>
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
                                            <PenLine size={18} className="mr-2" /> Update Work Mode
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
                modeEdit && (
                    <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                        <div>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16 text-wrap" id="addNewTimeSheetLabel">Are you sure you want to delete the work mode - {modeEdit.modeName}</h1>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end gap-10 mt-20">
                                    <button type="button" className="btn bg-black text-white" onClick={() => setDelModalState(false)}>
                                        <X size={18} className="mr-2" /> Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger" onClick={() => delWorkMode(modeEdit.workModeId)}>
                                        <div className="dots" id="query-loader-2">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                        <span id="query-text-2">
                                            <Trash2 size={18} className="mr-2" /> Delete Work Mode
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
                    <h1 className="page-title fs-18 lh-1">Work Mode</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/WorkModeMgt">
                                    Work Mode
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
                        <h4 className="d-flex-items gap-10">Work Modes<span className="badge bg-label-primary">{workModes.length}</span></h4>
                        <div className="d-flex flex-wrap gap-15">
                            <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                <Plus /> Add Work Mode
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
                                        <th scope="col">Work Mode</th>
                                        <th scope="col">Enabled</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        workModes.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ width: '8%' }}>
                                                        { index + 1 }
                                                    </td>
                                                    <td style={{ width: '72%' }}>
                                                        {data.modeName}
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={`toggle-switch ${data.isEnabled ? 'on' : ''}`}
                                                            onClick={() => updateWorkModeStatus(data.workModeId, !data.isEnabled)}
                                                            >
                                                            <div className="toggle-knob" />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <button className="btn-icon btn-warning-light" type="button" onClick={() => { setModeEdit(data); setEditModalState(true); }}>
                                                                <a><PenLine /></a>
                                                            </button>
                                                            <button className="btn-icon btn-danger-light" type="button" onClick={() => { setModeEdit(data); setDelModalState(true); }}>
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