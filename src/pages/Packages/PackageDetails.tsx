import {
  CheckCheck,
  ChevronRight,
  PenLine,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import Hashids from "hashids";
import { useEffect, useState } from "react";
import HtmlRenderer from "../../layout/HTMLRenderer";
import Modal from 'react-modal';
import { Controller, useForm } from "react-hook-form";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";
import { toast, ToastContainer } from 'react-toastify';
import RichTextEditor from "../../layout/RichTextEditor";
import { fetchAllServiceTypes } from "../../utils/ServiceTypesRequests";
import { addFeatureToPackage, deletetePackageFeatureById, fetchPackageById, updatePackageDetails, updatePackageFeatureById } from "../../utils/PackageRequests";
import Tippy from "@tippyjs/react";

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

interface ServiceTypes {
    serviceTypeId: string;
    serviceName: string;
}

interface FeatureFormData {
  Description: string;
  ServiceTypeId: string;
  Quantity: number;
}

interface PackageFeatures {
  packageFeatureId: number;
  description: string;
  serviceTypeId: string;
  quantity: number;
  serviceType: string;
}

export default function PackageDetails() {
    const { id } = useParams();
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const [serviceTypes, setServiceTypes] = useState<ServiceTypes[]>([]);
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [packageDetails, setPackageDetails] = useState<PackageData | null>(null);
    const [packageFeatures, setPackageFeatures] = useState<PackageFeatures[]>([]);
    const [packageFeaturesEdit, setPackageFeaturesEdit] = useState<PackageFeatures | null>(null);
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
    const {
        register: regFeatEdit,
        reset: resetFeatEdit,
        handleSubmit: submitFeatureEdit,
        formState: featEditFormState,
        control: featEditControl,
        setValue: featSetValue,
    } = useForm<FeatureFormData>();
    const { errors: featEditErrors } = featEditFormState;
    const [editModalState, setEditModalState] = useState(false);
    const [featureModalState, setFeatureModalState] = useState(false);
    const [featureEditModalState, setFeatureEditModalState] = useState(false);
    const [featureDelModalState, setFeatureDelModalState] = useState(false);

    useEffect(() => {
        if (packageFeaturesEdit) {
            featSetValue('ServiceTypeId', packageFeaturesEdit.serviceTypeId);
            featSetValue('Description', packageFeaturesEdit.description);
            featSetValue('Quantity', packageFeaturesEdit.quantity);
        }
    }, [packageFeaturesEdit, featSetValue])

    useEffect(() => {
        fetchAllServiceTypes()
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
        fetchPackageById(hashedId)
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(data => {
                    console.log(data);
                    setPackageDetails(data.data.package);
                    setPackageFeatures(data.data.features);
                })
            } else {
                res.text()
                .then(data => {
                    console.log(JSON.parse(data));
                })
            }
        })
    }, [hashedId]);

    const refetchPackage = async () => {
        try {
        const res = await fetchPackageById(hashedId);
            if (res.status === 200) {
                const data = await res.json()
                console.log(data);
                setPackageDetails(data.data.package);
                setPackageFeatures(data.data.features);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    useEffect(() => {
        if (packageDetails) {
            setValue('PackageName', packageDetails.packageName);
            setValue('Duration', packageDetails.duration);
            setValue('PackageDescription', packageDetails.packageDescription);
            setValue('Currency', packageDetails.currency);
            setValue('Duration', packageDetails.duration);
            setValue('DurationUnit', packageDetails.durationUnit);
            setValue('Amount', packageDetails.amount);
        }
    }, [packageDetails, setValue]);

    
    
    const submitNewFeature = async (data: FeatureFormData) => {
        if (!featErrors.ServiceTypeId && !featErrors.Description &&
            !featErrors.Quantity && packageDetails
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
            const res = await addFeatureToPackage(packageDetails.packageId, formData);
            handleCreateEmployee(res, loader, text, { toast }, resetFeat)
            .finally(async () => {
                await refetchPackage();
                setFeatureModalState(false);
            });
        }
    }

    const updatePackageFeature = async (data: FeatureFormData) => {
        if (!featEditErrors.ServiceTypeId && !featEditErrors.Description &&
            !featEditErrors.Quantity && packageDetails && packageFeaturesEdit
        ) {
            const loader = document.getElementById('query-loader-3');
            const text = document.getElementById('query-text-3');
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
            const res = await updatePackageFeatureById(packageDetails.packageId, packageFeaturesEdit.packageFeatureId, formData);
            handleCreateEmployee(res, loader, text, { toast }, resetFeatEdit)
            .finally(async () => {
                await refetchPackage();
                setFeatureEditModalState(false);
            });
        }
    }

    const editPackage = async (data: PackageFormData) => {
        if (packageDetails && !editErrors.PackageName && !editErrors.PackageDescription &&
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
            const res = await updatePackageDetails(packageDetails.packageId, formData);
            handleCreateEmployee(res, loader, text, { toast }, resetEdit)
            .finally(async () => {
                await refetchPackage();
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
            await refetchPackage();
        });
    }

    const deletePackageFeature = async (packageFeatureId: number) => {
        const loader = document.getElementById('query-loader-4');
        const text = document.getElementById('query-text-4');
        if (loader) {
            loader.style.display = 'flex';
        }
        if (text) {
            text.style.display = 'none';
        }
        const res = await deletetePackageFeatureById(hashedId, packageFeatureId);
        handleCreateEmployee(res, loader, text, { toast }, null)
        .finally(async () => {
            await refetchPackage();
            setFeatureDelModalState(false);
        });
    }
 
    return (
        <div className="container-fluid">
            <ToastContainer />
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
                        packageDetails && (
                            <form noValidate onSubmit={submitEdit(editPackage)}>
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
                                                <option value="NGN">NGN</option>
                                                <option value="CAD">CAD</option>
                                                <option value="USD">USD</option>
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
                                <div className="modal-footer">
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
                        packageDetails && (
                            <form noValidate onSubmit={submitFeature(submitNewFeature)}>
                                <div  className="d-flex justify-content-between border-bottom">
                                    <h1 className="modal-title fs-16 font-bold" id="addNewTimeSheetLabel">Add Feature To Package</h1>
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
                                <div className="modal-footer">
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
            <Modal isOpen={featureEditModalState} onRequestClose={() => { setFeatureEditModalState(false); }}
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
                        packageDetails && packageFeaturesEdit && (
                            <form noValidate onSubmit={submitFeatureEdit(updatePackageFeature)}>
                                <div  className="d-flex justify-content-between border-bottom">
                                    <h1 className="modal-title fs-16 font-bold" id="addNewTimeSheetLabel">Update Package Feature</h1>
                                    <button type="button" className="btn-close"  onClick={() => setFeatureEditModalState(false)}></button>
                                </div>
                                <div className="mt-4">
                                    <div className="row gy-15 text-start">
                                        <div className="col-xl-6">
                                            <label htmlFor="duration" className="form-label">Service Type</label>
                                            <select
                                                className="form-select"
                                                id="duration"
                                                {
                                                    ...regFeatEdit('ServiceTypeId',
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
                                            <p className='error-msg'>{featEditErrors.ServiceTypeId?.message}</p>
                                        </div>
                                        <div className="col-xl-6">
                                            <label className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Quantity"
                                                {
                                                    ...regFeatEdit('Quantity',
                                                        {
                                                            required: 'Required'
                                                        }
                                                    )
                                                } />
                                            <p className='error-msg'>{featEditErrors.Quantity?.message}</p>
                                        </div>
                                        <div className="col-xl-12">
                                            <label className="form-label">Description</label>
                                            <Controller
                                                name="Description"
                                                control={featEditControl}
                                                rules={{ required: 'Required' }}
                                                render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                                )}
                                            />
                                            <p className='error-msg'>{featEditErrors.Description?.message}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div className="d-flex justify-content-end gap-10 mt-20">
                                        <button type="button" className="btn btn-danger" onClick={() => setFeatureEditModalState(false)}>
                                            <X size={18} className="mr-2" /> Cancel
                                        </button>
                                        <button type="submit" className="btn btn-warning">
                                            <div className="dots" id="query-loader-3">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <span id="query-text-3">
                                                <PenLine size={18} className="mr-2" /> Update Feature
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
            </Modal>
            <Modal isOpen={featureDelModalState} onRequestClose={() => { setFeatureDelModalState(false); }}
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
                        packageDetails && packageFeaturesEdit && (
                            <>
                                <div  className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-16 font-bold" id="addNewTimeSheetLabel">Are you sure you want to delete this feature?</h1>
                                </div>
                                <div className="modal-footer">
                                    <div className="d-flex justify-content-end gap-10 mt-20">
                                        <button type="button" className="btn bg-black text-white" onClick={() => setFeatureDelModalState(false)}>
                                            <X size={18} className="mr-2" /> Cancel
                                        </button>
                                        <button type="submit" className="btn btn-danger" onClick={() => deletePackageFeature(packageFeaturesEdit.packageFeatureId)}>
                                            <div className="dots" id="query-loader-4">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <span id="query-text-4">
                                                <Trash2 size={18} className="mr-2" /> Delete Feature
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </Modal>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Package Details</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/Packages/${id}`}>
                                        Package Details
                                    </NavLink>
                                </li>
                                 <li className="mb-2">
                                    <ChevronRight size={15} />
                                </li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/Packages">
                                        Packages & Contracts
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
                {
                    packageDetails && (
                        <>
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="w-100 d-flex align-items-center justify-content-between">
                                            <h4 className="mb-5">{ packageDetails.packageName }</h4>
                                            <div className="d-flex flex-wrap gap-15 justify-content-end mb-5 align-items-center">
                                                <button type="button" className="btn btn-warning" onClick={() => setEditModalState(true)}>
                                                    <PenLine /> Update Package
                                                </button>
                                                <div
                                                    className={`toggle-switch ${packageDetails.isActive ? 'on' : ''}`}
                                                    onClick={() => updatePackageStatus(packageDetails.packageId, !packageDetails.isActive)}
                                                    >
                                                    <div className="toggle-knob" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body pt-15">
                                        <div className="mb-15 text-start d-flex flex-wrap gap-2 align-items-center">
                                            <h6 className="font-bold">Description: </h6>
                                            <HtmlRenderer html={packageDetails.packageDescription} />
                                        </div>
                                        <div className="mb-15 text-start d-flex flex-wrap gap-2 align-items-center">
                                            <h6 className="font-bold">Cost: </h6>
                                            <p>{ `${packageDetails.currency} ${packageDetails.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2})}` }</p>
                                        </div>
                                    </div>
                                    <div className="card-body pt-15">
                                        <div className="mb-15 text-start">
                                            <div className="mb-5 d-flex justify-content-between align-items-center flex-wrap">
                                                <h5>Package Features</h5>
                                                <button type="button" className="btn btn-success" onClick={() => setFeatureModalState(true)}>
                                                    <Plus /> Add Feature
                                                </button>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table w-100 text-nowrap text-start" id="employeeAttendanceTable">
                                                    <thead>
                                                        <tr>
                                                            <th>S/N</th>
                                                            <th>Service Type</th>
                                                            <th>Description</th>
                                                            <th>Quantity</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            packageFeatures.map((data, index) => {
                                                                return (
                                                                    <tr key={data.packageFeatureId ?? index}>
                                                                        <td>{ index + 1 }</td>
                                                                        <td>{ data.serviceType }</td>
                                                                        <td style={{ maxWidth: '200px', textWrap: 'wrap'}}><HtmlRenderer html={data.description} /></td>
                                                                        <td>{ data.quantity }</td>
                                                                        <td>
                                                                            <div className="d-flex-items gap-10">
                                                                                <Tippy content="Edit Feature">
                                                                                    <button className="btn-icon btn-warning-light" type="button" onClick={() => { setPackageFeaturesEdit(data); setFeatureEditModalState(true); }}>
                                                                                        <a><PenLine /></a>
                                                                                    </button>
                                                                                </Tippy>
                                                                                <Tippy content="Remove Feature">
                                                                                    <button className="btn-icon btn-danger-light" type="button" onClick={() => { setPackageFeaturesEdit(data); setFeatureDelModalState(true);  }}>
                                                                                        <a><Trash2 /></a>
                                                                                    </button>
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
                                                    packageFeatures.length === 0 ?
                                                        <div className="py-4 whitespace-nowrap w-full">
                                                        <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any feature added to this package</span>
                                                        </div> : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                    
            </div>
        </div>
    )
}