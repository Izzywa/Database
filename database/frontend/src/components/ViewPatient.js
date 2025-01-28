import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";

export default function ViewPatients() {
    const { id } = useParams();
    return(
        <>
        <NavBar/>
        <div className="container">
            <p>patient id {id} </p>
        </div>
        </>
    )
}