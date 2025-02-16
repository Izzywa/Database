import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { Grid2 as Grid } from "@mui/material";

export default function DiagnosisBarChart() {
    const [data, setData] = useState({
        labels: [],
        data: []
    })

    const gridStyle = {
        height: '50vh'
    }    

    useEffect(() => {
        fetch('/backend/diagnosis_stats')
        .then(response => response.json())
        .then(result => {
            setData(result)
        }).catch(error => console.log(error))
    },[])
    return (
        <>
        <Grid style={gridStyle}>
            <BarChart
            labels={data.labels}
            data={data.data}
            datasetLabel={'% of prescription with given diagnosis'}
            title={'Most common cause for prescription from database'}
            />
        </Grid>
        <Grid>
            <button className="btn btn-dark m-2">
                Statistics of all diagnoses
            </button>
        </Grid>
        
        </>
    )
}