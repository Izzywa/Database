import React from "react";
import Modal from "@mui/material/Modal"

export default function ChildModal(props){

    return(
    <Modal
    open={props.openChild}>
        <div className="modal-div">
            <div className="bg-light text-dark container p-3">
                <p>Delete {props.label} ?</p>
                <button className="btn btn-info"
                onClick={props.handleCloseChild}>
                    Close
                </button>
                <button className="btn btn-dark m-1"
                onClick={props.handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    </Modal>
    )
}