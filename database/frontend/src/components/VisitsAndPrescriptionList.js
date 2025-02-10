import React, { useCallback, useEffect, useState } from "react";
import Paginator from "./Paginator";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import DateInput from "./DateInput";

export default function VisitsAndPrescriptionList(props) {
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [vpList, setVpList] = useState([])
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/backend/vp/' + props.id + "?page=" + page)
        .then(response => {
            return response.json()
        }).then(result => {
            setVpList(result.result)
            setNumPages(result.num_pages)
        }).catch(error => console.log(error))
    }, [page])

    const goToDate = useCallback((input) => {
        setDate(input)
        navigate(`/date/${props.id}/${input}`)
    }, [date])

    function NestedRow({item, row}) {
        if (item.length != 0) {
            return(
                <>
                <td>
                <table className="table table-sm">
                    <tbody>
                            {
                                item.map((newitem, newindex) => {
                                    return(
                                        <tr
                                        key={newindex}>
                                        <td>{newitem[row]}</td>
                                        </tr>
                                    )
                                })
                            }
                    </tbody>
                </table>
                </td>
                </>
            )
        } else {
            return <td>None</td>
        }
    }

    function handleMainRowClick(e) {
        const date = (e.target.closest("[data-date]").dataset.date)
        navigate(`/date/${props.id}/${date}`)
    }


    return (
        <>
        <Modal open={open}>
            <div className="modal-div">
                <div className=" container bg-light p-3">
                    <DateInput
                    label="Choose Date"
                    setDate={goToDate}/>
                    <button className="btn btn-info m-1"
                    onClick={() => setOpen(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>

        <div>
            <button className="btn btn-info m-2"
            onClick={() => setOpen(true)}>
                Add new
            </button>
        </div>
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Visits</th>
                        <th>Prescriptions</th>
                    </tr>
                </thead>
                <tbody className="tbody-vp">
                    {
                        vpList.map((item, index) => {
                            return(
                            <tr 
                            key={index}
                            data-date={item.date} 
                            onClick={handleMainRowClick}>
                                <td>
                                {item.date}</td>
                                <NestedRow item={item.visits} row={'note'}/>
                                <NestedRow item={item.prescription} row={'dose_str'}/>
                            </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
        <Paginator page={page}
        count={numPages}
        setPage={setPage}/>
        </>
    )
}