import { CheckCheck, Eye, Plus, X } from "lucide-react";
import Modal from "react-modal";
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from "../utils/LocationRequests";
import { handleCreateEmployee } from "../utils/EmployeeResponse";
import { addNewWorker } from "../utils/WorkerRequests";

interface WorkerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    designation: string;
    email: string;
    phone: string;
    profilePhoto: string;
    joinDate: string;
    countryId: string;
    country: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    dateCreated: string;
    userId: number;
    workerId: number;
    employer: string;
    employerId: number;
    employerLogo: string;
}

interface WorkerRegister {
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    Address: string;
    CountryId: string;
    StateId: string;
    CityId: string;
    PostCode: string;
    Password: string;
    Gender: string;
    ProfilePhoto: string;
    DateOfBirth: string;
    EmployerId: string;
    Designation: string;
    JoinDate: string;
    ConfirmPassword: string;
}

interface CountryData { countryId: number; name: string; code: string; }
interface StateData { stateId: number; name: string; code: string; }
interface CityData { cityId: number; name: string; code: string; }

interface Props {
    workers: WorkerData[];
    totalWorkers: number;
    pageNumber: number;
    pageLimit: number;
    hashedId: number;
    searchValue: string;
    onSearchChange: (val: string) => void;
    onPageChange: (page: number) => void;
    onRefetch: () => void;
}

