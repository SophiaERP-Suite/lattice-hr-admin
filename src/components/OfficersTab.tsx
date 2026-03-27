import { CheckCheck, Plus, X } from "lucide-react";
import Modal from "react-modal";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { addNewROfficer } from "../utils/EmployerRequests";
import { handleCreateEmployee } from "../utils/EmployeeResponse";

interface OfficerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dateCreated: string;
    email: string;
    phone: string;
    gender: string;
    profilePhoto: string;
    position: string;
}

interface ROfficerRegister {
    Email: string;
    FirstName: string;
    LastName: string;
    Phone: string;
    Position: string;
    Password: string;
    ConfirmPassword: string;
    Gender: string;
    DateOfBirth: string;
    ProfilePhoto: string;
}

interface Props {
    officers: OfficerData[];
    totalOfficers: number;
    pageNumber: number;
    pageLimit: number;
    hashedId: number;
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

export default function OfficersTab({
    officers,
    totalOfficers,
    pageNumber,
    pageLimit,
    hashedId,
    onPageChange,
    onRefetch,
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset, control } = useForm<ROfficerRegister>();
    const password = useWatch({ control, name: "Password" });

    const submit = async (data: ROfficerRegister) => {
        const loader = document.getElementById("officer-loader");
        const text = document.getElementById("officer-text");
        if (loader) loader.style.display = "flex";
        if (text) text.style.display = "none";

        const formData = new FormData();
        formData.append("FirstName", data.FirstName);
        formData.append("LastName", data.LastName);
        formData.append("ProfilePhoto", data.ProfilePhoto[0]);
        formData.append("Phone", data.Phone);
        formData.append("Email", data.Email);
        formData.append("DateOfBirth", data.DateOfBirth);
        formData.append("Gender", data.Gender);
        formData.append("Position", data.Position);
        formData.append("Password", data.Password);
        formData.append("EmployerId", `${hashedId}`);

        const res = await addNewROfficer(formData);
        handleCreateEmployee(res, loader, text, { toast }, reset).finally(() => {
            setModalOpen(false);
            onRefetch();
        });
    };

    const startEntry = officers.length > 0 ? (pageNumber - 1) * pageLimit + 1 : 0;
    const endEntry = officers.length > 0 ? startEntry + officers.length - 1 : 0;

    return (
        <>
            <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={modalStyles}>
                <div className="h-fit w-100 overflow-auto" style={{ maxHeight: "70vh" }}>
                    <form noValidate onSubmit={handleSubmit(submit)}>
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                            <h1 className="modal-title fs-16">Create New Responsibility Officer</h1>
                            <button type="button" className="btn-close" onClick={() => setModalOpen(false)} />
                        </div>
                        <div className="row gy-15">
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
                                <label className="form-label">Position</label>
                                <input type="text" className="form-control" placeholder="Position"
                                    {...register("Position", { required: "Required" })} />
                                <p className="error-msg">{errors.Position?.message}</p>
                            </div>
                            <div className="col-xl-6 col-md-6 text-start">
                                <label className="form-label">Date Of Birth</label>
                                <input type="date" className="form-control"
                                    {...register("DateOfBirth", { required: "Required" })} />
                                <p className="error-msg">{errors.DateOfBirth?.message}</p>
                            </div>
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
                                        validate: (v) => v === password || "Passwords do not match",
                                    })} />
                                <p className="error-msg">{errors.ConfirmPassword?.message}</p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-10 mt-20">
                            <button type="button" className="btn btn-danger" onClick={() => setModalOpen(false)}>
                                <X size={18} className="mr-2" /> Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                                <div className="dots" id="officer-loader">
                                    <div className="dot" /><div className="dot" /><div className="dot" />
                                </div>
                                <span id="officer-text">
                                    <CheckCheck size={18} className="mr-2" /> Add Officer
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Tab content */}
            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                <h4>Responsibility Officers ({totalOfficers})</h4>
                <button type="button" className="btn btn-success" onClick={() => setModalOpen(true)}>
                    <Plus />
                </button>
            </div>
            <div className="card-body pt-15">
                <div className="table-responsive">
                    <table className="table text-nowrap text-start">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Position</th>
                                <th>Join Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {officers.map((data, index) => (
                                <tr key={index}>
                                    <td>{startEntry + index}</td>
                                    <td>
                                        <div className="d-flex-items gap-10">
                                            <div className="avatar avatar-md radius-100">
                                                <img
                                                    className="radius-100"
                                                    src={
                                                        data.profilePhoto
                                                            ? data.profilePhoto.startsWith("/")
                                                                ? `http://localhost:5127/${data.profilePhoto}`
                                                                : data.profilePhoto
                                                            : "https://img.icons8.com/color/60/gender-neutral-user.png"
                                                    }
                                                    alt="Officer"
                                                />
                                            </div>
                                            <h6>{`${data.firstName} ${data.lastName}`}</h6>
                                        </div>
                                    </td>
                                    <td>
                                        <a href={`mailto:${data.email}`}>{data.email}</a>
                                        <br />
                                        <span>{data.phone}</span>
                                    </td>
                                    <td>{data.position}</td>
                                    <td>{new Date(data.dateCreated).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {officers.length === 0 && (
                        <div className="py-4 text-center">
                            <span className="text-black">This client hasn't added any responsibility officer</span>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-10">
                    <p className="text-black mb-0">
                        Showing {startEntry} to {endEntry} of {totalOfficers} entries
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
                        {pageNumber * pageLimit < totalOfficers && (
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
