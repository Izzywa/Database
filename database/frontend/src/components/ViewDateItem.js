import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import Table from "./Table";
import ComplianceList from "./ComplianceList";

export default function ViewDateItem(props) {
    const { id, date } = useParams();
    const [name, setName] = useState('')
    const [data, setData] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        fetch(`/backend/vp/${id}/${date}`)
        .then(response => response.json())
        .then(result => {
            setData(result)
            setName(result.data.full_name)
        }).catch(error => console.log(error))
    }, [count])

    const style = {
        borderTop: "1px solid rgb(0,0,0,0.2)"
    }

    function ListItem() {
        return (
            <div>
                <div className="visit-list"
                style={style}>
                    <h4>Visit Notes</h4>
                </div>
                <div className="prescription-list"
                style={style}>
                    <h4>Prescriptions</h4>
                    <ComplianceList visitPrescription={true}
                    id={id} 
                    count={count}
                    setCount={setCount}
                    prescriptionList={data.data.dates[0].prescription}/>
                </div>
            </div>
        )
    }

    return(
        <>
        <NavBar/>
        <div className="container">
            <h1>Patient (#{id}): {name}</h1>
            <h3>{date}</h3>
            {
                data ?
                <ListItem/>
                : null
            }
            
        </div>
        </>
    )
}