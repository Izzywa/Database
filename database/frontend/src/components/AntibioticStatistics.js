import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";

export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()

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
        </div>
        </>
    )
}