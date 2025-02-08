import React, { useRef, useState } from "react";
import Table from "./Table";
import { Modal } from "@mui/material";
import {Grid2 as Grid} from "@mui/material";
import Textarea from '@mui/joy/Textarea';

export default function VisitList(props) {
    const visitOrder = {
        'note': 'Notes',
        'modified_timestamp': 'Last Modified'
    }
    const [visit, setVisit] = useState(null)
    const [open, setOpen] = useState(false)
    const textRef = useRef();

    function handleRowClick(e) {
        const visit_id = (e.target.closest("[data-id]").dataset.id)
        props.visits.map((item,index) => {
            if (item.id == visit_id)
                setVisit(item)
        })
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    function handleSaveChanges() {
        console.log(textRef.current.value)
    }

    function VisitModal() {
        return (
            <Modal
            open={open}>
            <div className="modal-div">
                <div className="container p-3">
                    <Grid container>
                        <Grid size={12} >
                            <Textarea className="my-2"
                            slotProps={{textarea: {ref: textRef}}}
                            defaultValue={visit.note}/>
                        </Grid>
                    </Grid>
                    <div>
                        <button className="btn btn-info mx-1"
                        onClick={handleClose}>
                            Close
                        </button>
                        <button className="btn btn-dark"
                        onClick={handleSaveChanges}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </Modal>

        )
    }

    return (
        <>
        {
            visit ? <VisitModal/>: null
        }
        <div>
            <button className="btn btn-info m-2">
                Add Note
            </button>
        </div>

        <div className="table-container">
        <Table tableOrder={visitOrder}
        tableList={props.visits}
        rowClickEvent={handleRowClick}/>
        </div>
        </>
    )
}