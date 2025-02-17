import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { Grid2 as Grid } from "@mui/material";

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

    const options = {
        maintainAspectRatio: false
    }

    function addYears() {
        if (years < 10) {
            setYears(prev => prev + 1)
        }
    }

    function minusYears() {
        if (years > 1) {
            setYears(prev => years - 1)
        }
    }

    return (
        <>
        
        <Grid size={12} style={{height: '50vh'}}>
        <LineChart
        labels={data.labels}
        datasetLabel={"Number of prescriptions by date"}
        data={data.data}
        options={options}/>
        </Grid>

        <div className="input-group mb-3 d-flex align-item-center justify-content-center">
            <button className="btn btn-dark"
            onClick={minusYears}>
                -
            </button>
            <span className="input-group-text border-dark">Years</span>
            <input type="number" value={years} 
            style={{width: '50px'}}
            min={1}
            max={10}
            onChange={(event) => setYears(event.target.value)}/>
            <button className="btn btn-dark"
            onClick={addYears}>
                +
            </button>
        </div>
        </>
    )
}