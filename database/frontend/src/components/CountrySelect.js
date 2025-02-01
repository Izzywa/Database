import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from 'react-select';

export default function CountrySelect(props) {
    const [options, setOptions] = useState([])
    const pathname = useLocation()
    
    useEffect(() => {
        fetch('backend/countries')
        .then(response => response.json())
        .then(result => setOptions(result))
        .catch(error => console.log(error))
    },[pathname])

    return(
        <>
        <div>
        <span className="input-group-text" >{props.label}</span>
            <Select options={options}
            onChange={(choice) => console.log(choice)}/>
        </div>
        </>
    )
}