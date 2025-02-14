import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import PieChart from "./PieChart";


export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()
    const data = {
        labels: ['red', 'blue', 'yellow', 'green', 'purple'],
        datasetLabel:'My pie chart',
        data: [20,30,40, 50, 60]
    }

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
                <PieChart labels={data.labels}
                datasetLabel={data.datasetLabel}
                title={'5 most prescribed antibiotics from database'}
                data={data.data}/>
            </div>
        </div>
        </>
    )
}