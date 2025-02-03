import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid2';
import Paginator from "./Paginator";

export default function AllergiesList(props) {
    const [OfficialName, setOfficialName] = useState(true)
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [allergiesList, setAllergiesList] = useState([]);

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
    
    function handleAllergyName() {
        setOfficialName((prev) => !prev)
        setPage(1)
    }

    return (
        <>
        {
            allergiesList.length == 0 ? <h6>No Allergies</h6>
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
                setPage={setPage}
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
}