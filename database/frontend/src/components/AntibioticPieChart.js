import React, {useState, useEffect} from "react";
import PieChart from "./PieChart";
import { Grid2 as Grid } from "@mui/material";

export default function AntibioticPieChart() {
    const [data, setData] = useState({
        labels: [],
        data: []
    });
    const [allAb, setAllAb] = useState(false)

    const gridStyle = {
        height: '50vh'
    }

    const formatter = {
        formatter: (value, context) => {;
            return value + " %";
        },
        color: 'ffffff'
    }

    function toggleAbList() {
        setAllAb(prev => !prev)
    }

    useEffect(() => {
        fetch('/backend/ab_stats')
        .then(response => response.json())
        .then(result => {
            setData(result)
        }).catch(error => console.log(error))
    },[])

    return (
        <>
        {
            allAb ? 
            <Grid style={{maxHeight: '100vh', overflow: 'scroll'}} >
                <p>Table for all ab stats</p>
                </Grid>
            :
            <Grid style={gridStyle}>
                <PieChart labels={data.labels}
                formatter={formatter}
                datasetLabel={'% over all prescribed antibiotics'}
                title={'Most prescribed antibiotics from database'}
                data={data.data}/>
            </Grid>
        }
        <Grid>
            <button className="btn btn-dark m-2"
            onClick={toggleAbList}>
                {
                    allAb ? 
                    'Statistics of most prescribed antibiotics'
                    :
                    'Statistics of all antibiotics'
                }
            </button>
        </Grid>
        </>
    )
}
