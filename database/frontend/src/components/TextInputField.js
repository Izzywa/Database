import React from "react";
import TextField from '@mui/material/TextField';

export default function TextInputField(props){
    return (
        <div className="input-group flex-nowrap">
        <span className="input-group-text" >{props.label}</span>
        <input 
        type={props.type} 
        className="form-control" 
        placeholder={props.label} 
        aria-label={props.label}
        ref={props.inputRef}/>
        </div>
    )
}