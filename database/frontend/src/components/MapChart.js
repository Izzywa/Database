import React, { useEffect, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { red, blueGrey } from "@mui/material/colors";
import { alpha } from "@mui/material";

export default function MapChart(props) {
    
    useLayoutEffect(() => {
        // create root
        let root = am5.Root.new("chartdiv")

        //set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ])

        // create chart
        let chart = root.container.children.push(
            am5map.MapChart.new(root, {
                projection: am5map.geoNaturalEarth1(),
                wheelY: "none"
            })
        );

        /*add title
        chart.children.unshift(am5.Label.new(root, {
            text: props.title,
            fontSize: 15,
            centerX: am5.percent(50),
            x: am5.percent(50),
        }))*/

        // create polygon series
        let polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow
            })
        );

        // create bubble series
        let bubbleSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                valueField: "value",
                calculateAggregates: true,
                polygonIdField: "id"
            })
        )

        // create circle template
        let circleTemplate = am5.Template.new({})

        bubbleSeries.bullets.push(function(root, series, dataItem) {
            let container = am5.Container.new(root, {});

            let circle = container.children.push(
                am5.Circle.new(root, {
                    radius: 8,
                    fillOpacity: 0.7,
                    fill: alpha(red[300], 0.5),
                    cursorOverStyle: "pointer",
                    tooltipText: `{name}: {value}[/]`
                }, circleTemplate)
            )

            return am5.Bullet.new(root, {
                sprite: container,
                dynamic: true
            })
        })

        bubbleSeries.bullets.push(function( root, series, dataItem) {
            return am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                    text: "{value.formatNumber('#.')}",
                    fill: blueGrey[900],
                    populateText: true,
                    centerX: am5.p50,
                    centerY: am5.p50,
                    textAlign: "center"
                }),
                dynamic: true
            })
        })

        /* minValue and maxValue must be set for the animations to work
        bubbleSeries.set("heatRules", [
            {
                target: circleTemplate,
                dataField: "value",
                min: 1,
                max: 2,
                minValue: 0,
                maxValue: 2,
                key: "radius"
            }
        ])*/

        bubbleSeries.data.setAll(props.data)

        return () => {
            root.dispose();
        }
    })
    
    return (
        <>
        <div>
            <p className="text-center">{props.title}</p>
        </div>
        <div id="chartdiv" style={{ width: "100%", height: "100%"}}>
            
        </div>
        </>
    )
}