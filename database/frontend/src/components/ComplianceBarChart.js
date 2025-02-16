import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";

export default function ComplianceBarChart() {
    const [data, setData] = useState({
        labels: [],
        data: []
    })

    useEffect(() => {
        fetch('/backend/compliance_stats')
        .then(response => response.json())
        .then(result => {
            setData(result)
        }).catch(error => console.log(error))
    }, [])

    return (
        <>
        <BarChart
        labels={data.labels}
        data={data.data}
        datasetLabel={'% over all recorded compliance'}
        title={"Statistics of recorded patient's compliance to antibiotics"}
        />
        </>
    )
}