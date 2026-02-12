import {
  CheckCheck,
  ChevronRight,
  Eye,
  FolderOpenDot,
  FolderOutput,
  PenLine,
  Plus,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { NavLink } from "react-router-dom";
import RichTextEditor from "../../layout/RichTextEditor";
import { useForm, Controller } from "react-hook-form";
import { addFeatureToPackage, createPackage, fetchAllPackages, updatePackageDetails } from "../../utils/PackageRequests";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import HtmlRenderer from "../../layout/HTMLRenderer";
import Modal from 'react-modal';
import Tippy from "@tippyjs/react";
import { fetchActiveServiceTypes } from "../../utils/ServiceTypesRequests";
import Hashids from "hashids";
import { fetchCurrencies } from "../../utils/CurrencyRequests";

interface PackageData {
  packageId: number;
  packageName: string;
  packageDescription: string;
  duration: number;
  durationUnit: string;
  amount: number;
  currency: string;
  totalFeatures: number;
  totalEmployers: number;
  dateCreated: string;
  isActive: boolean;
}

interface PackageFormData {
  PackageName: string;
  PackageDescription: string;
  Duration: number;
  DurationUnit: string;
  Amount: number;
  Currency: string;
  IsActive: string;
}

interface FeatureFormData {
  Description: string;
  ServiceTypeId: string;
  Quantity: number;
}

interface ServiceTypes {
    serviceTypeId: string;
    serviceName: string;
}

interface CurrencyData {
    currencyId: number;
    name: string;
    code: string;
    symbol: string;
    isActive: boolean;
    dateCreated: string;
}

export default function Packages() {
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [serviceTypes, setServiceTypes] = useState<ServiceTypes[]>([]);
    const { register, reset, handleSubmit, formState, control } = useForm<PackageFormData>();
    const [pageNumber, setPageNumber] = useState(1);
    const [totalActive, setTotalActive] = useState(0);
    const [totalInactive, setTotalInactive] = useState(0);
    const [totalPackages, setTotalPackages] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const limit = 10;
    const { errors } = formState;
    const {
        register: regEdit,
        reset: resetEdit,
        handleSubmit: submitEdit,
        formState: editFormState,
        control: editControl,
        setValue,
    } = useForm<PackageFormData>();
    const { errors: editErrors } = editFormState;
    const {
        register: regFeat,
        reset: resetFeat,
        handleSubmit: submitFeature,
        formState: featFormState,
        control: featControl,
    } = useForm<FeatureFormData>();
    const { errors: featErrors } = featFormState;
    const [packageEdit, setPackageEdit] = useState<PackageData | null>(null);
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [featureModalState, setFeatureModalState] = useState(false);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);

    useEffect(() => {
        fetchAllPackages({ pageNumber, limit })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data);
                setPackages(data.data.packages);
                setTotalPackages(data.data.totalCount);
                setTotalActive(data.data.totalActive ?? 0);
                setTotalInactive(data.data.totalInActive ?? 0);
                setTotalSubscribers(data.data.totalSubscribed ?? 0);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
    }, [pageNumber, limit]);

    useEffect(() => {
        fetchCurrencies()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setCurrencyData(data.data);
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
        fetchActiveServiceTypes()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                console.log(data);
                setServiceTypes(data.data);
            })
        } else {
            res.text()
            .then(data => {
                console.log(JSON.parse(data));
            })
        }
        })
    }, []);
    
    useEffect(() => {
        if (packageEdit) {
            setValue('PackageName', packageEdit.packageName);
            setValue('Duration', packageEdit.duration);
            setValue('PackageDescription', packageEdit.packageDescription);
            setValue('Currency', packageEdit.currency);
            setValue('Duration', packageEdit.duration);
            setValue('DurationUnit', packageEdit.durationUnit);
            setValue('Amount', packageEdit.amount);
        }
    }, [packageEdit, setValue]);

    const refetchPackages = async () => {
        try {
        const res = await fetchAllPackages({ pageNumber, limit });
        if (res.status === 200) {
            const data = await res.json()
            console.log(data);
            setPackages(data.data.packages);
            setTotalPackages(data.data.totalCount);
            setTotalActive(data.data.totalActive ?? 0);
            setTotalInactive(data.data.totalInActive ?? 0);
            setTotalSubscribers(data.data.totalSubscribed ?? 0);
        } else {
            const resText = await res.text();
            console.log(JSON.parse(resText));
        }
        
        } catch (err) {
            console.error(err);
        }
    };

    const submitPackage = async (data: PackageFormData) => {
        if (!errors.PackageName && !errors.PackageDescription &&
            !errors.Duration && !errors.DurationUnit && 
            !errors.Amount && !errors.Currency
        ) {
            const loader = document.getElementById('query-loader');
            const text = document.getElementById('query-text');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append("PackageName", data.PackageName);
            formData.append("Duration", String(data.Duration));
            formData.append("DurationUnit", data.DurationUnit);
            formData.append("PackageDescription", data.PackageDescription);
            formData.append("Amount", String(data.Amount));
            formData.append("Currency", data.Currency);
            const res = await createPackage(formData);
            handleCreateEmployee(res, loader, text, { toast }, reset)
            .finally(async () => {
                await refetchPackages();
                setAddModalState(false);
            });
        }
    }

    const submitNewFeature = async (data: FeatureFormData) => {
        if (!featErrors.ServiceTypeId && !featErrors.Description &&
            !featErrors.Quantity && packageEdit
        ) {
            const loader = document.getElementById('query-loader-2');
            const text = document.getElementById('query-text-2');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append("Description", data.Description);
            formData.append("ServiceTypeId", String(data.ServiceTypeId));
            formData.append("Quantity", String(data.Quantity));
            const res = await addFeatureToPackage(packageEdit.packageId, formData);
            handleCreateEmployee(res, loader, text, { toast }, resetFeat)
            .finally(async () => {
                await refetchPackages();
                setFeatureModalState(false);
            });
        }
    }

    const editPakage = async (data: PackageFormData) => {
        if (packageEdit && !editErrors.PackageName && !editErrors.PackageDescription &&
            !editErrors.Duration && !editErrors.DurationUnit && 
            !editErrors.Amount && !editErrors.Currency
        ) {
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) {
                loader.style.display = 'flex';
            }
            if (text) {
                text.style.display = 'none';
            }
            const formData = new FormData();
            formData.append("PackageName", data.PackageName);
            formData.append("Duration", String(data.Duration));
            formData.append("DurationUnit", data.DurationUnit);
            formData.append("PackageDescription", data.PackageDescription);
            formData.append("Amount", String(data.Amount));
            formData.append("Currency", data.Currency);
            const res = await updatePackageDetails(packageEdit.packageId, formData);
            handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(async () => {
                await refetchPackages();
                setEditModalState(false);
            });
        }
    }

    const updatePackageStatus = async (packageId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("IsActive", String(status));
        const res = await updatePackageDetails(packageId, formData);
        handleCreateEmployee(res, null, null, { toast }, resetEdit)
        .finally(async () => {
            await refetchPackages();
        });
    }
    return (
        <div className="container-fluid">
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
                    <form noValidate onSubmit={handleSubmit(submitPackage)}>
                        <div className="d-flex justify-content-between border-bottom">
                            <h1 className="modal-title fs-16" id="addNewTimeSheetLabel">Create New Package</h1>
                            <button type="button" className="btn-close"  onClick={() => setAddModalState(false)}></button>
                        </div>
                        <div className="mt-4">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label className="form-label">Package Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Package Name"
                                        {
                                            ...register('PackageName',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }
                                    />
                                    <p className='error-msg'>{errors.PackageName?.message}</p>
                                </div>
                                
                                <div className="col-xl-6">
                                    <label className="form-label">Duration</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Duration"
                                        {
                                            ...register('Duration',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        } />
                                    <p className='error-msg'>{errors.Duration?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label htmlFor="duration" className="form-label">Duration Unit</label>
                                    <select
                                        className="form-select"
                                        id="duration"
                                        {
                                            ...register('DurationUnit',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }>
                                        <option value="">Select Duration</option>
                                        <option value="Days">Days</option>
                                        <option value="Weeks">Weeks</option>
                                        <option value="Months">Months</option>
                                    </select>
                                    <p className='error-msg'>{errors.DurationUnit?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Package Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Amount"
                                        {
                                            ...register('Amount',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        } />
                                    <p className='error-msg'>{errors.Amount?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label">Currency</label>
                                    <select
                                        className="form-select"
                                        {
                                            ...register('Currency',
                                                {
                                                    required: 'Required'
                                                }
                                            )
                                        }>
                                        <option value="">Select Currency</option>
                                        {
                                            currencyData.map((data, index) => (
                                                <option key={index} value={data.code}>{data.code}</option>
                                            ))
                                        }
                                    </select>
                                    <p className='error-msg'>{errors.Currency?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Package Description</label>
                                    <Controller
                                        name="PackageDescription"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        )}
                                    />
                                    <p className='error-msg'>{errors.PackageDescription?.message}</p>
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
                                        <CheckCheck size={18} className="mr-2" />
                                        Add Package
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
                
                <div  className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                    {
                        packageEdit && (
                            <form noValidate onSubmit={submitEdit(editPakage)}>
                                <div  className="d-flex justify-content-between border-bottom">
                                    <h1 className="modal-title fs-16 font-bold" id="addNewTimeSheetLabel">Update Package</h1>
                                    <button type="button" className="btn-close"  onClick={() => setEditModalState(false)}></button>
                                </div>
                                <div className="mt-4">
                                    <div className="row gy-15 text-start">
                                        <div className="col-xl-12">
                                            <label className="form-label">Package Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Package Name"
                                                {
                                                    ...regEdit('PackageName',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }
                                            />
                                            <p className='error-msg'>{editErrors.PackageName?.message}</p>
                                        </div>
                                        
                                        <div className="col-xl-6">
                                            <label className="form-label">Duration</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Duration"
                                                {
                                                    ...regEdit('Duration',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                } />
                                            <p className='error-msg'>{editErrors.Duration?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label htmlFor="duration" className="form-label">Duration Unit</label>
                                            <select
                                                className="form-select"
                                                id="duration"
                                                {
                                                    ...regEdit('DurationUnit',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Duration</option>
                                                <option value="Days">Days</option>
                                                <option value="Weeks">Weeks</option>
                                                <option value="Months">Months</option>
                                            </select>
                                            <p className='error-msg'>{editErrors.DurationUnit?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Package Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Amount"
                                                {
                                                    ...regEdit('Amount',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                } />
                                            <p className='error-msg'>{editErrors.Amount?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Currency</label>
                                            <select
                                                className="form-select"
                                                {
                                                    ...regEdit('Currency',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Currency</option>
                                                {
                                                    currencyData.map((data, index) => (
                                                        <option key={index} value={data.code}>{data.code}</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{editErrors.Currency?.message}</p>
                                        </div>
                                        <div className="col-xl-12">
                                            <label className="form-label">Package Description</label>
                                            <Controller
                                                name="PackageDescription"
                                                control={editControl}
                                                rules={{ required: 'Required' }}
                                                render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                                )}
                                            />
                                            <p className='error-msg'>{editErrors.PackageDescription?.message}</p>
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
                                                <PenLine size={18} className="mr-2" /> Update Package
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
            </Modal>
            <Modal isOpen={featureModalState} onRequestClose={() => { setFeatureModalState(false); }}
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
                
                <div  className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                    {
                        packageEdit && (
                            <form noValidate onSubmit={submitFeature(submitNewFeature)}>
                                <div  className="d-flex justify-content-between border-bottom">
                                    <h1 className="modal-title fs-16 font-bold" id="addNewTimeSheetLabel">Add Feature To { packageEdit.packageName }</h1>
                                    <button type="button" className="btn-close"  onClick={() => setFeatureModalState(false)}></button>
                                </div>
                                <div className="mt-4">
                                    <div className="row gy-15 text-start">
                                        <div className="col-xl-6">
                                            <label htmlFor="duration" className="form-label">Service Type</label>
                                            <select
                                                className="form-select"
                                                id="duration"
                                                {
                                                    ...regFeat('ServiceTypeId',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                }>
                                                <option value="">Select Service Type</option>
                                                {
                                                    serviceTypes.map((data, index) => (
                                                        <option key={index} value={data.serviceTypeId}>{data.serviceName}</option>
                                                    ))
                                                }
                                            </select>
                                            <p className='error-msg'>{featErrors.ServiceTypeId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Quantity"
                                                {
                                                    ...regFeat('Quantity',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                } />
                                            <p className='error-msg'>{featErrors.Quantity?.message}</p>
                                        </div>
                                        <div className="col-xl-12">
                                            <label className="form-label">Description</label>
                                            <Controller
                                                name="Description"
                                                control={featControl}
                                                rules={{ required: 'Required' }}
                                                render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                                )}
                                            />
                                            <p className='error-msg'>{featErrors.Description?.message}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-end gap-10 mt-20">
                                        <button type="button" className="btn btn-danger" onClick={() => setFeatureModalState(false)}>
                                            <X size={18} className="mr-2" /> Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            <div className="dots" id="query-loader-2">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <span id="query-text-2">
                                                <CheckCheck size={18} className="mr-2" /> Add Feature
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
            </Modal>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Packages</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/Packages">
                                        Packages
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
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-info-transparent text-info">
                                <ShieldCheck size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Active Packages</span>
                                <h2 className="mb-5">{totalActive}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-warning-transparent text-warning">
                                <FolderOpenDot size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Total Subscribers</span>
                                <h2 className="mb-5">{ totalSubscribers }</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6">
                    <div className="card">
                        <div className="card-body d-flex align-center gap-16">
                            <div className="avatar avatar-xl bg-danger-transparent text-danger">
                                <ShieldX size={42}/>
                            </div>
                            <div className="card-content">
                                <span className="d-block fs-16 mb-5">Expired / Inactive</span>
                                <h2 className="mb-5">{totalInactive}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header justify-between">
                            <h4 className="d-flex-items gap-10">Packages</h4>
                            <div className="d-flex flex-wrap gap-15">
                                <button type="button" className="btn btn-success" onClick={() => setAddModalState(true)}>
                                    <Plus size={18} className="mr-2" /> Add New Package
                                </button>
                                <a className="btn btn-info text-white" href="javascript:void(0);">
                                    <FolderOutput /> Export As CSV
                                </a>
                            </div>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive">
                                <table className="table w-100 text-nowrap text-start" id="employeeAttendanceTable">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Duration</th>
                                            <th>Amount</th>
                                            <th>Active</th>
                                            <th>Features</th>
                                            <th>Subscribers</th>
                                            <th>Date Created</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            packages.map((data, index) => {
                                                return (
                                                    <tr key={data.packageId ?? index}>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ data.packageName }</td>
                                                        <td style={{ maxWidth: '200px', textWrap: 'wrap'}}><HtmlRenderer html={data.packageDescription} /></td>
                                                        <td>{ `${data.duration} ${data.durationUnit}`}</td>
                                                        <td>{ `${data.currency} ${data.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2})}` }</td>
                                                        <td>
                                                            <div
                                                                className={`toggle-switch ${data.isActive ? 'on' : ''}`}
                                                                onClick={() => updatePackageStatus(data.packageId, !data.isActive)}
                                                                >
                                                                <div className="toggle-knob" />
                                                            </div>
                                                        </td>
                                                        <td>{`${data.totalFeatures}`}</td>
                                                        <td>{ `${data.totalEmployers}`}</td>
                                                        <td>{(new Date(data.dateCreated)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <Tippy content="Edit Package">
                                                                    <button className="btn-icon btn-warning-light" type="button" onClick={() => { setPackageEdit(data); setEditModalState(true); }}>
                                                                        <a><PenLine /></a>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content="Add Feature">
                                                                    <button className="btn-icon btn-success-light" type="button" onClick={() => { setPackageEdit(data); setFeatureModalState(true); }}>
                                                                        <a><Plus /></a>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content="Preview Feature">
                                                                    <NavLink className="btn-icon btn-info-light" to={`/Packages/${hashIds.encode(data.packageId)}`}>
                                                                        <a><Eye /></a>
                                                                    </NavLink>
                                                                </Tippy>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                {
                                    packages.length === 0 ?
                                        <div className="py-4 whitespace-nowrap w-full">
                                        <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any packages added</span>
                                        </div> : <></>
                                }
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <div className="flex justify-content-center align-items-center mb-1">
                                    <p className="text-black">
                                        Showing { packages.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { packages.length > 0 ? (((pageNumber * limit) - limit) + 1) + (packages.length - 1) : 0 } of { totalPackages } entries
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
                                        (pageNumber * limit) < totalPackages && <a
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
    );
}