import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import { Grid2 as Grid } from "@mui/material";
import AgesStats from "./AgesStats";
import PatientsCountryStats from "./PatientsCountryStats";

export default function PatientsStatistics(props) {
    const { setBreadcrumbsList } = useAuth()

    useEffect(() => {
        setBreadcrumbsList({
            'Home': '/',
            'Patients Statistics': '/PtStats'
        })
    },[])

    const style = {
        height: '50vh',
        overflow: 'scroll'
    }

    return (
        <>
        <NavBar/>
        <div className="container py-2">
            <Grid container spacing={1}>
                <PatientsCountryStats />
                <Grid size={12} style={style}>
                    <AgesStats/>
                </Grid>
            </Grid>
        </div>
        </>
    )
}