import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import Table from "./Table";
import Paginator from "./Paginator";

export default function ViewPatients() {
    const { id } = useParams();
    const pathname = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    const [ptDetails, setPtDetails] = useState(null)
    const [radio, setRadio] = useState(1)
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
        'prescription_date': 'Date',
        'dose_str': 'Antibiotic',
        'diagnosis': 'Diagnoses',
        'compliance': 'Usage'
    }
    const [complianceList, setComplianceList] = useState([])
    const [page, setPage] = useState(1)
    const [numPages, setNumPaes] = useState(1)

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
        .then(result => setComplianceList(result.result))
        .catch(error => console.log(error))
    }, [pathname])

    function handleRadio(value) {
        setRadio(value)
        setPage(1)
    }

    function handleComplianceClick(e) {
        const prescription_id = (e.target.closest("[data-id]").dataset.id)
        console.log('prescription id  ' + prescription_id)
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
        setPage(1)
    }

    useEffect(() => {
        fetch('/backend/allergies/' 
            + id 
            + (OfficialName ? '/official' : '/trade')
            + "?page=" + page
        )
        .then(response => {
            return response.json()
        })
        .then(result => {
            setAllergiesList(result.result)
            setNumPaes(result.num_pages)
        })
        .catch(error => console.log(error))
    },[OfficialName, page])

    function handlePaginationChange(event, value) {
        setPage(value)
    }

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
                                <Grid container>
                                    {allergiesList.map((item, index) => {
                                        return(
                                            <Grid 
                                            size={{ xs: 12, md: 6}}
                                            key={index}
                                            >
                                                <p className="allergy-ab">
                                                     - {String(item).charAt(0).toUpperCase()
                                                     + String(item).slice(1)}</p>
                                                </Grid>
                                        )
                                    })}
                                </Grid>
                                <Paginator
                                count={numPages}
                                page={page}
                                changeHandler={handlePaginationChange}
                                />
                            </div>
                        }
                        <button 
                        onClick={handleAllergyName}
                        className="btn btn-info my-1">
                            {OfficialName ? 'Trade Name': 'Official Name'}
                        </button>
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
                    return (
                        <div className="table-container">
                            <Table tableOrder={ComplianceOrder} 
                            tableList={complianceList} 
                            rowClickEvent={handleComplianceClick}/>
                            </div>
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