import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { Grid2 as Grid, styled } from "@mui/material";
import Select from 'react-select';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import csrftoken from "./CSRFToken";

export default function PrescriptionModal(props) {
    const [diagnosisOptions, setDiagnosisOptions] = useState([])
    const [complianceOptions, setComplianceOptions] = useState([])
    const [diagnosisList, setDiagnosisList] = useState(props.prescription.diagnosis ? props.prescription.diagnosis: [])
    const [complianceList , setComplianceList] = useState(props.prescription.compliance ? props.prescription.compliance: [])
    const [openChild, setOpenChild] = useState(false)

    const style = {
        height: "100vh",
        overflow: "scroll",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
        }

    function handleCloseChild(){
        setOpenChild(false)
    }

    useEffect(() => {
        fetch('/backend/diagnoses')
        .then(response => response.json())
        .then(result => {
            const resultfilter = result.filter(({label}) => !diagnosisList.includes(label))
            setDiagnosisOptions(resultfilter)
        }).catch(error => console.log(error))
    },[diagnosisList])

    useEffect(() => {
        fetch('/backend/abusage')
        .then(response => response.json())
        .then(result => {
            const resultfilter = result.filter(({label}) => !complianceList.includes(label))
            setComplianceOptions(resultfilter)
        }).catch(error => console.log(error))
    }, [complianceList])
    
    function handleDiagnosisChange(choice) {
        setDiagnosisList(diagnosisList => [...diagnosisList, choice.label])
    }

    function handleDeleteDiagnosis(diagnosis) {
        setDiagnosisList(list => list.filter(item => item != diagnosis))
    }

    function handleComplianceChange(choice) {
        setComplianceList(diagnosisList => [...diagnosisList, choice.label])
    }

    function handleDeleteCompliance(compliance) {
        setComplianceList(list => list.filter(item => item != compliance))
    }

    function handleDeletePrescription() {
        const requestOptions = {
            method: ('DELETE'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken()
            },
            mode: 'same-origin',
            body: JSON.stringify({
            })
        }

        fetch('/backend/compliance/edit/' + props.prescription.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            handleCloseChild()
            props.handleClose()
            props.setCount(props.count + 1)
        }).catch(error => console.log(error))
    }

    function handleSaveChanges() {
        let dl = new Set(diagnosisList)
        dl = [...dl]

        let cl = new Set(complianceList)
        cl = [...cl]
        
        const requestOptions = {
            method: ('POST'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken()
            },
            mode: 'same-origin',
            body: JSON.stringify({
                diagnoses: dl,
                compliance: cl
            })
        }

        fetch('/backend/compliance/edit/' + props.prescription.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                props.handleClose()
                props.setCount(props.count + 1)
            } else {
                alert(result.message)  
            }
        }).catch(error => console.log(error))

    }

    function openChildModal() {
        setOpenChild(true)
    }


    function ChildModal(){
        return(
        <Modal
        open={openChild}>
            <div style={style}>
                <div className="bg-light text-dark container p-3">
                    <p>Delete prescription (id#{props.prescription.id})?</p>
                    <button className="btn btn-info"
                    onClick={handleCloseChild}>
                        Close
                    </button>
                    <button className="btn btn-dark m-1"
                    onClick={handleDeletePrescription}>
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
        )
    }
    function ShowPrescription() {
        return (
            <Grid container spacing={1}>
                <ChildModal/>
                <Grid size={12}>
                <h5>
                    Prescription (id #{props.prescription.id})
                    <span className="px-2"> 
                    <DeleteForeverIcon color="secondary"
                    onClick={openChildModal}/> 
                    </span>
                </h5>
                </Grid>
                <Grid size={{xs: 12, md: 4}}>
                    <p><strong>Date: </strong>{props.prescription.prescription_date}</p>
                </Grid>
                <Grid size={{ xs: 12, md: 8}}>
                    <p><strong>Prescription: </strong>{props.prescription.dose_str}</p>
                    </Grid>
                <Grid size={12}>
                    <p>
                        <strong>Diagnoses: </strong>
                    </p>
                    <ul>
                    {
                        diagnosisList.map((item, index) => {
                            return(
                                <li key={index}>
                                    {item} 
                                    <DeleteForeverIcon color="secondary"
                                    onClick={() => handleDeleteDiagnosis(item)}/>
                                    </li>
                            )
                        })
                    }
                    </ul>
                    <Select options={diagnosisOptions}
                    onChange={(choice) => handleDiagnosisChange(choice)}/>
                </Grid>
                <Grid size={12}>
                    <p>
                        <strong>Usage: </strong>
                    </p>
                    <ul>
                    {
                        complianceList.map((item, index) => {
                            return(
                                <li key={index}>
                                    {item}
                                    <DeleteForeverIcon color="secondary"
                                    onClick={() => handleDeleteCompliance(item)}/>
                                </li>
                            )
                        })
                    }
                    </ul>
                    <Select options={complianceOptions}
                    onChange={(choice) => handleComplianceChange(choice)}/>
                </Grid>
            </Grid>
        )

    }

    return(
        <Modal
        open={props.openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={style}>
            <div className="bg-light text-dark container p-3">
            {
                props.prescription ? 
                <ShowPrescription/>
                : <p>No prescription selected</p>
            }
            <div className="my-2">
            <button className="btn btn-info"
            onClick={props.handleClose}>Close</button>
            <button className="btn btn-dark mx-1"
            onClick={handleSaveChanges}>
                Save Changes
            </button>
            </div>
            </div>
        </div>
      </Modal>
    )
}