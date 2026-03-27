import {
    Blocks,
    BriefcaseBusiness,
    GlobeLock,
    Layers,
    LocateFixed,
    Mail,
    MapPinHouse,
    Phone,
    VectorSquare,
} from "lucide-react";
import Tippy from "@tippyjs/react";

export interface EmployerData {
    employerId: number;
    businessName: string;
    jobSectorId: string;
    jobSector: string;
    companySize: string;
    registrationNo: string;
    websiteUrl: string;
    employerLogo: string;
    countryId: string;
    country: string;
    packageId: string;
    package: string;
    packageItemReference: string;
    stateId: string;
    state: string;
    cityId: string;
    city: string;
    address: string;
    postCode: string;
    companyMail: string;
    companyPhone: string;
    dateCreated: string;
    officers: string;
    jobsPosted: string;
}

interface Props {
    employer: EmployerData;
}

export default function ClientSidebar({ employer }: Props) {
    const addressParts = [employer.address, employer.city, employer.state, employer.country].filter(Boolean);
    const addressStr = addressParts.join(", ");

    return (
        <div className="sidebar-sticky">
            <div className="card">
                <div className="company-info">
                    <div className="company-logo">
                        <img
                            src={employer.employerLogo || "https://img.icons8.com/fluency/100/image--v1.png"}
                            alt="Company Logo"
                        />
                    </div>
                    <h2 className="company-name mb-15">{employer.businessName}</h2>

                    <div className="company-info-list mb-25">
                        <ul>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><Mail /></span>
                                <Tippy content="Company Mail">
                                    <span style={{ textWrap: "wrap" }}>{employer.companyMail || "None Provided"}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><Phone /></span>
                                <Tippy content="Company Phone">
                                    <span style={{ textWrap: "wrap" }}>{employer.companyPhone || "None Provided"}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><BriefcaseBusiness /></span>
                                <Tippy content="Job Sector">
                                    <span style={{ textWrap: "wrap" }}>{employer.jobSector}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><MapPinHouse /></span>
                                <Tippy content="Address">
                                    <span style={{ textWrap: "wrap" }}>{addressStr}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><LocateFixed /></span>
                                <Tippy content="Postcode">
                                    <span style={{ textWrap: "wrap" }}>{employer.postCode}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><GlobeLock /></span>
                                <Tippy content="Website">
                                    <a href={employer.websiteUrl} target="_blank" rel="noreferrer" style={{ textWrap: "wrap" }}>
                                        {employer.websiteUrl}
                                    </a>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><VectorSquare /></span>
                                <Tippy content="Company Size">
                                    <span style={{ textWrap: "wrap" }}>{employer.companySize}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><Layers /></span>
                                <Tippy content="Registration No">
                                    <span style={{ textWrap: "wrap" }}>{employer.registrationNo}</span>
                                </Tippy>
                            </li>
                            <li style={{ flexWrap: "nowrap", alignItems: "start" }}>
                                <span><Blocks /></span>
                                <Tippy content="Current Package">
                                    <span style={{ textWrap: "wrap" }}>{employer.package || "No Package"}</span>
                                </Tippy>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
