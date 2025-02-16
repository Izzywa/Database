import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingPage(props){
    return (
        <div className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '100%'}}>
            <CircularProgress/>
            <p>Loading...</p>
        </div>
    )
}