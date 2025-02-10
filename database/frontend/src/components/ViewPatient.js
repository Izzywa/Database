import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import Table from "./Table";
import AllergiesList from "./AllergiesList";
import ComplianceList from "./ComplianceList";
import VisitsAndPrescriptionList from "./VisitsAndPrescriptionList";

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

    function RadioBtnGroup({index, item}) {
        const id = 'btn-radio' + index
        return(
            <>
            <input type="radio" 
            className="btn-check" 
            id={id} 
            autoComplete="off" 
            checked={radio == index ? true:false}
            onChange={() => handleRadio(index)}/>
            <label className="btn btn-outline-dark" 
            htmlFor={id}
            >
                {item}
            </label>
            </>
        )
    }

    function DisplayPage() {

        const radioChecked = useCallback(() => {
            switch(radio) {
                case 0:
                    return(
                        <AllergiesList id={id}/>
                    )
                case 1:
                    return(
                        <VisitsAndPrescriptionList id={id}/>
                    )
                case 2:
                    return (
                        <ComplianceList id={id}/>
                    )
                default:
                    return null
            }
        },[])
        return(
            <div>
                {radioChecked()}
            </div>
        )
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
                        {
                            radioList.map((item, index) => {
                                return(
                                    <Fragment key={index}>
                                    <RadioBtnGroup item={item} index={index}/>
                                    </Fragment>
                                )
                            })
                        }

                    </div>
                    <DisplayPage/>
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