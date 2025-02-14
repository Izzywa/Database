import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import PieChart from "./PieChart";

export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()

    const labels = ['red', 'blue', 'yellow', 'green']
    const datasetLabel = 'sample label'
    const data = [20,30,40,50]

    useEffect(() => {
       setBreadcrumbsList({
        'Home': '/',
        'Antibiotic Statistics': '/AntibioticStatistics'
       })
    },[])
    return(
        <>
        <NavBar/>
        <div className="container">
            AntibioticStatistics
            <div>
                <PieChart/>
            </div>
        </div>
        </>
    )
}