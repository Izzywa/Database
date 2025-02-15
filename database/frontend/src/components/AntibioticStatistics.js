import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { Grid2 as Grid } from "@mui/material";

export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()

    useEffect(() => {
        setBreadcrumbsList({
         'Home': '/',
         'Antibiotic Statistics': '/AbStats'
        })
    }, []);
    /*

    function DiagnosisBarChart() {
        const [barData, setBarData] = useState({
            labels: ['lorem ipsum lorem ipsum', '1', '2'],
            data: [20,30,40]
        })
        return (
            <BarChart
            labels={barData.labels}
            data={barData.data}
            datasetLabel={'% of prescription with this diagnosis'}
            title={'5 most common diagnosis for prescribing antibiotics from database'}
            />
        )
    }

    return(
        <>
        <NavBar/>
        <div className="container">
            <Grid container>
                <Grid size={{xs: 12, md: 6}} sx={{maxHeight: '60vh', minHeight: '50vh'}} padding={1}>
                    <AntibioticPieChart/>
                </Grid>
                <Grid size={{xs: 12, md: 6}} sx={{maxHeight: '60vh', minHeight: '50vh'}} padding={1}>
                    <DiagnosisBarChart/>
                </Grid>
            </Grid>
        </div>
        </>
    )
        */

    const gridStyle = {
        height: '50vh'
    }

    function AntibioticPieChart() {
        const [data, setData] = useState({
            labels: [],
            data: []
        });

        const formatter = {
            formatter: (value, context) => {;
                return value + " %";
            },
            color: 'ffffff'
        }

        useEffect(() => {
            fetch('/backend/ab_stats')
            .then(response => response.json())
            .then(result => {
                setData(result)
            }).catch(error => console.log(error))
        },[])

        return (
            <PieChart labels={data.labels}
            formatter={formatter}
            datasetLabel={'% over all prescribed antibiotics'}
            title={'5 most prescribed antibiotics from database'}
            data={data.data}/>
        )
    }

    function DiagnosisBarChart() {
        const [data, SetData] = useState({
            labels: ['lorem lorem lorem', 'lorem','lorem'],
            data: [20,30,40]
        })
        return (
            <>
            <BarChart
            labels={data.labels}
            data={data.data}
            datasetLabel={'% of prescription with this diagnosis'}
            title={'Most common cause for prescription'}
            />
            </>
        )
    }
    return(
        <>
        <NavBar/>
        <div className="container">
            <Grid container>
                <Grid size={{ xs:12, md:6}} style={gridStyle}>
                    <AntibioticPieChart/>
                </Grid>
                <Grid size={{ xs:12, md:6}} style={gridStyle}>
                    <DiagnosisBarChart/>
                </Grid>
            </Grid>
        </div>
        </>
    )
}