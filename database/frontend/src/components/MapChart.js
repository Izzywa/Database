import React, { useEffect, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function MapChart(props) {
    const [data, setData] = useState([
        {
            id: "US",
            value: 100
        }, {
            id: "GB",
            value: 100
        }
    ])
    
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
                projection: am5map.geoNaturalEarth1()
            })
        );

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
                    radius: 20,
                    fillOpacity: 0.7,
                    fill: am5.color(0xff0000),
                    cursorOverStyle: "pointer",
                    tooltipText: `{id}: {value}[/]`
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
                    fill: am5.color(0xffffff),
                    populateText: true,
                    centerX: am5.p50,
                    centerY: am5.p50,
                    textAlign: "center"
                }),
                dynamic: true
            })
        })

        // minValue and maxValue must be set for the animations to work
        bubbleSeries.set("heatRules", [
            {
                target: circleTemplate,
                dataField: "value",
                min: 10,
                max: 50,
                minValue: 0,
                maxValue: 100,
                key: "radius"
            }
        ])

        bubbleSeries.data.setAll(data)

        return () => {
            root.dispose();
        }
    })
    
    return (
        <>
        usestate
        <div id="chartdiv" style={{ width: "100vw", height: "100%"}}>
            
        </div>
        </>
    )
}