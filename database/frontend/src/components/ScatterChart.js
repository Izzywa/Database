import React from "react";
import { Scatter } from 'react-chartjs-2';
import { red } from "@mui/material/colors";

export default function ScatterChart(props){
    const data = {
        datasets: [{
          label: props.label,
          data: props.data,
          backgroundColor: red[200]
        }],
      };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: props.xTitle
                }
            },
            y : {
                title: {
                    display: true,
                    text: props.yTitle
                }
            }
        }
    }

    return (
        <>
        <Scatter data={data}
        options={options}/>
        </>
    )
}