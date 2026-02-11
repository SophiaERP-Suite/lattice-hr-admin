import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchAllCurrencies, updateCurrency } from "../../utils/CurrencyRequests";
import { toast, ToastContainer } from "react-toastify";
import { handleCreateEmployee } from "../../utils/EmployeeResponse";


interface CurrencyData {
    currencyId: number;
    name: string;
    code: string;
    symbol: string;
    isActive: boolean;
    dateCreated: string;
}

export default function CurrencyMgt() {
    const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);

    useEffect(() => {
        fetchAllCurrencies()
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

    const refetchCurrencies = async () => {
        try {
            const res = await fetchAllCurrencies();
            if (res.status === 200) {
                const data = await res.json()
                setCurrencyData(data.data);
            } else {
                const resText = await res.text();
                console.log(JSON.parse(resText));
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    const toggleCurrencyStatus = async (currencyId: number, status: boolean) => {
        const formData = new FormData();
        formData.append("IsActive", String(status));
        const res = await updateCurrency(currencyId, formData);
        handleCreateEmployee(res, null, null, { toast }, null)
        .finally(async () => {
            await refetchCurrencies();
        });
    }


    return <div className="container-fluid">
        <ToastContainer />
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title-box d-flex-between flex-wrap gap-15">
                    <h1 className="page-title fs-18 lh-1">Currency</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-example1 mb-0">
                            <li className="active breadcrumb-item" aria-current="page">
                                <NavLink to="/ControlPanel/CurrencyMgt">
                                    Currency
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
                        <h4 className="d-flex-items gap-10">Currencies<span className="badge bg-label-primary">{currencyData.length}</span></h4>
                    </div>
                    <div className="card-body pt-15">
                        <div className="table-responsive">
                            <table id="companiesDataTable" className="table text-nowrap text-start w-100">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            S/N
                                        </th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Code</th>
                                        <th scope="col">Symbol</th>
                                        <th scope="col">Enabled</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currencyData.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ width: '8%' }}>
                                                        { index + 1}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex-items gap-10">
                                                            <h6 className="cursor-pointer">{ data.name }</h6>
                                                        </div>
                                                    </td>
                                                    <td>{ data.code }</td>
                                                    <td>{ data.symbol }</td>
                                                    <td>
                                                        <div
                                                            className={`toggle-switch ${data.isActive ? 'on' : ''}`}
                                                            onClick={() => toggleCurrencyStatus(data.currencyId, !data.isActive)}
                                                            >
                                                            <div className="toggle-knob" />
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