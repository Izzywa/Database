import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";

export default function PatientsStatistics(props) {
    const { setBreadcrumbsList } = useAuth()

    useEffect(() => {
        setBreadcrumbsList({
            'Home': '/',
            'Patients Statistics': '/PtStats'
        })
    },[])

    return (
        <>
        <NavBar/>
        <div className="container">
        </div>
        </>
    )
}