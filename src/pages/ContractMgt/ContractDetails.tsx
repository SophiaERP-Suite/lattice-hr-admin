import {
    ArrowDownFromLine,
    ChevronRight,
    PenLine,
    X,
    FileUp,
    FileText,
    ToggleLeft,
    ToggleRight,
    Upload,
    Eye,
    Trash2,
    User,
    Briefcase,
    Shield,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Hashids from "hashids";
import { toast, ToastContainer } from 'react-toastify';
import { getContractById, updateContractById } from "../../utils/ContractRequests";
import HtmlRenderer from "../../layout/HTMLRenderer";
import Modal from 'react-modal';
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { fetchCurrencies } from "../../utils/CurrencyRequests";
import { fetchResponsibilityTypes } from "../../utils/ResponsibilityTypeRequests";
import RichTextEditor from "../../layout/RichTextEditor";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";

interface ResponsibilitiesData {
    typeId: number;
    typeName: string;
    handler: string;
}

interface ContractData {
    contractId: number;
    content: string;
    currency: string;
    amount: number;
    expiryDate: string;
    employer: string;
    employerLogo: string;
    employerMail: string;
    employerPhone: string;
    dateCreated: string;
    signed: boolean;
    contractURL: string | null;
    contractName: string | null;
    responsibilities: ResponsibilitiesData[];
}

interface ResponsibilityTypeFormData {
    TypeId: string;
    Handler: string;
}

interface ContractFormData {
    Content: string;
    Amount: string;
    Currency: string;
    ExpiryDate: string;
    Responsibilities: ResponsibilityTypeFormData[];
}

interface CurrencyData {
    currencyId: number;
    name: string;
    code: string;
    symbol: string;
    isActive: boolean;
    dateCreated: string;
}

interface ResponsibilityTypeData {
    typeId: number;
    isEnabled: boolean;
    typeName: string;
}

type ContentMode = "builder" | "upload";

export default function ContractDetails() {
    const [contractData, setContractData] = useState<ContractData | null>(null);
    const hashIds = new Hashids('LatticeHumanResourceEncode', 10);
    const { id } = useParams();
    const hashedId = id ? Number(hashIds.decode(id)[0]) : 0;
    const [editModalState, setEditModalState] = useState(false);
    const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);
    const [contentMode, setContentMode] = useState<ContentMode>("builder");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        control: contractControl,
        reset: contractReset,
        formState: { errors, isValid },
        register,
        handleSubmit,
        setValue
    } = useForm<ContractFormData>();

    const { fields } = useFieldArray({
        control: contractControl,
        name: 'Responsibilities'
    });

    const [responsibilityTypes, setResponsibilityTypes] = useState<ResponsibilityTypeData[]>([]);

    useEffect(() => {
        getContractById(hashedId)
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => { setContractData(data.data); console.log("Contract data:", data.data) });
                } else {
                    res.text().then(data => console.log(JSON.parse(data)));
                }
            });
    }, [hashedId]);

    const refetchContract = async () => {
        const res = await getContractById(hashedId);
        if (res.status === 200 || res.status === 201) {
            const data = await res.json();
            setContractData(data.data);
        } else {
            const data = await res.text();
            console.log(JSON.parse(data));
        }
    };

    useEffect(() => {
        fetchCurrencies()
            .then(res => {
                if (res.status === 200) res.json().then(data => setCurrencyData(data.data));
                else res.text().then(data => console.log(JSON.parse(data)));
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetchResponsibilityTypes()
            .then(res => {
                if (res.status === 200) res.json().then(data => setResponsibilityTypes(data.data));
                else res.text().then(data => console.log(JSON.parse(data)));
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (contractData) {
            setValue('Content', contractData.content);
            setValue('Amount', `${contractData.amount}`);
            setValue('Currency', contractData.currency);
            const formatted = (new Date(contractData.expiryDate)).toISOString().split('T')[0];
            setValue('ExpiryDate', formatted);
            if (responsibilityTypes.length > 0) {
                const formattedRes = responsibilityTypes.map(type => {
                    const match = contractData.responsibilities.find(r => r.typeId === type.typeId);
                    return { TypeId: type.typeId, Handler: match ? match.handler : "NIL", TypeName: type.typeName };
                });
                setValue('Responsibilities', formattedRes as any);
            }
        }
    }, [setValue, contractData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF, DOC, or DOCX files are allowed");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB");
            return;
        }

        setUploadedFile(file);
        if (file.type === 'application/pdf') {
            setUploadedFilePreview(URL.createObjectURL(file));
        } else {
            setUploadedFilePreview(null);
        }
    };

    const clearUploadedFile = () => {
        setUploadedFile(null);
        setUploadedFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleModeSwitch = (mode: ContentMode) => {
        setContentMode(mode);
        if (mode === "builder") clearUploadedFile();
    };

    const downloadReceipt = async () => {
        const loader = document.getElementById('query-loader');
        const text = document.getElementById('query-text');
        if (loader) loader.style.display = 'flex';
        if (text) text.style.display = 'none';

        try {
            const element = document.getElementById('contractDetails');
            if (!element) {
                if (loader) loader.style.display = 'none';
                if (text) text.style.display = 'flex';
                return;
            }
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [794, 1123] });
            const imgWidth = 794;
            const pageHeight = 1123;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('contract.pdf');
            toast.success('Your file is being downloaded');
        } catch (err) {
            toast.warning("Download Failed");
            console.log(err);
        }
        if (loader) loader.style.display = 'none';
        if (text) text.style.display = 'flex';
    };

    const updateContractDetails = async (data: ContractFormData) => {
        if (contentMode === "upload") {
            if (!uploadedFile) { toast.error("Please upload a document"); return; }
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) loader.style.display = 'flex';
            if (text) text.style.display = 'none';

            try {
                const formData = new FormData();
                formData.append("UploadedContract", uploadedFile);
                formData.append("Amount", data.Amount);
                formData.append("Currency", data.Currency);
                formData.append("ExpiryDate", data.ExpiryDate);
                const responsibilities = data.Responsibilities.filter(r => r.Handler !== 'NIL');
                formData.append("Responsibilities", JSON.stringify(responsibilities));

                const res = await updateContractById(hashedId, formData);
                handleCreateEmployee(res, null, null, { toast }, contractReset)
                    .finally(() => { refetchContract(); setEditModalState(false); });
            } finally {
                if (loader) loader.style.display = 'none';
                if (text) text.style.display = 'flex';
            }
            return;
        }

        if (isValid && contractData) {
            const loader = document.getElementById('query-loader-1');
            const text = document.getElementById('query-text-1');
            if (loader) loader.style.display = 'flex';
            if (text) text.style.display = 'none';
            const responsibilities = data.Responsibilities.filter(r => r.Handler !== 'NIL');
            const res = await updateContractById(hashedId, { ...data, Responsibilities: responsibilities });
            handleCreateEmployee(res, null, null, { toast }, contractReset)
                .finally(() => { refetchContract(); setEditModalState(false); });
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (type: string) => {
        if (type === 'application/pdf') return '📄';
        return '📝';
    };

    const getHandlerIcon = (handler: string) => {
        switch (handler.toLowerCase()) {
            case 'admin': return <Shield size={14} />;
            case 'client': return <User size={14} />;
            default: return <Briefcase size={14} />;
        }
    };

    const getHandlerColor = (handler: string) => {
        switch (handler.toLowerCase()) {
            case 'admin': return { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' };
            case 'client': return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
            default: return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
        }
    };

    const isPdfUrl = (url: string) => url.toLowerCase().endsWith('.pdf');
    const isDocUrl = (url: string) => url.toLowerCase().endsWith('.doc') || url.toLowerCase().endsWith('.docx');

    // Determine what to show: if there's an uploaded doc, show it; otherwise show template
    const showDocument = contractData?.contractURL ? true : false;

    return (
        <div className="container-fluid">
            <ToastContainer />

            {/* Edit Modal */}
            <Modal
                isOpen={editModalState}
                onRequestClose={() => setEditModalState(false)}
                style={{
                    content: {
                        width: '680px',
                        maxWidth: '95vw',
                        height: 'fit-content',
                        maxHeight: '90vh',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        padding: 0,
                        border: 'none',
                        overflow: 'hidden',
                    },
                    overlay: { backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(2px)', zIndex: 1000 }
                }}
            >
                {/* Modal Header */}
                <div className="bg-info" style={{
                    padding: '20px 24px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <PenLine size={16} color="#fff" />
                        </div>
                        <div>
                            <h5 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#fff' }}>Update Contract</h5>
                            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>Edit contract details or upload a document</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditModalState(false)}
                        style={{
                            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
                            width: '32px', height: '32px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content Mode Toggle */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                        Contract Content Source
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => handleModeSwitch("builder")}
                            style={{
                                flex: 1, padding: '10px 16px',
                                borderRadius: '4px',
                                backgroundColor: contentMode === 'builder' ? '#eff6ff' : '#fff',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s',
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '6px',
                                backgroundColor: contentMode === 'builder' ? '#1e3a5f' : '#f1f5f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                {contentMode === 'builder'
                                    ? <ToggleRight size={16} color="#fff" />
                                    : <ToggleLeft size={16} color="#94a3b8" />}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: contentMode === 'builder' ? '#1e293b' : '#64748b' }}>
                                    Template Builder
                                </p>
                                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Use the rich text editor</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleModeSwitch("upload")}
                            style={{
                                flex: 1, padding: '10px 16px',
                                border: `2px solid ${contentMode === 'upload' ? '#1e3a5f' : '#e2e8f0'}`,
                                borderRadius: '8px',
                                backgroundColor: contentMode === 'upload' ? '#eff6ff' : '#fff',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s',
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '6px',
                                backgroundColor: contentMode === 'upload' ? '#1e3a5f' : '#f1f5f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                {contentMode === 'upload'
                                    ? <FileUp size={16} color="#fff" />
                                    : <FileUp size={16} color="#94a3b8" />}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: contentMode === 'upload' ? '#1e293b' : '#64748b' }}>
                                    Upload Document
                                </p>
                                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>PDF, DOC, or DOCX file</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 220px)' }}>
                    <form noValidate onSubmit={handleSubmit(updateContractDetails)}>
                        <div style={{ padding: '20px 24px' }}>
                            <div className="row gy-15">

                                {contentMode === "builder" ? (
                                    <div className="col-xl-12">
                                        <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>
                                            Contract Content
                                        </label>
                                        <Controller
                                            name="Content"
                                            control={contractControl}
                                            rules={{ required: 'Required' }}
                                            render={({ field }) => (
                                                <RichTextEditor value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <p className='error-msg'>{errors.Content?.message}</p>
                                    </div>
                                ) : (
                                    <div className="col-xl-12">
                                        <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>
                                            Upload Contract Document
                                        </label>

                                        {!uploadedFile ? (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{
                                                    border: '2px dashed #cbd5e1', borderRadius: '10px',
                                                    padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
                                                    backgroundColor: '#f8fafc', transition: 'border-color 0.15s, background 0.15s',
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#1e3a5f';
                                                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#eff6ff';
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#cbd5e1';
                                                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f8fafc';
                                                }}
                                            >
                                                <div style={{
                                                    width: '52px', height: '52px', borderRadius: '12px',
                                                    backgroundColor: '#e2e8f0', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                                                }}>
                                                    <Upload size={22} color="#64748b" />
                                                </div>
                                                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#000' }}>
                                                    Click to browse files
                                                </p>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                                                    PDF, DOC, DOCX &nbsp;·&nbsp; Max 10MB
                                                </p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                border: '1.5px solid #bfdbfe', borderRadius: '10px',
                                                backgroundColor: '#eff6ff', overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                                                    borderBottom: uploadedFilePreview ? '1px solid #bfdbfe' : 'none',
                                                }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '8px',
                                                        backgroundColor: '#dbeafe', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                                                    }}>
                                                        {getFileIcon(uploadedFile.type)}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {uploadedFile.name}
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                                                            {formatFileSize(uploadedFile.size)} &nbsp;·&nbsp; {uploadedFile.type === 'application/pdf' ? 'PDF' : 'Word Document'}
                                                        </p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        {uploadedFilePreview && (
                                                            <a
                                                                href={uploadedFilePreview}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={{
                                                                    width: '32px', height: '32px', borderRadius: '6px',
                                                                    backgroundColor: '#1e3a5f', border: 'none',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    cursor: 'pointer', textDecoration: 'none',
                                                                }}
                                                                title="Preview"
                                                            >
                                                                <Eye size={14} color="#fff" />
                                                            </a>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={clearUploadedFile}
                                                            style={{
                                                                width: '32px', height: '32px', borderRadius: '6px',
                                                                backgroundColor: '#fee2e2', border: 'none',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                cursor: 'pointer',
                                                            }}
                                                            title="Remove file"
                                                        >
                                                            <Trash2 size={14} color="#ef4444" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {uploadedFilePreview && (
                                                    <div style={{ height: '280px' }}>
                                                        <iframe
                                                            src={uploadedFilePreview}
                                                            style={{ width: '100%', height: '100%', border: 'none' }}
                                                            title="PDF Preview"
                                                        />
                                                    </div>
                                                )}

                                                <div style={{ padding: '10px 16px', borderTop: '1px solid #bfdbfe' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        style={{
                                                            fontSize: '12px', fontWeight: 600, color: '#1e3a5f',
                                                            background: 'none', border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
                                                        }}
                                                    >
                                                        <FileUp size={13} /> Replace file
                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {fields.map((field, index) => (
                                    <div className="col-xl-12 text-start" key={index}>
                                        <label htmlFor="type" className="form-label" style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>
                                            {(field as any).TypeName}
                                        </label>
                                        <input type="hidden" {...register(`Responsibilities.${index}.TypeId`)} />
                                        <select className="form-select" id="jobSector"
                                            {...register(`Responsibilities.${index}.Handler`, { required: 'Required' })}>
                                            <option value="">Select Handler</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Client">Client</option>
                                            <option value="NIL">Not In Contract</option>
                                        </select>
                                        <p className='error-msg'>{errors.Responsibilities?.[index]?.Handler?.message}</p>
                                    </div>
                                ))}

                                <div className="col-xl-6">
                                    <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>Package Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Amount"
                                        {
                                            ...register('Amount',
                                                {
                                                    required: 'Required',
                                                    validate: (value) => (value && Number(value) < 0) ? 'Cannot be less than 0' : true
                                                }
                                            )
                                        } />
                                    <p className='error-msg'>{errors.Amount?.message}</p>
                                </div>
                                <div className="col-xl-6">
                                    <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>Currency</label>
                                    <select className="form-select" {...register('Currency', { required: 'Required' })}>
                                        <option value="">Select Currency</option>
                                        {currencyData.map((data, index) => (
                                            <option key={index} value={data.code}>{data.code}</option>
                                        ))}
                                    </select>
                                    <p className='error-msg'>{errors.Currency?.message}</p>
                                </div>

                                <div className="col-xl-12">
                                    <label className="form-label" style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>Expiry Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register('ExpiryDate', { required: 'Required' })}
                                    />
                                    <p className='error-msg'>{errors.ExpiryDate?.message}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            padding: '14px 24px', borderTop: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px',
                        }}>
                            <button
                                type="button"
                                className="btn btn-danger"
                                style={{ borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={() => setEditModalState(false)}
                            >
                                <X size={15} /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-warning"
                                style={{ borderRadius: '8px', fontWeight: 600, minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                                <div className="dots" id="query-loader-1" style={{ display: 'none' }}>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                                <span id="query-text-1" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <PenLine size={15} /> Update Contract
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Page */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <div>
                            <h1 className="page-title fs-18 lh-1 mb-1">Contract Details</h1>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 0 }}>
                                View, edit, and download your contract document
                            </p>
                        </div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to={`/Contracts/${id}`}>Contract Details</NavLink>
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/Contracts">Contracts</NavLink>
                                </li>
                                <li className="mb-2"><ChevronRight size={15} /></li>
                                <li className="breadcrumb-item">
                                    <NavLink to="/Dashboard">Dashboard</NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="col-12 d-flex justify-content-end mb-3 gap-4 flex-wrap align-items-center">
                    {!contractData?.signed && (
                        <button
                            className="btn btn-warning d-flex align-items-center gap-2"
                            style={{ fontWeight: 600, borderRadius: '8px', padding: '9px 20px', border: 'none', boxShadow: '0 2px 8px rgba(245,158,11,0.25)' }}
                            onClick={() => setEditModalState(true)}
                        >
                            <PenLine size={16} /> Update Contract
                        </button>
                    )}
                    {/* Download button: only shown in template view (when no uploaded doc exists) */}
                    {!showDocument && (
                        <button
                            className="btn btn-success d-flex align-items-center gap-2"
                            style={{ fontWeight: 600, borderRadius: '8px', padding: '9px 20px', border: 'none', boxShadow: '0 2px 8px rgba(16,185,129,0.25)', minWidth: '150px', justifyContent: 'center' }}
                            onClick={downloadReceipt}
                        >
                            <div className="dots" id="query-loader" style={{ display: 'none' }}>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                            <span id="query-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ArrowDownFromLine size={16} /> Download PDF
                            </span>
                        </button>
                    )}
                </div>

                {/* Contract Preview Area - Show document if exists, otherwise show template */}
                {contractData && (
                    <div className="col-xl-12 d-flex justify-content-center" style={{ overflowX: 'auto' }}>
                        {/* Show uploaded document if it exists */}
                        {showDocument && contractData.contractURL ? (
                            <div style={{ width: '794px', margin: '0 auto' }}>
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                                    overflow: 'hidden',
                                }}>
                                    <div className="bg-info" style={{
                                        padding: '14px 20px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '8px',
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <FileText size={15} color="#fff" />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                                                    Uploaded Contract Document
                                                </p>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#fff' }}>
                                                    {isPdfUrl(contractData.contractURL) ? 'PDF Document' : 'Word Document'}
                                                    &nbsp;·&nbsp; Contract #{hashIds.encode(contractData.contractId)}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={contractData.contractURL}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '7px',
                                                padding: '8px 16px', borderRadius: '8px',
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#fff', fontSize: '12px', fontWeight: 600,
                                                textDecoration: 'none', transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.25)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.15)'}
                                        >
                                            <Eye size={13} /> Open in New Tab
                                        </a>
                                    </div>

                                    {isPdfUrl(contractData.contractURL) ? (
                                        <iframe
                                            src={contractData.contractURL}
                                            style={{ width: '100%', height: '900px', border: 'none', display: 'block' }}
                                            title="Contract Document"
                                        />
                                    ) : (
                                        <div style={{
                                            padding: '60px 40px', textAlign: 'center',
                                            backgroundColor: '#f8fafc',
                                        }}>
                                            <div style={{
                                                width: '72px', height: '72px', borderRadius: '16px',
                                                backgroundColor: '#dbeafe', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 20px', fontSize: '32px',
                                            }}>
                                                📝
                                            </div>
                                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#000', margin: '0 0 8px' }}>
                                                Word Document
                                            </h4>
                                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px', maxWidth: '340px', marginLeft: 'auto', marginRight: 'auto' }}>
                                                Word documents cannot be previewed in the browser. Use the button below to open or download the file.
                                            </p>
                                            <a
                                                href={contractData.contractURL}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                    padding: '10px 24px', borderRadius: '8px',
                                                    backgroundColor: '#1e3a5f', color: '#fff',
                                                    fontSize: '13px', fontWeight: 600,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <ArrowDownFromLine size={15} /> Open / Download Document
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Show template view when no uploaded document exists */
                            <div id="contractDetails" style={{ width: '794px', margin: '0 auto', backgroundColor: '#f0f2f5', padding: '24px 0 32px' }}>
                                <div
                                    className="pdf-page"
                                    style={{
                                        width: '794px', minHeight: '1123px', backgroundColor: '#fff',
                                        marginBottom: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                                        boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
                                        pageBreakAfter: 'always', fontFamily: "'Segoe UI', system-ui, sans-serif",
                                    }}
                                >
                                    <div style={{
                                        backgroundImage: "url('/one/lhr_adm/src/assets/images/latty_mini.png')",
                                        position: 'absolute', inset: 0,
                                        backgroundPosition: 'center', backgroundRepeat: 'repeat',
                                        backgroundSize: 'contain', opacity: 0.035, pointerEvents: 'none', zIndex: 0,
                                    }} />

                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div className="bg-info" style={{
                                            padding: '28px 40px 24px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{
                                                    width: '52px', height: '52px', borderRadius: '10px',
                                                    backgroundColor: 'rgba(255,255,255,0.12)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    overflow: 'hidden', flexShrink: 0,
                                                }}>
                                                    <img src={contractData.employerLogo ? contractData.employerLogo : 'https://img.icons8.com/fluency/60/image--v1.png'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="logo" />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Employer</p>
                                                    <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>{contractData.employer}</h1>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                <img src="/one/lhr_adm/src/assets/images/latty_mini.png" style={{ height: '28px', width: 'auto', opacity: 0.9 }} alt="lattice" />
                                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Service Agreement</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            {[
                                                { label: 'Contract No.', value: hashIds.encode(contractData.contractId) },
                                                { label: 'Contract Cost', value: `${contractData.currency} ${contractData.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                                                { label: 'Date Created', value: new Date(contractData.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                                                { label: 'Expiry Date', value: new Date(contractData.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                                                { label: 'Status', value: contractData.signed ? 'Signed' : 'Awaiting Signature', highlight: contractData.signed ? '#10b981' : '#f59e0b', highlightBg: contractData.signed ? '#ecfdf5' : '#fffbeb' },
                                            ].map(({ label, value, highlight, highlightBg }: any) => (
                                                <div key={label} style={{ padding: '14px 16px', borderRight: '1px solid #e2e8f0' }}>
                                                    <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</p>
                                                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: highlight || '#1e293b', backgroundColor: highlightBg || 'transparent', padding: highlightBg ? '2px 7px' : 0, borderRadius: highlightBg ? '4px' : 0, display: 'inline-block' }}>
                                                        {value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ padding: '32px 40px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FileText size={15} color="#fff" />
                                                </div>
                                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#000' }}>Contract Details</h4>
                                            </div>
                                            <div style={{ fontSize: '13.5px', lineHeight: '1.75', color: '#374151' }}>
                                                <HtmlRenderer html={contractData.content} />
                                            </div>

                                            <div style={{ marginTop: '32px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Briefcase size={13} color="#fff" />
                                                        </div>
                                                        <h6 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            Contract Responsibilities
                                                        </h6>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Clock size={11} color="#94a3b8" />
                                                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                                                            {contractData.responsibilities.length} responsibility(ies)
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                                                    {contractData.responsibilities.map((data, index) => {
                                                        const colors = getHandlerColor(data.handler);
                                                        return (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
                                                                    borderRadius: '10px', overflow: 'hidden',
                                                                    transition: 'all 0.2s ease', cursor: 'pointer',
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                                                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#cbd5e1';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                                                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                                                                }}
                                                            >
                                                                <div style={{
                                                                    padding: '12px 14px', backgroundColor: '#f8fafc',
                                                                    borderBottom: '1px solid #e2e8f0', display: 'flex',
                                                                    alignItems: 'center', justifyContent: 'space-between',
                                                                }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <div style={{
                                                                            width: '24px', height: '24px', borderRadius: '6px',
                                                                            backgroundColor: '#e2e8f0', display: 'flex',
                                                                            alignItems: 'center', justifyContent: 'center',
                                                                            fontSize: '11px', fontWeight: 700, color: '#64748b',
                                                                        }}>
                                                                            {String(index + 1).padStart(2, '0')}
                                                                        </div>
                                                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                                                                            Responsibility #{index + 1}
                                                                        </span>
                                                                    </div>
                                                                    {data.handler !== 'NIL' && (
                                                                        <div style={{
                                                                            display: 'flex', alignItems: 'center', gap: '4px',
                                                                            padding: '2px 8px', borderRadius: '12px',
                                                                            backgroundColor: colors.bg, border: `1px solid ${colors.border}`,
                                                                        }}>
                                                                            {getHandlerIcon(data.handler)}
                                                                            <span style={{ fontSize: '10px', fontWeight: 600, color: colors.text }}>
                                                                                {data.handler}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div style={{ padding: '14px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: data.handler === 'NIL' ? 0 : '12px' }}>
                                                                        <div style={{ flex: 1 }}>
                                                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#000', lineHeight: '1.4' }}>
                                                                                {data.typeName}
                                                                            </p>
                                                                            {data.handler !== 'NIL' && (
                                                                                <p style={{ margin: '6px 0 0', fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                    <CheckCircle size={10} />
                                                                                    Assigned to {data.handler.toLowerCase()}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {data.handler === 'NIL' && (
                                                                        <div style={{
                                                                            marginTop: '8px', padding: '6px 10px',
                                                                            backgroundColor: '#fef3c7', borderRadius: '6px',
                                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                                        }}>
                                                                            <AlertCircle size={12} color="#d97706" />
                                                                            <span style={{ fontSize: '10px', color: '#92400e', fontWeight: 500 }}>
                                                                                Not included in current contract
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div style={{
                                                    marginTop: '20px', padding: '14px 16px',
                                                    backgroundColor: '#f0fdf4', borderRadius: '8px',
                                                    border: '1px solid #bbf7d0',
                                                    //  display: 'flex',
                                                    display: 'none',
                                                    alignItems: 'center', justifyContent: 'space-between',
                                                    flexWrap: 'wrap', gap: '12px',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <CheckCircle size={14} color="#16a34a" />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#166534' }}>Active Responsibilities</p>
                                                            <p style={{ margin: 0, fontSize: '10px', color: '#15803d' }}>
                                                                {contractData.responsibilities.filter(r => r.handler !== 'NIL').length} out of {contractData.responsibilities.length} responsibilities assigned
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        {['Admin', 'Client'].map(role => {
                                                            const count = contractData.responsibilities.filter(r => r.handler === role).length;
                                                            if (count === 0) return null;
                                                            const colors = getHandlerColor(role);
                                                            return (
                                                                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <div style={{
                                                                        padding: '2px 8px', borderRadius: '12px',
                                                                        backgroundColor: colors.bg, border: `1px solid ${colors.border}`,
                                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                                    }}>
                                                                        {getHandlerIcon(role)}
                                                                        <span style={{ fontSize: '10px', fontWeight: 600, color: colors.text }}>
                                                                            {role}: {count}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '10px', color: '#fff' }}>Generated via Lattice HR &nbsp;·&nbsp; Confidential Document</p>
                                            <p style={{ margin: 0, fontSize: '10px', color: '#fff' }}>Contract #{hashIds.encode(contractData.contractId)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}