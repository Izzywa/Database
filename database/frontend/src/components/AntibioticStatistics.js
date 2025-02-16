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
        const [allAb, setAllAb] = useState(false)

        const formatter = {
            formatter: (value, context) => {;
                return value + " %";
            },
            color: 'ffffff'
        }

        function toggleAbList() {
            setAllAb(prev => !prev)
        }

        useEffect(() => {
            fetch('/backend/ab_stats')
            .then(response => response.json())
            .then(result => {
                setData(result)
            }).catch(error => console.log(error))
        },[])

        return (
            <>
            {
                allAb ? 
                <Grid style={{maxHeight: '100vh', overflow: 'scroll'}} >
                    <p>Table for all ab stats</p>
                    </Grid>
                :
                <Grid style={gridStyle}>
                    <PieChart labels={data.labels}
                    formatter={formatter}
                    datasetLabel={'% over all prescribed antibiotics'}
                    title={'Most prescribed antibiotics from database'}
                    data={data.data}/>
                </Grid>
            }
            <Grid>
                <button className="btn btn-dark m-2"
                onClick={toggleAbList}>
                    {
                        allAb ? 
                        'Statistics of most prescribed antibiotics'
                        :
                        'Statistics of all antibiotics'
                    }
                </button>
            </Grid>
            </>
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
            <Grid style={gridStyle}>
                <BarChart
                labels={data.labels}
                data={data.data}
                datasetLabel={'% of prescription with given diagnosis'}
                title={'Most common cause for prescription from database'}
                />
            </Grid>
            <Grid>
                <button className="btn btn-dark m-2">
                    Statistics of all diagnoses
                </button>
            </Grid>
            
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
                <Grid size={{ xs:12, md:6}}>
                    <AntibioticPieChart/>
                </Grid>
                <Grid size={{ xs:12, md:6}}>
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