import React from "react";
import Modal from '@mui/material/Modal';
import { Grid2 as Grid } from "@mui/material";


export default function PrescriptionModal(props) {

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
                        {
                            props.prescription.diagnosis.join(', ')
                        }

                    </p>
                </Grid>
                <Grid size={12}>
                    <p>
                        <strong>Usage: </strong>
                        {
                            props.prescription.compliance.join(', ')
                        }

                    </p>
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
            <button className="btn btn-info"
            onClick={props.handleClose}>close</button>
            </div>
        </div>
      </Modal>
    )
}