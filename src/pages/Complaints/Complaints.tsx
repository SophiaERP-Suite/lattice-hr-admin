import { ChevronRight, Eye, FolderOutput, Heading, Radar, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllComplaints } from "../../utils/ComplaintRequests";
import { useForm, useWatch } from "react-hook-form";
import { fetchComplaintCategories } from "../../utils/ComplaintCategoryRequests";
import Modal from 'react-modal';
import Tippy from "@tippyjs/react";
import HtmlRenderer from "../../layout/HTMLRenderer";

interface ComplaintData {
    complaintId: string;
    categoryId: string;
    category: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userPhoto: string;
    userType: string;
    subject: string;
    description: string;
    dateCreated: string;
}

interface ComplaintCategoryData {
  categoryId: number;
  isEnabled: boolean;
  categoryName: string;
}

interface ComplaintFilter {
    Name: string;
    CategoryId: string;
}

export default function Complaints() {
    const [complaints, setComplaints] = useState<ComplaintData[]>([]);
    const [totalComplaints, setTotalComplaints] = useState(0);
    const [complaintView, setComplaintView] = useState<ComplaintData | null>(null);
    const limit = 10;
    const [pageNumber, setPageNumber] = useState(1);
    const { register, control } = useForm<ComplaintFilter>();
    const filters = useWatch({control});
    const [viewModalState, setViewModalState] = useState(false);
    const [complaintCategories, setComplaintCategories] = useState<ComplaintCategoryData[]>([]);

    useEffect(() => {
        fetchAllComplaints({ pageNumber, limit, ...filters })
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setComplaints(data.data.complaints);
                setTotalComplaints(data.data.totalCount);
            })
        } else {
            res.text()
            .then(data => {
            console.log(JSON.parse(data));
            })
        }
        })
    }, [pageNumber, limit, filters]);

    useEffect(() => {
        fetchComplaintCategories()
        .then(res => {
        if (res.status === 200) {
            res.json()
            .then(data => {
                setComplaintCategories(data.data);
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

    return (
        <div className="container-fluid">
            <Modal isOpen={viewModalState} onRequestClose={() => { setViewModalState(false); }}
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
                    {
                        complaintView && (
                            <div className="row gy-15">
                                <div className="d-flex justify-content-end border-bottom">
                                    <button type="button" className="btn-close"  onClick={() => setViewModalState(false)}></button>
                                </div>
                                <div className="col-12">
                                    <div className="sidebar-sticky">
                                        <div className="card">
                                            <div className="company-info">
                                                <div className="company-logo">
                                                    <img src={complaintView.userPhoto} alt="image not found" />
                                                </div>
                                                <h2 className="company-name mb-15">{ `${complaintView.userFirstName} ${complaintView.userLastName}` }</h2>

                                                <div className="company-info-list mb-10">
                                                    <ul>
                                                        <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><User /></span> <Tippy content="User Type"><span style={{ textWrap: 'wrap'}}>{complaintView.userType}</span></Tippy></li>
                                                        <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Radar /></span> <Tippy content="Category"><span style={{ textWrap: 'wrap'}}>{complaintView.category}</span></Tippy></li>
                                                        <li style={{ flexWrap: 'nowrap', alignItems: 'start' }}><span><Heading /></span> <Tippy content="Subject"><span style={{ textWrap: 'wrap'}}>{complaintView.subject}</span></Tippy></li>
                                                    </ul>
                                                </div>
                                                <div className="mb-15 text-start mt-4">
                                                    <h4 className="mb-5 border-bottom">Complaint Description</h4>
                                                    <HtmlRenderer html={complaintView.description} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </Modal>
            <div className="row">
                <div className="col-xl-12">
                    <div className="page-title-box d-flex-between flex-wrap gap-15">
                        <h1 className="page-title fs-18 lh-1">Complaints</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-example1 mb-0">
                                <li className="active breadcrumb-item" aria-current="page">
                                    <NavLink to="/Complaints">
                                        Complaints
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
                            <h4 className="d-flex-items gap-10">Complaints <span className="badge bg-label-primary">{complaints.length}</span></h4>
                            <div className="d-flex flex-wrap gap-15">
                                <div className="dataTables-sorting-control ">
                                    <input type="text" className="form-control" placeholder="Search by Name" {
                                        ...register('Name')
                                    } />
                                </div>
                                <div className="dataTables-sorting-control ">
                                    <select className="form-select sorting-dropdown"{
                                        ...register('CategoryId')
                                    }>
                                        <option value="">All Categories</option>
                                        {
                                            complaintCategories.map((data, index) => (
                                                <option key={index} value={data.categoryId}>{data.categoryName}</option>
                                            ))
                                        }
                                    </select>
                                </div>
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
                                            <th>User</th>
                                            <th>Type</th>
                                            <th>Category</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            complaints.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <div className="avatar radius-100">
                                                                    <img src={data.userPhoto} alt="#" className="radius-100"/>
                                                                </div>
                                                                <div>
                                                                    <h6>
                                                                        {`${data.userFirstName} ${data.userLastName}`}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{data.userType}</td>
                                                        <td>{data.category}</td>
                                                        <td>{data.subject}</td>
                                                        <td>{ new Date(data.dateCreated).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                                        <td>
                                                            <div className="d-flex-items gap-10">
                                                                <button className="btn-icon btn-info-light" type="button" onClick={() => { setComplaintView(data); setViewModalState(true); }}>
                                                                    <a><Eye /></a>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                {
                                    complaints.length === 0 ?
                                        <div className="py-4 whitespace-nowrap w-full">
                                        <span className="px-6 py-4 text-left font-medium text-black">There hasn't been any submitted complaints</span>
                                        </div> : <></>
                                }
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <div className="flex justify-content-center align-items-center mb-1">
                                    <p className="text-black">
                                        Showing { complaints.length > 0 ? ((pageNumber * limit) - limit) + 1 : 0 } to { complaints.length > 0 ? (((pageNumber * limit) - limit) + 1) + (complaints.length - 1) : 0 } of { totalComplaints } entries
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
                                        (pageNumber * limit) < totalComplaints && <a
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