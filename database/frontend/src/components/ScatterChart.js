import React from "react";
import Chart from "chart.js/auto";
import { red } from "@mui/material/colors";
import { plugins, Title } from "chart.js";
import { Scatter } from 'react-chartjs-2';


export default function ScatterChart(props){
    Chart.register(Title)
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
        },
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: props.title
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