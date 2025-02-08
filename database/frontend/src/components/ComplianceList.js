import React, { useEffect, useState } from "react";
import Table from "./Table";
import Paginator from "./Paginator";
import PrescriptionModal from "./PrescriptionModal";

export default function ComplianceList(props) {
    const ComplianceOrder = {
        'prescription_date': 'Date',
        'dose_str': 'Antibiotic',
        'diagnosis': 'Diagnoses',
        'compliance': 'Usage'
    }
    const [complianceList, setComplianceList] = useState([])
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [open, setOpen] = useState(false)
    const [prescription, setPrescription] = useState(null)
    const [count, setCount] = useState(0)

    function handleClose() {
        setOpen(false)
        setPrescription(null)
    }

    function handleComplianceClick(e) {
        const prescription_id = (e.target.closest("[data-id]").dataset.id)
        complianceList.map((item,index) => {
            if (item.id == prescription_id)
                setPrescription(item)
        })
        setOpen(true)
    }

    useEffect(() => {
        fetch('/backend/compliance/' + props.id
            + '?page=' + page
        )
        .then(response => {
            return response.json()
        })
        .then(result => {
            setNumPages(result.num_pages)
            setComplianceList(result.result)
        })
        .catch(error => console.log(error))
    },[page, count])

    if (complianceList.length == 0) {
        return (
            <h6>No Prescriptions history</h6>
        )
    } else {
        return (
            <>
            {prescription ?
            <PrescriptionModal openModal={open} 
            handleClose={handleClose}
            count={count}
            setCount={setCount}
            prescription={prescription}/>
            : null }
            <div className="table-container">
                <Table tableOrder={ComplianceOrder} 
                tableList={complianceList}
                rowClickEvent={handleComplianceClick}/>
                <Paginator
                page={page}
                setPage={setPage}
                count={numPages}
                />
            </div>
            </>
        )
    }
}