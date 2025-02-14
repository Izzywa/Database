import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2"
import { Title } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function PieChart(props) {
    Chart.register(Title)
    Chart.register(ChartDataLabels);

    const data = {
            labels: props.labels,
            datasets: [{
              label: props.datasetLabel,
              data: props.data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(144, 241, 181)',
                "#ce93d8"
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