import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import { Grid2 as Grid } from "@mui/material";

export default function PatientsStatistics(props) {
    const { setBreadcrumbsList } = useAuth()

    useEffect(() => {
        setBreadcrumbsList({
            'Home': '/',
            'Patients Statistics': '/PtStats'
        })
    },[])

    return (
        <>
        <NavBar/>
        <div className="container py-2">
            <Grid container>
                <Grid size={{xs:12, md:6}}>
                    Patient's age
                </Grid>
                <Grid size={{xs:12, md:6}}>
                    Frequency of prescribed antibiotics
                </Grid>
            </Grid>
        </div>
        </>
    )
}