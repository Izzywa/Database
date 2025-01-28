import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Table from "./Table";

export default function Home(props) {
    useEffect(() => {
        fetch('backend/patients')
        .then(response => response.json())
        .then(result => {
           console.log(result)
        }).catch(error => console.log(error))
    },[]);

    return (
        <div>
            <NavBar/>
            <div className="container">
                <h3>Patient List</h3>
                <Table/>
            </div>
        </div>
    )
}