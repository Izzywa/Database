import React, { useState } from "react";
import MapChart from "./MapChart";
import { Grid2 as Grid } from "@mui/material";

export default function PatientsCountryStats(props) {
    const [resident, setResident] = useState(true)
    return(
        <>
        <div className="d-flex align-item-center justify-content-center p-2">
        <button className="btn btn-dark">
            View Statistics for 
            {
                resident ? "Birth" : "Resident"
            }
            Country
        </button>
        </div>
            <Grid size={12} 
            style={{height: '50vh',
            overflow: 'scroll'}}>
            <MapChart/>
            </Grid>
        </>
    )
}