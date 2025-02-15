import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2"
import { Title } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { red, blue, yellow, green, purple } from "@mui/material/colors";

export default function PieChart(props) {
    Chart.register(Title)
    Chart.register(ChartDataLabels);

    let backgroundColor = []
    let startColor = 200;

    while (backgroundColor.length < props.labels.length) {
        backgroundColor.push(
            red[startColor], 
            blue[startColor], 
            yellow[startColor],
            green[startColor],
            purple[startColor]
        )
        startColor += 200
    }

    const data = {
            labels: props.labels,
            datasets: [{
              label: props.datasetLabel,
              data: props.data,
              backgroundColor: backgroundColor,
              hoverOffset: 4
            }]
          };

    return (
        <>
        <Pie options={{
            plugins: {
                title: {
                    display: true,
                    text: props.title
                },
                datalabels: props.formatter
            }
        }}
        data={data} 
        />
        </>
    )
}