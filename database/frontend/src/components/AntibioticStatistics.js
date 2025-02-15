import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { Grid2 as Grid } from "@mui/material";

export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()
    const [data, setData] = useState({
        labels: [],
        data: []
    })

    const formatter = {
        formatter: (value, context) => {;
            return value + " %";
        },
        color: 'ffffff'
    }

    useEffect(() => {
       setBreadcrumbsList({
        'Home': '/',
        'Antibiotic Statistics': '/AntibioticStatistics'
       })

       fetch('/backend/ab_stats')
       .then(response => response.json())
       .then(result => {
            setData(result)
       }).catch(error => console.log(error))
    },[])

    return(
        <>
        <NavBar/>
        <div className="container">
            <Grid container>
                <Grid size={{xs: 12, md: 6}} padding={1}>
                    <PieChart labels={data.labels}
                    formatter={formatter}
                    datasetLabel={'% over all prescribed antibiotics'}
                    title={'5 most prescribed antibiotics from database'}
                    data={data.data}/>
                </Grid>
                <Grid size={{xs: 12, md: 6}} height={350} padding={1}>
                    <BarChart/>
                </Grid>
            </Grid>
        </div>
        </>
    )
}