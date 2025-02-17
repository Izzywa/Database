import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import AntibioticPieChart from "./AntibioticPieChart";
import DiagnosisBarChart from "./DiagnosisBarChart";
import { Grid2 as Grid } from "@mui/material";
import ComplianceBarChart from "./ComplianceBarChart";
import DatePrescriptionStats from "./DatePrescriptionStats";

export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()
    
    useEffect(() => {
        setBreadcrumbsList({
         'Home': '/',
         'Antibiotic Statistics': '/AbStats'
        })
    }, []);

    return(
        <>
        <NavBar/>
        <div className="container py-2">
            <Grid container spacing={1}>
                <Grid size={{ xs:12, md:6}}>
                    <AntibioticPieChart/>
                </Grid>
                <Grid size={{ xs:12, md:6}}>
                    <DiagnosisBarChart/>
                </Grid>
                <Grid size={12}>
                <DatePrescriptionStats/>
                </Grid>
                <Grid size={12} style={{height: '100vh'}}>
                    <ComplianceBarChart/> 
                    </Grid>
            </Grid>
        </div>
        </>
    )
}