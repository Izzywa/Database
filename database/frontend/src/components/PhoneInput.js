import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from 'react-select';

export default function PhoneInput(props){
    const [options, setOptions] = useState([]);
    const pathname = useLocation();
    useEffect(() => {
        fetch('backend/dial_codes')
        .then(response => response.json())
        .then(result => setOptions(result))
        .catch(error => console.log(error))
    }, [pathname])
    return(
        <>
        <div className="input-group">
        <span className="input-group-text" >Phone</span>
            <Select options={options}
            onChange={(choice) => props.selection(choice.value)}/>
            <input type="number"
            ref={props.inputRef}
            className="form-control"
            placeholder="ex: 123456"
            aria-label="Phone Number"/>
        </div>
        </>
    )
}