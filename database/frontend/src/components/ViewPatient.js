import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';

export default function ViewPatients() {
    const { id } = useParams();
    const pathname = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    const [ptDetails, setPtDetails] = useState(null)
    const [radio, setRadio] = useState(1)
    const radioList = [
        'Allergies',
        'Visits and prescriptions',
        'Compliance'
    ]

    useEffect(() => {
        setIsLoading(true)
        fetch('/backend/patients/' + id)
        .then(response => response.json())
        .then(result => {
            setPtDetails(result)
        })
        .catch(error => console.log(error))
        .finally(() => {
            setIsLoading(false)
        })
    }, [pathname])

    function handleRadio(value) {
        setRadio(value)
    }

    function PtInfromation() {
        const viewList = {
            'full_name': 'full name',
            'id': 'patient id',
            'email': 'email',
            'phone_number': 'phone number',
            'birth_date': 'birth date',
            'age': 'age',
            'birth_country': 'birth country',
            'resident_country': 'resident country'
        }
        return(
            <div className="containter">
                <Grid container spacing={0}>
                        {
                            Object.entries(viewList)
                            .map( ([key, value]) => 
                                <Grid key={key} size={{xs: 12, md: 6}}>
                                <p><strong>{value.toUpperCase()} : </strong>
                                {ptDetails[key]}
                                </p>
                             </Grid>
                             )
                        }
                </Grid>
                <div>
                    <div className="btn-group" role="group" aria-label="toggle button group">
                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" autoComplete="off" 
                    checked={radio == 1 ? true:false}
                    onChange={() => handleRadio(1)}/>
                    <label className="btn btn-outline-dark" htmlFor="vbtn-radio1">Radio 1</label>
                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" 
                    autoComplete="off" 
                    checked={radio == 2 ? true:false}
                    onChange={() => handleRadio(2)}/>
                    <label className="btn btn-outline-dark" htmlFor="vbtn-radio2">Radio 2</label>
                    <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" 
                    checked={radio == 3 ? true:false}
                    autoComplete="off" 
                    onChange={() => handleRadio(3)}/>
                    <label className="btn btn-outline-dark" htmlFor="vbtn-radio3">Radio 3</label>

                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <CircularProgress />
    } else {
    return(
        <>
        <NavBar/>
        <div className="container">
            <h1>Patient Information</h1>
            { ptDetails.error == true ? 
            <Alert severity="warning">{ptDetails.message}</Alert>
            :<PtInfromation/>}
        </div>
        </>
    )
}
}