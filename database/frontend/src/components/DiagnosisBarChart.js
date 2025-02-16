import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { Grid2 as Grid } from "@mui/material";

export default function DiagnosisBarChart() {
    const [data, setData] = useState({
        labels: [],
        data: []
    })
    const [allDiagnoses, setAllDiagnoses] = useState(false);

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

    function toggleDiagnosisList() {
        setAllDiagnoses(prev => !prev)
    }

    function AllDiagnosesStats() {
        return (
            <Grid style={{height: '50vh', overflow: 'scroll'}}>
                <p>all diagnoses stats</p>
            </Grid>
        )
    }

    return (
        <>
        {
            allDiagnoses ? 
            <AllDiagnosesStats/>
            :
            <Grid style={gridStyle}>
            <BarChart
            labels={data.labels}
            data={data.data}
            datasetLabel={'% of prescription with given diagnosis'}
            title={'Most common cause for prescription from database'}
            />
        </Grid>

        }
        <Grid>
            <button className="btn btn-dark m-2"
            onClick={toggleDiagnosisList}>
                {
                    allDiagnoses ?
                    'Statistics of most common diagnoses'
                    : 
                    'Statistics of all diagnoses'
                }
            </button>
        </Grid>
        
        </>
    )
}