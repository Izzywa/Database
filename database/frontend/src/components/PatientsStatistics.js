import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import { Grid2 as Grid } from "@mui/material";
import AgesStats from "./AgesStats";

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
                <Grid size={{xs:12, md:6}} style={style}>
                    <AgesStats/>
                </Grid>
                <Grid size={{xs:12, md:6}} style={style}>
                    Frequency of prescribed antibiotics
                </Grid>
            </Grid>
        </div>
        </>
    )
}