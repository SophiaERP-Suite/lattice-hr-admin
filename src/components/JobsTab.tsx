import { Eye } from "lucide-react";
import Tippy from "@tippyjs/react";
import { NavLink } from "react-router-dom";
import Hashids from "hashids";

interface JobData {
    jobId: number;
    jobTitle: string;
    jobDescription: string;
    employerId: string;
    employer: string;
    jobSectorId: string;
    jobSector: string;
    jobTypeId: string;
    jobType: string;
    countryId: string;
    country: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    published: boolean;
    publishedDate: string;
    dateCreated: string;
}

interface Props {
    jobs: JobData[];
    totalJobs: number;
    pageNumber: number;
    pageLimit: number;
    clientId: string | undefined;
    onPageChange: (page: number) => void;
    onTogglePublish: (jobId: number, status: boolean) => void;
}

const hashIds = new Hashids("LatticeHumanResourceEncode", 10);

export default function JobsTab({
    jobs, totalJobs, pageNumber, pageLimit,
    clientId, onPageChange, onTogglePublish,
}: Props) {
    const startEntry = jobs.length > 0 ? (pageNumber - 1) * pageLimit + 1 : 0;
    const endEntry = jobs.length > 0 ? startEntry + jobs.length - 1 : 0;

    return (
        <>
            <div className="card-header justify-between gap-25 flex-wrap mb-25">
                <h4>Jobs Posted ({totalJobs})</h4>
            </div>
            <div className="card-body pt-15">
                <div className="table-responsive">
                    <table className="table text-nowrap text-start">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>Title</th>
                                <th>Published</th>
                                <th>Location</th>
                                <th>Date Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((data, index) => {
                                const locationParts = [data.city, data.state, data.country].filter(Boolean);
                                return (
                                    <tr key={data.jobId ?? index}>
                                        <td>{startEntry + index}</td>
                                        <td>{data.jobTitle}</td>
                                        <td>
                                            <div
                                                className={`toggle-switch ${data.published ? "on" : ""}`}
                                                onClick={() => onTogglePublish(data.jobId, !data.published)}
                                            >
                                                <div className="toggle-knob" />
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: "200px", textWrap: "wrap" }}>
                                            <p>{locationParts.join(", ")}</p>
                                        </td>
                                        <td>
                                            {new Date(data.dateCreated).toLocaleDateString("en-GB", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })}
                                        </td>
                                        <td>
                                            <div className="d-flex-items gap-10">
                                                <Tippy content="Preview Job">
                                                    <NavLink
                                                        className="btn-icon btn-info-light"
                                                        to={`/JobMgt/${hashIds.encode(data.jobId)}/${clientId}`}
                                                    >
                                                        <Eye />
                                                    </NavLink>
                                                </Tippy>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {jobs.length === 0 && (
                        <div className="py-4 text-center">
                            <span className="text-black">This client hasn't added any job</span>
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-10">
                    <p className="text-black mb-0">
                        Showing {startEntry} to {endEntry} of {totalJobs} entries
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
                        {pageNumber * pageLimit < totalJobs && (
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
