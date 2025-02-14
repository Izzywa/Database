import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import PieChart from "./PieChart";


export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()
    const [data, setData] = useState({
        labels: [],
        data: []
    })

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
            <div>
                <PieChart labels={data.labels}
                datasetLabel={'Percentage over all prescribed antibiotics'}
                title={'5 most prescribed antibiotics from database'}
                data={data.data}/>
            </div>
        </div>
        </>
    )
}