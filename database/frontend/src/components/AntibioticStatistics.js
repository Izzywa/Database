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
            title={'Most prescribed antibiotics from database'}
            data={data.data}/>
        )
    }

    function DiagnosisBarChart() {
        const [data, setData] = useState({
            labels: [],
            data: []
        })

        useEffect(() => {
            fetch('/backend/diagnosis_stats')
            .then(response => response.json())
            .then(result => {
                setData(result)
            }).catch(error => console.log(error))
        },[])
        return (
            <>
            <BarChart
            labels={data.labels}
            data={data.data}
            datasetLabel={'% of prescription with given diagnosis'}
            title={'Most common cause for prescription from database'}
            />
            </>
        )
    }

    function ComplianceBarChart() {
        const [data, setData] = useState({
            labels: [],
            data: []
        })

        useEffect(() => {
            fetch('/backend/compliance_stats')
            .then(response => response.json())
            .then(result => {
                setData(result)
            }).catch(error => console.log(error))
        }, [])

        return (
            <>
            <BarChart
            labels={data.labels}
            data={data.data}
            datasetLabel={'% over all recorded compliance'}
            title={"Statistics of recorded patient's compliance to antibiotics"}
            />
            </>
        )
    }

    return(
        <>
        <NavBar/>
        <div className="container py-2">
            <Grid container spacing={1}>
                <Grid size={{ xs:12, md:6}} style={gridStyle}>
                    <AntibioticPieChart/>
                </Grid>
                <Grid size={{ xs:12, md:6}} style={gridStyle}>
                    <DiagnosisBarChart/>
                </Grid>
                <Grid size={12} style={{height: '100vh'}}>
                    <ComplianceBarChart/>
                </Grid>
            </Grid>
        </div>
        </>
    )
}