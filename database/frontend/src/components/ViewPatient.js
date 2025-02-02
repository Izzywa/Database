import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import Table from "./Table";

export default function ViewPatients() {
    const { id } = useParams();
    const pathname = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    const [ptDetails, setPtDetails] = useState(null)
    const [radio, setRadio] = useState(2)
    const [vp, setVP] = useState([])
    const radioList = [
        'Allergies',
        'Visits and prescriptions',
        'Compliance'
    ]
    const VisitPrescriptionOrder = {
        'date':'Date',
        'visit_note': 'Visit Notes',
        'prescriptions': 'Prescriptions'
    }
    const [OfficialName, setOfficialName] = useState(true)
    const [allergiesList, setAllergiesList] = useState([])
    const ComplianceOrder = {
        'date': 'Date',
        'ab': 'Antibiotic',
        'diagnoses': 'Diagnoses',
        'usage': 'Usage'
    }
    const [complianceList, setComplianceList] = useState([])

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

        fetch('/backend/vp/' + id)
            .then(response => response.json())
            .then(result => setVP(result))
            .catch(error => console.log(error))

        fetch('/backend/compliance/' + id)
        .then(response => response.json())
        .then(result => setComplianceList(result))
        .catch(error => console.log(error))
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

    function handleAllergyName() {
        setOfficialName((prev) => !prev)
    }

    useEffect(() => {
        fetch('/backend/allergies/' + id + (OfficialName ? '/official' : '/trade'))
        .then(response => response.json())
        .then(result => setAllergiesList(result))
        .catch(error => console.log(error))
    },[OfficialName])

    function DisplayPage() {

        const radioChecked = useCallback(() => {
            switch(radio) {
                case 0:
                    return(
                        <>
                        {
                            allergiesList.length == 0 ? <p>No Allergies</p>
                            :
                            <div className="py-2">
                                <h6>Antibiotic {OfficialName ? 'Official Name' : 'Trade Name'}</h6>
                                <ul>
                                    {allergiesList.map((item, index) => {
                                        return(
                                            <li className="allergy-ab" key={index}>{item}</li>
                                        )
                                    })}
                                </ul>
                                <button 
                                onClick={handleAllergyName}
                                className="btn btn-info">
                                    {OfficialName ? 'Trade Name': 'Official Name'}
                                </button>
                            </div>
                }
                        </>
                    )
                case 1:
                    if (vp.length == 0) {
                        return(
                            <p>No Visits and Prescriptions</p>
                        )
                    } else {
                        return(
                            <div className="table-container">
                            <Table tableOrder={VisitPrescriptionOrder} 
                            tableList={vp} 
                            rowClickEvent={null}/>
                            </div>
                        )
                    }
                case 2:
                    if (complianceList.length == 0) {
                        return(
                            <p>No prescriptions</p>
                        )
                    } else {
                        return(
                            <div className="table-container">
                            <Table tableOrder={ComplianceOrder} 
                            tableList={complianceList} 
                            rowClickEvent={null}/>
                            </div>
                        )
                    }
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