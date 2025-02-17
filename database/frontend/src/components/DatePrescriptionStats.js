import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";

export default function DatePrescriptionStats(props) {
    const [data, setData] = useState({
        labels : [],
        data: []
    })
    const [years, setYears] = useState(1)

    useEffect(() => {
        fetch(`/backend/pr_stats?interval=${years}`)
        .then(response => response.json())
        .then(result => {
            setData(result)
        }).catch(error => alert(error))
    }, [])

    return (
        <>
        <LineChart
        labels={data.labels}
        datasetLabel={"Number of prescriptions by date"}
        data={data.data}/>
        </>
    )
}