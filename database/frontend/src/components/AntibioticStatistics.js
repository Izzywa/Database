import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import PieChart from "./PieChart";
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
        }
    }

    useEffect(() => {
       setBreadcrumbsList({
        'Home': '/',
        'Antibiotic Statistics': '/AntibioticStatistics'
       })

       fetch('/backend/top_5_ab')
       .then(response => response.json())
       .then(result => {
            setData(result)
       }).catch(error => console.log(error))
    },[])

    return(
        <>
        <NavBar/>
        <div className="container">
            AntibioticStatistics
            <Grid container>
                <Grid size={{xs: 12, md: 6}}>
                    <PieChart labels={data.labels}
                    formatter={formatter}
                    datasetLabel={'% over all prescribed antibiotics'}
                    title={'5 most prescribed antibiotics from database'}
                    data={data.data}/>
                </Grid>
            </Grid>
        </div>
        </>
    )
}