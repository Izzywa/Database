import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./login";
import Home from "./Home";

export default function App() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="home" element={<Home/>}/>
        </Routes>
    </BrowserRouter>
    )
}