import React, { useEffect, useState } from "react";
import MapChart from "./MapChart";
import { Grid2 as Grid } from "@mui/material";

export default function PatientsCountryStats(props) {
    const [resident, setResident] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        fetch(`/backend/pt_stats?residentCountry=${resident}`)
        .then(response => response.json())
        .then(result => {
            setData(result)
        }).catch(error => alert(error))
    },[resident])

    return(
        <>
            <Grid size={12} 
            style={{height: '50vh',
            overflow: 'scroll'}}>
            <MapChart title={`Number of Patients by ${resident? "Resident": "Birth"} Country`}
            data={data}/>
            </Grid>
            <div>
            <button className="btn btn-dark m-auto"
            onClick={() => setResident(prev => !prev)}>
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