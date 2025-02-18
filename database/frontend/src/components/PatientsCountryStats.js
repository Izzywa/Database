import React, { useState } from "react";
import MapChart from "./MapChart";
import { Grid2 as Grid } from "@mui/material";

export default function PatientsCountryStats(props) {
    const [resident, setResident] = useState(true)
    const [data, setData] = useState([
            {
                id: "AF",
                value: 10,
                name: 'America'
            }, {
                id: "GB",
                value: 100,
                name: 'Brittain'
            }, 
            {
                id: "MY",
                value: 50,
                name: 'America'
            }
        ])
    return(
        <>
            <Grid size={12} 
            style={{height: '50vh',
            overflow: 'scroll'}}>
            <MapChart title={`Number of Patients by ${resident? "Resident": "Birth"} Country`}
            data={data}/>
            </Grid>
            <div>
            <button className="btn btn-dark m-auto">
                View Statistics for  
                {
                    resident ? " Birth " : " Resident "
                }
                 Country
            </button>
            </div>
        </>
    )
}