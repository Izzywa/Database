import React, { useEffect, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

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
                projection: am5map.geoNaturalEarth1()
            })
        );

        // create polygon series
        let polygonSeries = chart.series.push(
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
        set themes
        <div id="chartdiv" style={{ width: "100%", height: "100%"}}>
            
        </div>
        </>
    )
}