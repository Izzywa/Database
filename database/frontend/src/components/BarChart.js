import React from "react";
import Chart from "chart.js/auto";
import { elements, Title } from "chart.js";
import { Bar } from "react-chartjs-2";
import { red, blue, yellow, green, purple } from "@mui/material/colors";
import { alpha } from "@mui/material";

export default function BarChart(props){
    Chart.register(Title)
    let labels = []
    props.labels.forEach(element => {
        labels.push(element.split(' '))
    });

    let borderColor = [];
    let backgroundColor = [];
    let startColor = 200

    while (borderColor.length < props.labels.length) {
        borderColor.push(
            red[startColor],
            blue[startColor],
            yellow[startColor],
            green[startColor],
            purple[startColor]
        )
        startColor =+ 200
    }

    const data = {
    labels: labels,
    datasets: [{
        label: props.datasetLabel,
        data: props.data,
        backgroundColor: [
        alpha(red[300],0.2),
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: borderColor,
        borderWidth: 1
    }]
    };

    console.log(borderColor)

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