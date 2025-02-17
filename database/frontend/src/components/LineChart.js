import React from "react";
import { Line } from 'react-chartjs-2';
import { blue } from "@mui/material/colors";

export default function LineChart(props) {
    const labels = props.labels
    const data = {
    labels: labels,
    datasets: [{
        label: props.datasetLabel,
        data: props.data,
        fill: false,
        borderColor: blue[200],
        tension: 0.1
    }]
    };
    return (
        <>
        <Line data={data}
        options={props.options}/>
        </>
    )
}