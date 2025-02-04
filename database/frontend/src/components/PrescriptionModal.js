import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { Grid2 as Grid } from "@mui/material";
import Select from 'react-select';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function PrescriptionModal(props) {
    const [diagnosisOptions, setDiagnosisOptions] = useState([
        {'label': 'a', 'value': 'a'}
    ])
    const [complianceOptions, setComplianceOptions] = useState([])
    const [diagnosisList, setDiagnosisList] = useState(props.prescription.diagnosis ? props.prescription.diagnosis: [])
    const [complianceList , setComplianceList] = useState(props.prescription.compliance ? props.prescription.compliance: [])
    
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

    function ShowPrescription() {
        return (
            <Grid container spacing={1}>
                <Grid size={12}>
                <h5>Prescription (id #{props.prescription.id})</h5>
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
                    <Select options={complianceOptions}/>
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
        <div className="d-flex align-items-center justify-content-center"
        style={{height: "100vh", overflow: "scroll"}}>
            <div className="bg-light text-dark container p-3">
            {
                props.prescription ? 
                <ShowPrescription/>
                : <p>No prescription selected</p>
            }
            <button className="btn btn-info my-2"
            onClick={props.handleClose}>close</button>
            </div>
        </div>
      </Modal>
    )
}