import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2"
import { Title } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { red, blue, yellow, green, purple } from "@mui/material/colors";

export default function PieChart(props) {
    Chart.register(Title)
    Chart.register(ChartDataLabels);

    const data = {
            labels: props.labels,
            datasets: [{
              label: props.datasetLabel,
              data: props.data,
              backgroundColor: [
                red[300],
                blue[300],
                green[300],
                yellow[300],
                purple[300]
              ],
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