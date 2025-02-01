import React from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';

export default function DateInput(props) {
    return(
        <>
        <LocalizationProvider dateAdapter={AdapterDayjs}
        adapterLocale={'en-gb'}>
        <DemoContainer components={['DatePicker']}>
            <DatePicker label={props.label} 
            onChange={(date) => props.setDate(date.$d)}/>
        </DemoContainer>
        </LocalizationProvider>
        </>
    )
}