const modalStyles = {
    content: {
        width: "fit-content",
        height: "fit-content",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgb(255 255 255)",
        borderRadius: "0.5rem",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
    overlay: { backgroundColor: "rgba(255, 255, 255, 0.7)" },
};

export default function WorkersTab({
    workers, totalWorkers, pageNumber, pageLimit,
    hashedId, searchValue, onSearchChange, onPageChange, onRefetch,
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);

    const {
        register, formState: { errors, isValid },
        handleSubmit, reset, control, setValue,
    } = useForm<WorkerRegister>();

    const selectedCountry = useWatch({ control, name: "CountryId" });
    const selectedState = useWatch({ control, name: "StateId" });
    const workerPassword = useWatch({ control, name: "Password" });

    useEffect(() => {
        fetchCountries().then(res => {
            if (res.status === 200) res.json().then(d => setCountries(d.data));
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedCountry) { setStates([]); setValue("StateId", ""); setValue("CityId", ""); return; }
        fetchStatesByCountryId(Number(selectedCountry)).then(res => {
            if (res.status === 200) res.json().then(d => setStates(d.data));
        }).catch(console.error);
    }, [selectedCountry, setValue]);

    useEffect(() => {
        if (!selectedState) { setCities([]); setValue("CityId", ""); return; }
        fetchCitiesByStateId(Number(selectedState)).then(res => {
            if (res.status === 200) res.json().then(d => setCities(d));
        }).catch(console.error);
    }, [selectedState, setValue]);

    const submit = async (data: WorkerRegister) => {
        if (!isValid) return;
        const loader = document.getElementById("worker-loader");
        const text = document.getElementById("worker-text");
        if (loader) loader.style.display = "flex";
        if (text) text.style.display = "none";

        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
            if (key === "ProfilePhoto") formData.append(key, (val as unknown as FileList)[0]);
            else formData.append(key, String(val));
        });
        formData.set("EmployerId", `${hashedId}`);

        const res = await addNewWorker(formData);
        handleCreateEmployee(res, loader, text, { toast }, reset).finally(() => {
            setModalOpen(false);
            onRefetch();
        });
    };

    const startEntry = workers.length > 0 ? (pageNumber - 1) * pageLimit + 1 : 0;
    const endEntry = workers.length > 0 ? startEntry + workers.length - 1 : 0;

    return (
        <>
            <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={modalStyles}>
                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: "70vh" }}>
                    <form noValidate onSubmit={handleSubmit(submit)}>
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                            <h1 className="modal-title fs-16">Create New Worker</h1>
                            <button type="button" className="btn-close" onClick={() => setModalOpen(false)} />
                        </div>
                        <div className="row gy-15">
                            {/* Basic info */}
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" placeholder="First Name"
                                    {...register("FirstName", { required: "Required" })} />
                                <p className="error-msg">{errors.FirstName?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" placeholder="Last Name"
                                    {...register("LastName", { required: "Required" })} />
                                <p className="error-msg">{errors.LastName?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" placeholder="Email"
                                    {...register("Email", { required: "Required" })} />
                                <p className="error-msg">{errors.Email?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" placeholder="Phone"
                                    {...register("Phone", { required: "Required" })} />
                                <p className="error-msg">{errors.Phone?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Date Of Birth</label>
                                <input type="date" className="form-control"
                                    {...register("DateOfBirth", { required: "Required" })} />
                                <p className="error-msg">{errors.DateOfBirth?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Profile Photo</label>
                                <input type="file" className="form-control"
                                    {...register("ProfilePhoto", { required: "Required" })} />
                                <p className="error-msg">{errors.ProfilePhoto?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Gender</label>
                                <select className="form-select" {...register("Gender", { required: "Required" })}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <p className="error-msg">{errors.Gender?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Join Date</label>
                                <input type="date" className="form-control"
                                    {...register("JoinDate", { required: "Required" })} />
                                <p className="error-msg">{errors.JoinDate?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Designation</label>
                                <input type="text" className="form-control" placeholder="Designation"
                                    {...register("Designation", { required: "Required" })} />
                                <p className="error-msg">{errors.Designation?.message}</p>
                            </div>

                            {/* Location */}
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Country</label>
                                <select className="form-select" {...register("CountryId", { required: "Required" })}>
                                    <option value="">Select Country</option>
                                    {countries.map((c) => (
                                        <option key={c.countryId} value={c.countryId}>{c.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.CountryId?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">State</label>
                                <select className="form-select" disabled={states.length === 0}
                                    {...register("StateId", { required: "Required" })}>
                                    <option value="">Select State</option>
                                    {states.map((s) => (
                                        <option key={s.stateId} value={s.stateId}>{s.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.StateId?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">City</label>
                                <select className="form-select" disabled={cities.length === 0}
                                    {...register("CityId", { required: "Required" })}>
                                    <option value="">Select City</option>
                                    {cities.map((c) => (
                                        <option key={c.cityId} value={c.cityId}>{c.name}</option>
                                    ))}
                                </select>
                                <p className="error-msg">{errors.CityId?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">PostCode</label>
                                <input type="text" className="form-control" placeholder="PostCode"
                                    {...register("PostCode", { required: "Required" })} />
                                <p className="error-msg">{errors.PostCode?.message}</p>
                            </div>
                            <div className="col-12 text-start">
                                <label className="form-label">Address</label>
                                <textarea className="form-control" placeholder="Address"
                                    {...register("Address", { required: "Required" })} />
                                <p className="error-msg">{errors.Address?.message}</p>
                            </div>

                            {/* Password */}
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" placeholder="Password"
                                    {...register("Password", { required: "Required" })} />
                                <p className="error-msg">{errors.Password?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" className="form-control" placeholder="Confirm Password"
                                    {...register("ConfirmPassword", {
                                        required: "Confirm your password",
                                        validate: (v) => v === workerPassword || "Passwords do not match",
                                    })} />
                                <p className="error-msg">{errors.ConfirmPassword?.message}</p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-10 mt-20">
                            <button type="button" className="btn btn-danger" onClick={() => setModalOpen(false)}>
                                <X size={18} className="mr-2" /> Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                                <div className="dots" id="worker-loader">
                                    <div className="dot" /><div className="dot" /><div className="dot" />
                                </div>
                                <span id="worker-text">
                                    <CheckCheck size={18} className="mr-2" /> Add Worker
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Tab content */}
            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                <h4>Workers ({totalWorkers})</h4>
                <div className="d-flex flex-wrap gap-15">
                    <div className="dataTables-sorting-control">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by worker name"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button type="button" className="btn btn-success" onClick={() => setModalOpen(true)}>
                        <Plus />
                    </button>
                </div>
            </div>
            <div className="card-body pt-15">
                <div className="table-responsive">
                    <table className="table text-nowrap text-start">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Designation</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((data, index) => (
                                <tr key={data.workerId ?? index}>
                                    <td>{startEntry + index}</td>
                                    <td>
                                        <div className="d-flex-items gap-10">
                                            <div className="avatar avatar-xs radius-100">
                                                <img
                                                    className="radius-100"
                                                    src={data.profilePhoto || "https://img.icons8.com/color/48/gender-neutral-user.png"}
                                                    alt="Worker"
                                                />
                                            </div>
                                            <h6>{`${data.firstName} ${data.lastName}`}</h6>
                                        </div>
                                    </td>
                                    <td>
                                        <p style={{ marginBottom: "5px" }}>{data.email}</p>
                                        <p>{data.phone}</p>
                                    </td>
                                    <td>{data.designation}</td>
                                    <td>{new Date(data.joinDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                                    <td>
                                        <div className="d-flex-items gap-10">
                                            <button className="btn-icon btn-info-light" type="button">
                                                <Eye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {workers.length === 0 && (
                        <div className="py-4 text-center">
                            <span className="text-black">This client hasn't added any worker</span>
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-10">
                    <p className="text-black mb-0">
                        Showing {startEntry} to {endEntry} of {totalWorkers} entries
                    </p>
                    <div className="d-inline-flex flex-wrap">
                        {pageNumber > 1 && (
                            <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(pageNumber - 1); }}
                                className="border-top border-bottom border-start text-primary border-secondary px-2 py-1 rounded-start">
                                Previous
                            </a>
                        )}
                        <a href="#" className="border border-secondary text-white bg-primary px-4 py-1 cursor-pointer">
                            {pageNumber}
                        </a>
                        {pageNumber * pageLimit < totalWorkers && (
                            <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(pageNumber + 1); }}
                                className="border-end border-top border-bottom text-primary border-secondary px-4 py-1 rounded-end">
                                Next
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
