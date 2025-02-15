import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import ComplianceList from "./ComplianceList";
import VisitList from "./VisitList";
import Alert from "@mui/material/Alert";
import { useAuth } from "./AuthContext";

export default function ViewDateItem(props) {
    const { id, date } = useParams();
    const { setBreadcrumbsList } = useAuth();
    const [name, setName] = useState('')
    const [data, setData] = useState(null)
    const [count, setCount] = useState(0)
    const [error, setError] = useState(null)

    useEffect(() => {
        setBreadcrumbsList({
            'Home': '/',
            'Patient Information': `/patient/${id}`,
            [`Patient Note: ${date}`] : `/date/${id}/${date}`
        })
    }, [])

    useEffect(() => {
        fetch(`/backend/vp/${id}/${date}`)
        .then(response => response.json())
        .then(result => {
            setData(result)
            if (!result.error) {
                setName(result.data.full_name)
            } else {
                setError(true)
            }
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
                    <VisitList visits={data.data.dates[0].visits}
                    id={id}
                    count={count}
                    date={date}
                    setCount={setCount}/>
                </div>
                <div className="prescription-list"
                style={style}>
                    <h4>Prescriptions</h4>
                    <ComplianceList visitPrescription={true}
                    id={id} 
                    count={count}
                    setCount={setCount}
                    prescriptionDate={date}
                    prescriptionList={data.data.dates[0].prescription}/>
                </div>
            </div>
        )
    }

    return(
        <>
        <NavBar/>
        <div className="container">
            {
                error ?
                <Alert severity="error">
                    <p>{data.message}</p>
                </Alert>
                :
                <div>
                    <h5>Patient (#{id}): {name}</h5>
                    <h3>{date}</h3>
                    {
                        data ?
                        <ListItem/>
                        : null
                    }
                    </div>
            }
        </div>
        </>
    )
}