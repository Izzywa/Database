import React, { useEffect, useState } from "react";
import ScatterChart from "./ScatterChart";

export default function AgesStats(props) {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('/backend/pt_stats?age=true')
        .then(response => response.json())
        .then(result => {
            setData(result)
        }).catch(error => alert(error))
    },[])
    return(
        <>
        <ScatterChart
        title={'Statistics of recorded patients age'}
        data={data}
        label={"Number of Patients by Age"}
        yTitle={"Number of Patients"}
        xTitle={"Age (years)"} 
        />
        </>
    )
}