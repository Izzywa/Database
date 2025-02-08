import React, { useCallback, useEffect, useState } from "react";
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
        if (props.visitPrescription) {
            setComplianceList(props.prescriptionList)
        } else {
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
        }
        
    },[page, count])

    function handleAddPrescription() {
        setPrescription({
            add: true,
            diagnosis: [],
            compliance: []
        })

        setOpen(true)
    }

    function ComplianceListPrescription() {
        
        return (
            <>
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

    function DatePrescription() {
        return(
            <div>
                <div className="table-container">
                    <Table tableOrder={ComplianceOrder}
                    tableList={complianceList}
                    rowClickEvent={handleComplianceClick}/>
                </div>
            </div>
        )
    }

    const Render = useCallback(() => {
        switch (true) {
            case (props.visitPrescription):
                return (
                    <DatePrescription/>
                )
            default:
                return (<ComplianceListPrescription/>)
        }
    }, [complianceList])
    
    return(
        <>
        {prescription ?
            <PrescriptionModal openModal={open} 
            handleClose={handleClose}
            count={props.visitPrescription ? props.count : count}
            setCount={props.visitPrescription ? props.setCount : setCount}
            ptId={props.id}
            prescription={prescription}/>
            : null }
         <div>
                <button className="btn btn-info m-2"
                onClick={handleAddPrescription}>
                    Add Prescription
                </button>
            </div>
        {Render()}
        </>
    )
}