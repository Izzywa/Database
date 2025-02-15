import React from "react";
import Chart from "chart.js/auto";
import { Title } from "chart.js";
import { Bar } from "react-chartjs-2";
import { red, blue, yellow, green, purple } from "@mui/material/colors";
import { alpha } from "@mui/material";

export default function BarChart(props){
    Chart.register(Title)

    const data = {
    labels: [['lorem', 'lorem', 'lorem'],2,3,4,5],
    datasets: [{
        label: props.datasetLabel,
        data: [20,30,40,50,60],
        backgroundColor: [
        alpha(red[300],0.2),
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
        ],
        borderWidth: 1
    }]
    };

    function FallbackContent() {
        return(
            <p>Cannot Render chart</p>
        )
    }

    return(
        <>
        <Bar 
        data={data}
        options={{
            plugins: {
                title: {
                    display: true,
                    text: props.title
                },
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            return context[0].label.replaceAll(',', ' ')
                        }
                    }
                    
                }
            },
            maintainAspectRatio: false
        }}
        fallbackContent={<FallbackContent/>}/>
        </>
    )
}