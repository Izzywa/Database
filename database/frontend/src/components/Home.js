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
import DateInput from "./DateInput";
import csrftoken from "./CSRFToken";
import Alert from '@mui/material/Alert';

export default function Home(props) {
    const [patientList, setPatientList] = useState([]);
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [createChecked, setCreateChecked] = useState(false)
    const idRef = useRef();
    const fullNameRef = useRef();
    const emailRef = useRef();
    const [residentCountry, setResidentCountry] = useState(null);
    const [birthCountry, setBirthCountry] = useState(null);
    const [dialCode, setDialCode] = useState(null);
    const phoneRef = useRef();
    const [birthDate, setBirthDate] = useState(null)
    const [error, setError] = useState([])

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
        if (createChecked) {
            setCreateChecked(false)
        }
        setError([])
    }

    function createSwitch() {
        setCreateChecked((prev) => !prev)
        if (checked) {
            setChecked(false)
        }
        setError([])
    }

    function handleSubmit() {
        let id = null
        if (idRef.current) {
            id = idRef.current.value
        }
        const name = fullNameRef.current.value
        const email = emailRef.current.value
        const phone = phoneRef.current.value

        if (checked) {
            fetch('backend/patients/search?' 
                + ('name=' + name)
                + "&" + (id ? 'id=' + id : null)
                + "&" +  ('email=' + email)
                + "&" + (birthDate ? 'bd=' + birthDate : null)
                + "&" +  (residentCountry ? 'rc=' + residentCountry : null)
                + "&" + (birthCountry ? 'bc=' + birthCountry : null)
                + "&" + (dialCode ? 'dc=' + dialCode : null)
                + "&" + (phone ? 'phone=' + phone : null)
            )
            .then(response => response.json())
            .then(result => {
                console.log(result)
                setPatientList(result.patients)
            })
            .catch(error => console.log(error))
        } else {
            const requestOptions = {
                method: ('POST'),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken()
                },
                mode: 'same-origin',
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    phone: (phone ? phone: null),
                    dial_code: dialCode,
                    birth_date: birthDate,
                    resident_country_code: residentCountry,
                    birth_country_code: birthCountry
                })
            }

            fetch('backend/patients', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.errors) {
                    setError(result.errors)
                } else {
                    navigate(`patient/${result.patient_id}`)
                    setError([])
                }
            })
            .catch(error => console.log(error))
        }

    }
    function AlertComponent({error}) {
        return(
            <Alert severity="error">
                {
                    Object.entries(error).map( ([key, value]) => {
                        const newKey = key.split('_').join(' ')
                        return (
                            <div key={key}>{newKey} : {value}</div>
                        )
                    })
                }
            </Alert>
        )
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
                 <FormControlLabel
                    control={<Switch checked={createChecked} 
                    onChange={createSwitch} />}
                    label="Register Patient"
                />
                <Collapse in={checked || createChecked}>
                    <div className="my-2">
                        {
                            error.length != 0 ?
                            <AlertComponent error={error}/>
                            : null
                        }
                        <Grid container>
                            <Grid size={{ xs: 12, md:4}}>
                            {!createChecked && checked ?
                            <TextInputField 
                            label={"Pateint ID"} 
                            inputRef={idRef}
                            type={"number"}/>
                            : null
                            }
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
                                <DateInput
                                label={"Birth date"}
                                setDate={setBirthDate}/>
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
                        className="btn btn-info m-1"
                        onClick={handleSubmit}
                        >
                            {checked ? 'Search': 'Register'}
                        </button>
                    </div>
                </Collapse>
                </div>
                <h3>Patients List</h3>
                <div className="table-container">
                { patientList.length == 0 ? <p>No patients</p> :
                <Table tableOrder={tableOrder} tableList={patientList} rowClickEvent={ptClick}/>
                }
                </div>
            </div>
        </div>
    )
}