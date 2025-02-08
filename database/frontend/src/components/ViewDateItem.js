import React from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";

export default function ViewDateItem(props) {
    const { id, date } = useParams();
    return(
        <>
        <NavBar/>
        <div className="container">
        <p>id {id}</p>
        <p> date {date}</p>
        </div>
        </>
    )
}