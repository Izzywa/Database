import React, { useRef, useState } from "react";
import Table from "./Table";
import {  Modal } from "@mui/material";
import {Grid2 as Grid} from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import csrftoken from "./CSRFToken";
import Alert from "@mui/material/Alert";

export default function VisitList(props) {
    const visitOrder = {
        'note': 'Notes',
        'modified_timestamp': 'Last Modified'
    }
    const [visit, setVisit] = useState(null)
    const [open, setOpen] = useState(false)
    const textRef = useRef();
    const [openChild, setOpenChild] = useState(false)
    const [AddNote, setAddNote] = useState(false)
    const [error, setError] = useState(null)

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
        if (AddNote) {
            setAddNote(false)
        }
    }

    function handleCloseChild() {
        setOpenChild(false)
    }

    function handleDeleteNote () {
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

        fetch(`/backend/visit_note/${visit.id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                props.setCount(props.count + 1)
            }
        }).catch(error => console.log(error))
    }

    function handleSaveChanges() {
        const note = textRef.current.value

        const requestOptions = {
            method: ('POST'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken()
            },
            mode: 'same-origin',
            body: JSON.stringify({
                note: note,
                visit_date: props.date,
                patient: props.id
            })
        }

        if (AddNote) {
            fetch('/backend/visit_note', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    setError(result)
                } else {
                    props.setCount(props.count + 1)
                }
            }).catch(error => console.log(error))
        }
    }

    function handleDeleteBtn(id) {
        setOpenChild(true)
    }

    function handleAddBtn() {
        setAddNote(true)
        setOpen(true)
    }
    
    function ChildModal() {
        return (
        <Modal
        open={openChild}>
            <div className="modal-div">
                <div className="container p-3 bg-light">
                    <p>
                Delete Note #{visit ? visit.id : null} ?
                </p>
                <div>
                <button className="btn btn-info"
                onClick={handleCloseChild}>
                    Close
                </button>
                <button className="btn btn-dark m-1" 
                onClick={handleDeleteNote}>
                    Delete
                </button>
                </div>
                </div>
            </div>
        </Modal>
        )
    }

    function VisitModal() {
        return (
            <Modal
            open={open}>
            <div className="modal-div">
                <ChildModal />
                <div className="container p-3 bg-light">
                    <div>
                        {
                            error ? 
                            <Alert severity="error">
                                <ul>
                                {
                                    typeof error.message === 'object' ?
                                        Object.entries(error.message).map( ([key, value]) => {
                                            let renameKey = key.split('_').join(' ')
                                            renameKey = renameKey.charAt(0).toUpperCase() + renameKey.slice(1)
                                            return (
                                                <li key={key}>{renameKey} : {value}</li>
                                            )
                                        })
                                    : <li>{error.message}</li>
                                }
                                </ul>
                            </Alert>
                            :null
                        }
                        </div>
                    <Grid container>
                        {
                            AddNote ? <h5>New Note</h5> :
                        
                            <DeleteForeverIcon color="secondary"
                            onClick={() => handleDeleteBtn(visit.id)}/>
                        }
                        <Grid size={12} >
                            <Textarea className="my-2"
                            slotProps={{textarea: {ref: textRef}}}
                            defaultValue={AddNote ? '' : visit.note}/>
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
            visit || AddNote ? <VisitModal/>: null
        }
        <div>
            <button className="btn btn-info m-2"
            onClick={handleAddBtn}>
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