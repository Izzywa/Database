import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "./NavBar";

export default function ViewPatients() {
    const { id } = useParams();
    const pathname = useLocation();
    useEffect(() => {
        fetch('/backend/patients/' + id)
        .then(response => response.json())
        .then(result => {
            if (result.error != undefined) {
                console.log(result.message)
            } else {
                console.log(result)
            }
        })
        .catch(error => console.log(error))
    }, [pathname])
    return(
        <>
        <NavBar/>
        <div className="container">
            <p>patient id {id} </p>
        </div>
        </>
    )
}