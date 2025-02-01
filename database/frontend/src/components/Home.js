import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import Table from "./Table";
import { useNavigate } from "react-router-dom";
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid2 as Grid } from "@mui/material";
import TextInputField from "./TextInputField";
import CountrySelect from "./CountrySelect";
import PhoneInput from "./PhoneInput";

export default function Home(props) {
    const [patientList, setPatientList] = useState(null);
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const idRef = useRef();
    const fullNameRef = useRef();
    const emailRef = useRef();
    const [residentCountry, setResidentCountry] = useState(null);
    const [birthCountry, setBirthCountry] = useState(null);
    const [dialCode, setDialCode] = useState(null);
    const phoneRef = useRef();

    useEffect(() => {
        fetch('backend/patients')
        .then(response => response.json())
        .then(result => {
           setPatientList(result)
        }).catch(error => console.log(error))
    },[]);

    const tableOrder = {
        'id':'id',
        'full_name': 'Full name',
        'email': 'email',
        'age': 'Age',
        'phone_number': 'Phone Number',
    }

    function ptClick(e) {
        const id = (e.target.closest("[data-id]").dataset.id)
        navigate(`patient/${id}`)
    }

    function searchSwitch(){
        setChecked((prev) => !prev)
    }

    function handleSearch() {
        console.log(dialCode + phoneRef.current.value)
    }

    return (
        <div>
            <NavBar/>
            <div className="container">
                <div className="search-container">
                <FormControlLabel
                    control={<Switch checked={checked} 
                    onChange={searchSwitch} />}
                    label="Search Patient"
                />
                <Collapse in={checked}>
                    <div className="my-2">
                        <Grid container>
                            <Grid size={{ xs: 12, md:4}}>
                            
                            <TextInputField 
                            label={"Pateint ID"} 
                            inputRef={idRef}
                            type={"number"}/>
                            </Grid>
                            <Grid size={{ xs: 12, md:8}}>
                            <TextInputField 
                            label={"Full name"}
                            inputRef={fullNameRef}
                            type={"text"}
                            />
                            </Grid>
                            <Grid size={{ xs: 12, md:5}}>
                            <TextInputField 
                            label={"email"}
                            inputRef={emailRef}
                            type={"email"}
                            />
                            </Grid>
                            <Grid size={{ xs: 12, md:7}}>
                                <PhoneInput
                                inputRef={phoneRef}
                                selection={setDialCode}/>
                            </Grid>
                            <Grid size={{ xs: 12, md:6}}>
                                birth date
                            </Grid>
                            <Grid size={{ xs: 6, md:3}}>
                                <CountrySelect 
                                label={"Resident Country"}
                                selection={setResidentCountry}/>
                            </Grid>
                            <Grid size={{ xs: 6, md:3}}>
                                <CountrySelect 
                                label={"Birth Country"}
                                selection={setBirthCountry}/>
                            </Grid>
                        </Grid>
                        <button 
                        className="btn btn-info my-1"
                        onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </Collapse>
                </div>
                <h3>Patients List</h3>
                <div className="table-container">
                { patientList == null ? null :
                <Table tableOrder={tableOrder} tableList={patientList} rowClickEvent={ptClick}/>
                }
                </div>
            </div>
        </div>
    )
}