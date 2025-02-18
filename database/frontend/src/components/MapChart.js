import React, { useEffect, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

export default function MapChart(props) {
    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv")
        let chart = root.container.children.push(
            am5map.MapChart.new(root, {
                projection: am5map.geoNaturalEarth1()
            })
        );

        let poligonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow
            })
        );
        return () => {
            root.dispose();
        }
    })
    
    return (
        <>
        adding series
        <div id="chartdiv" style={{ width: "100%", height: "100%"}}>
            
        </div>
        </>
    )
}