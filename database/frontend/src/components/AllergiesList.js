import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid2';
import Paginator from "./Paginator";
import Select from 'react-select';

export default function AllergiesList(props) {
    const [OfficialName, setOfficialName] = useState(true)
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [allergiesList, setAllergiesList] = useState([]);
    const [viewOnly, setViewOnly] = useState(true)
    const [options, setOptions] = useState([])
    const [selection, setSelection] = useState(null)

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
        },[OfficialName, page])

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
                setPage={setPage}
                />
                </div>
            
        }
            </div>
        )
    }

    function handleAddAllergies(){
        console.log(selection)
    }

    function AddAllergies() {
        return (
            <div>
                <Select options={options}
                onChange={(choice) => setSelection(choice.value)}/>
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
        <button 
        onClick={handleAllergyName}
        className="btn btn-info my-1">
            {OfficialName ? 'Trade Name': 'Official Name'}
        </button>
        <button 
        onClick={handleEditAllergies}
        className="btn btn-dark mx-1" >
            {viewOnly ? "Edit Allergies": "Cancel"}
        </button>
        </>
    )
}