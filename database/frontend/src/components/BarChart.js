import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Title } from "chart.js";
import { Bar } from "react-chartjs-2";
import { red, blue, yellow, green, purple } from "@mui/material/colors";
import { alpha } from "@mui/material";

export default function BarChart(props){
    Chart.register(Title)
    let backgroundColor = []
    let borderColor = []
    let startColor = 200
    let labels = []

    const [barData, setBarData] = useState({
                labels: [],
                data: []
            });
    
    useEffect(() => {
        fetch('/backend/diagnosis_stats')
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
        .catch(error => console.log(error))
    },[])

    barData.labels.forEach(element => {
        labels.push(element.split(' '))
    });

    while (backgroundColor.length < barData.labels.length) {

        startColor += 200
    }


    const data = {
    labels: labels,
    datasets: [{
        label: props.datasetLabel,
        data: barData.data,
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
                            console.log(context[0].label)
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