import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./AuthContext";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2"

export default function AntibioticStatistics(props) {
    const { setBreadcrumbsList } = useAuth()
    const data = {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };

    useEffect(() => {
       setBreadcrumbsList({
        'Home': '/',
        'Antibiotic Statistics': '/AntibioticStatistics'
       })
    },[])
    return(
        <>
        <NavBar/>
        <div className="container">
            AntibioticStatistics
            <div>
                <Pie data={data}/>
            </div>
        </div>
        </>
    )
}