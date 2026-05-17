import { CheckCheck, ChevronRight, PenLine, Trash2, X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { fetchCountries } from "../../utils/LocationRequests";
import type { CountryData } from "../../types/location";
import { CreateTax, DeleteTaxRate, GetAllTaxRates, UpdateTaxRate } from "../../api/TaxApi";

interface TaxData {
    taxId?: number;
    countryId: number;
    countryName?: string;
    rate: number;
    dateCreated?: string;
}

interface TaxFormData {
    countryId: number;
    taxRate: number;
}

export default function TaxMgt() {
    const { register, formState, handleSubmit, reset } = useForm<TaxData>();
    const { errors } = formState;

    const {
        register: editRegister,
        formState: editFormState,
        handleSubmit: submitEdit,
        reset: resetEdit,
        setValue
    } = useForm<TaxFormData>();
    const { errors: editErrors } = editFormState;

    const [taxData, setTaxData] = useState<TaxData[]>([]);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [selectedTax, setSelectedTax] = useState<TaxData | null>(null);
    const [addModalState, setAddModalState] = useState(false);
    const [editModalState, setEditModalState] = useState(false);
    const [delModalState, setDelModalState] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        fetchAllTaxRatesData();
    }, []);

    const fetchAllTaxRatesData = async () => {
        try {
            setLoading(true);
            const res = await GetAllTaxRates();

            if (res.status === 200) {
                const data = await res.json();
                console.log("res = ", data);
                setTaxData(data);
            } else {
                const errorData = await res.text();
                console.log(JSON.parse(errorData));
                toast.error("Failed to fetch tax rates");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while fetching tax rates");
        } finally {
            setLoading(false);
            closeModals();
        }
    };

    useEffect(() => {
        fetchCountries()
            .then(res => {
                if (res.status === 200) res.json().then(data => setCountries(data.data));
            })
            .catch(err => console.log(err));
    }, []);

    const submitNewTaxRate = async (data: TaxData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('CountryId', data.countryId.toString());
            formData.append('Rate', data.rate.toString());

            const res = await CreateTax(formData);

            console.log("res = ", res);
            if (res.status === 200 || res.status === 201) {
                toast.success("Tax rate added successfully");
                reset();
                setAddModalState(false);
                await fetchAllTaxRatesData();
            } else {
                const errorData = await res.text();
                toast.error(JSON.parse(errorData).message || "Failed to add tax rate");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while adding tax rate");
        } finally {
            setLoading(false);
            closeModals()
        }
    };

    const editTaxRate = async (data: TaxFormData) => {
        if (!selectedTax?.taxId) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('CountryId', data.countryId.toString());
            formData.append('Rate', data.taxRate.toString());
            const res = await UpdateTaxRate(selectedTax.taxId, formData);
            console.log("p res = ", res);
            if (res.status === 204) {
                toast.success("Tax rate updated successfully");
                resetEdit();
                setEditModalState(false);
                setSelectedTax(null);
                await fetchAllTaxRatesData();
            } else {
                const errorData = await res.text();
                toast.error(JSON.parse(errorData).message || "Failed to update tax rate");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating tax rate");
        } finally {
            setLoading(false);
        }
    };

    const deleteTaxRateHandler = async (taxId: number) => {
        try {
            setLoading(true);
            const res = await DeleteTaxRate(taxId);
            if (res.status === 204) {
                toast.success("Tax rate deleted successfully");
                setDelModalState(false);
                setSelectedTax(null);
                await fetchAllTaxRatesData();
            } else {
                const errorData = await res.text();
                toast.error(JSON.parse(errorData).message || "Failed to delete tax rate");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while deleting tax rate");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (tax: TaxData) => {
        setSelectedTax(tax);
        setValue('countryId', tax.countryId);
        setValue('taxRate', tax.rate);
        setEditModalState(true);
    };

    const openDeleteModal = (tax: TaxData) => {
        setSelectedTax(tax);
        setDelModalState(true);
    };

    const closeModals = () => {
        setAddModalState(false);
        setEditModalState(false);
        setDelModalState(false);
        setSelectedTax(null);
        reset();
        resetEdit();
    }

    return (
        <div className="container-fluid">
            <ToastContainer />

            {/* Add Tax Rate Modal */}
            <Modal
                isOpen={addModalState}
                onRequestClose={() => { setAddModalState(false); reset(); }}
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
                    <form noValidate onSubmit={handleSubmit(submitNewTaxRate)}>
                        <div className="d-flex justify-content-between border-bottom">
                            <h1 className="modal-title fs-16" id="addNewTaxRateLabel">Add New Tax Rate</h1>
                            <button type="button" className="btn-close" onClick={() => setAddModalState(false)}></button>
                        </div>
                        <div className="mt-4">
                            <div className="row gy-15 text-start">
                                <div className="col-xl-12">
                                    <label className="form-label">Country</label>
                                    <select
                                        className="form-control"
                                        {...register('countryId', {
                                            required: 'Country is required',
                                            valueAsNumber: true
                                        })}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(country => (
                                            <option key={country.countryId} value={country.countryId}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className='error-msg'>{errors.countryId?.message}</p>
                                </div>
                                <div className="col-xl-12">
                                    <label className="form-label">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        placeholder="Enter tax rate percentage"
                                        {...register('rate', {
                                            required: 'Tax rate is required',
                                            min: { value: 0, message: 'Tax rate must be at least 0' },
                                            max: { value: 100, message: 'Tax rate cannot exceed 100' }
                                        })}
                                    />
                                    <p className='error-msg'>{errors.rate?.message}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex justify-content-end gap-10 mt-20">
                                <button type="button" className="btn btn-danger" onClick={() => setAddModalState(false)}>
                                    <X size={18} className="mr-2" /> Cancel
                                </button>
                                <button type="submit" className="btn btn-success" disabled={loading}>
                                    {loading ? (
                                        <div className="dots" id="query-loader">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                    ) : (
                                        <span id="query-text">
                                            <CheckCheck size={18} className="mr-2" /> Add Tax Rate
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Tax Rate Modal */}
            <Modal
                isOpen={editModalState}
                onRequestClose={() => { setEditModalState(false); resetEdit(); setSelectedTax(null); }}
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
                {selectedTax && (
                    <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '70vh' }}>
                        <form noValidate onSubmit={submitEdit(editTaxRate)}>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16" id="editTaxRateLabel">Update Tax Rate</h1>
                                <button type="button" className="btn-close" onClick={() => setEditModalState(false)}></button>
                            </div>
                            <div className="mt-4">
                                <div className="row gy-15 text-start">
                                    <div className="col-xl-12">
                                        <label className="form-label">Country</label>
                                        <select
                                            className="form-control"
                                            {...editRegister('countryId', {
                                                required: 'Country is required',
                                                valueAsNumber: true
                                            })}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country.countryId} value={country.countryId}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className='error-msg'>{editErrors.countryId?.message}</p>
                                    </div>
                                    <div className="col-xl-12">
                                        <label className="form-label">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            placeholder="Enter tax rate percentage"
                                            {...editRegister('taxRate', {
                                                required: 'Tax rate is required',
                                                min: { value: 0, message: 'Tax rate must be at least 0' },
                                                max: { value: 100, message: 'Tax rate cannot exceed 100' }
                                            })}
                                        />
                                        <p className='error-msg'>{editErrors.taxRate?.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end gap-10 mt-20">
                                    <button type="button" className="btn btn-danger" onClick={() => setEditModalState(false)}>
                                        <X size={18} className="mr-2" /> Cancel
                                    </button>
                                    <button type="submit" className="btn btn-warning" disabled={loading}>
                                        {loading ? (
                                            <div className="dots" id="query-loader-1">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        ) : (
                                            <span id="query-text-1">
                                                <PenLine size={18} className="mr-2" /> Update Tax Rate
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>

            {/* Delete Tax Rate Modal */}
            <Modal
                isOpen={delModalState}
                onRequestClose={() => { setDelModalState(false); setSelectedTax(null); }}
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
                {selectedTax && (
                    <div className="h-fit w-100 overflow-auto" style={{ maxHeight: '80vh' }}>
                        <div>
                            <div>
                                <div className="mb-20 mt-5 border-bottom">
                                    <h5 className="modal-title fs-16">Delete Tax Rate</h5>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between border-bottom">
                                <h1 className="modal-title fs-16 text-wrap">
                                    Are you sure you want to delete the tax rate for {selectedTax.countryName}?
                                </h1>
                            </div>
                            <div>
                                <div className="d-flex justify-content-end gap-10 mt-20">
                                    <button type="button" className="btn bg-black text-white" onClick={() => setDelModalState(false)}>
                                        <X size={18} className="mr-2" /> Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() => deleteTaxRateHandler(selectedTax.taxId!)}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="dots" id="query-loader-2">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        ) : (
                                            <span id="query-text-2">
                                                <Trash2 size={18} className="mr-2" /> Delete Tax Rate
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Main Content */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Tax Management</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/ControlPanel/TaxMgt">
                                        Tax Management
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
                            <h4 className="d-flex-items gap-10">
                                Tax Rates
                                <span className="badge bg-label-success">{taxData.length}</span>
                            </h4>
                            <button
                                className="btn btn-success"
                                onClick={() => setAddModalState(true)}
                            >
                                <Plus size={18} />  Add New Tax Rate
                            </button>
                        </div>
                        <div className="card-body pt-15">
                            <div className="table-responsive">
                                <table id="taxDataTable" className="table text-nowrap text-start w-100">
                                    <thead>
                                        <tr>
                                            <th scope="col">S/N</th>
                                            <th scope="col">Country</th>
                                            <th scope="col">Income Tax (%)</th>
                                            <th scope="col">Date Created</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {taxData.map((data, index) => (
                                            <tr key={data.taxId || index}>
                                                <td style={{ width: '8%' }}>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex-items gap-10">
                                                        <h6 className="cursor-pointer">{data.countryName}</h6>
                                                    </div>
                                                </td>
                                                <td>{data.rate}%</td>
                                                <td>
                                                    {data.dateCreated
                                                        ? new Date(data.dateCreated).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "-"}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-10">
                                                        <button
                                                            className="btn btn-sm btn-warning"
                                                            onClick={() => openEditModal(data)}
                                                        >
                                                            <PenLine size={16} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => openDeleteModal(data)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {taxData.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    No tax rates found. Click "Add New Tax Rate" to create one.
                                                </td>
                                            </tr>
                                        )}
                                        {loading && (
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    Loading...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}