import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Table from "./Table";

export default function Home(props) {
    const [patientList, setPatientList] = useState(null);

    useEffect(() => {
        fetch('backend/patients')
        .then(response => response.json())
        .then(result => {
           setPatientList(result)
        }).catch(error => console.log(error))
    },[]);

    const tableOrder = {
        'id':'id',
        'full_name': 'Full name',
        'email': 'email',
        'age': 'Age',
        'phone_number': 'Phone Number',
    }

    return (
        <div>
            <NavBar/>
            <div className="container">
                <h4>Search Patient</h4>
                <h3>Patients List</h3>
                <div className="table-container">
                { patientList == null ? null :
                <Table tableOrder={tableOrder} tableList={patientList}/>
                }
                </div>
            </div>
        </div>
    )
}