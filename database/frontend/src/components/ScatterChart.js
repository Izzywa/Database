import React from "react";
import { Scatter } from 'react-chartjs-2';
import { red } from "@mui/material/colors";

export default function ScatterChart(props){
    const data = {
        datasets: [{
          label: 'Scatter Dataset',
          data: [{
            x: -10,
            y: 0
          }, {
            x: 0,
            y: 10
          }, {
            x: 10,
            y: 5
          }, {
            x: 0.5,
            y: 5.5
          }],
          backgroundColor: red[200]
        }],
      };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'x axis title'
                }
            },
            y : {
                title: {
                    display: true,
                    text: 'y axis title'
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