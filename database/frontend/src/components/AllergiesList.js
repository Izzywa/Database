import React, { useState, useEffect, useRef } from "react";
import Grid from '@mui/material/Grid2';
import Paginator from "./Paginator";
import Select from 'react-select';
import csrftoken from "./CSRFToken";
import { Alert } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function AllergiesList(props) {
    const [OfficialName, setOfficialName] = useState(true)
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [allergiesList, setAllergiesList] = useState([]);
    const [viewOnly, setViewOnly] = useState(true)
    const [options, setOptions] = useState([])
    const [alert, setAlert] = useState([])
    const [count, setCount] = useState(0)

    useEffect(() => {
            fetch('/backend/allergies/' 
                + props.id 
                + (OfficialName ? '/official' : '/trade')
                + "?page=" + page
            )
            .then(response => {
                return response.json()
            })
            .then(result => {
                setAllergiesList(result.result)
                setNumPages(result.num_pages)
            })
            .catch(error => console.log(error))
        },[OfficialName, page, count])

    useEffect(() => {
        fetch('/backend/ab_list?'
            + (OfficialName ? "name=official" : "name=trade")
        )
        .then(response => response.json())
        .then(result => setOptions(result))
        .catch(error => console.log(error))
    },[OfficialName])
    
    function handleAllergyName() {
        setOfficialName((prev) => !prev)
        setPage(1)
    }

    function handleEditAllergies() {
        setViewOnly((prev) => !prev)
    }

    function handleDelete(e) {
        const ab = (e.target.closest("[data-ab]").dataset.ab)
        const requestOptions = {
            method: ('DELETE'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken()
            },
            mode: 'same-origin',
            body: JSON.stringify({
                ab: ab
            })
        }

        fetch('/backend/allergies/' + props.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            setAlert(result)
            if (!result.error){
                setAlert([])
                setCount(count + 1)
            }
        }).catch(error => console.log(error))
    }

    function ViewOnly() {
        return (
            <div className="py-2">
            <h6 className="text-decoration-underline">
                Antibiotic {OfficialName ? 'Official Name' : 'Trade Name'}
                </h6>
            {
            allergiesList.length == 0 ? <h6>No Allergies</h6>
            :
            <div>
                <Grid container>
                    {allergiesList.map((item, index) => {
                        return(
                            <Grid 
                            size={{ xs: 12, md: 6}}
                            key={index}
                            padding={1}
                            >
                                <span className="allergy-ab">
                                    - {String(item.name).charAt(0).toUpperCase()
                                    + String(item.name).slice(1)}
                                </span>
                                { viewOnly ? null : 
                                <span className="px-2">
                                    <DeleteForeverIcon color="secondary"
                                    data-ab={item.ab} onClick={handleDelete}
                                    />
                                    </span>
                                }
                                </Grid>
                        )
                    })}
                </Grid>
                <Paginator
                count={numPages}
                page={page}
                setPage={setPage}
                />
                </div>
            
        }
            </div>
        )
    }

    function AddAllergies() {
        const [selection, setSelection] = useState(null)

        function handleAddAllergies(){
            const requestOptions = {
                method: ('POST'),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken()
                },
                mode: 'same-origin',
                body: JSON.stringify({
                    ab: selection
                })
            }
            
            if (selection){
    
                fetch('/backend/allergies/' 
                        + props.id , requestOptions)
                .then(response => response.json())
                .then(result => {
                    setAlert(result)
                    if (!result.error) {
                        setAlert([])
                        setCount(count + 1)
                    }
                }).catch(error => console.log(error))
            }
        }

        return (
            <div>
                <Select options={options}
                onChange={(choice) => setSelection(choice.value)}/>
                { alert.length == 0 ? null : <Alert severity="warning">{alert.message}</Alert>}
                <button className="btn btn-dark m-1"
                onClick={handleAddAllergies}
                >
                    Add
                </button>
            </div>
        )
    }

    return (
        <>
        <ViewOnly/>
        {
            viewOnly ? null : <AddAllergies/>
        }
        <div className="py-2">
        <button 
        onClick={handleAllergyName}
        className="btn btn-info my-1">
            {OfficialName ? 'Trade Name': 'Official Name'}
        </button>
        <button 
        onClick={handleEditAllergies}
        className="btn btn-dark mx-1" >
            {viewOnly ? "Edit Allergies": "Cancel Edit"}
        </button>
        </div>
        </>
    )
}