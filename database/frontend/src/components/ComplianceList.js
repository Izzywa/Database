import React, { useEffect, useState } from "react";
import Table from "./Table";
import Paginator from "./Paginator";

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

    function handleComplianceClick(e) {
        const prescription_id = (e.target.closest("[data-id]").dataset.id)
        console.log('prescription id  ' + prescription_id)
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
    },[page])

    if (complianceList.length == 0) {
        return (
            <h6>No Prescriptions history</h6>
        )
    } else {
        return (
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
        )
    }
}