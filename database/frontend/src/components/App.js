import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./login";
import Home from "./Home";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import ViewPatients from "./ViewPatient";
import ViewDateItem from "./ViewDateItem";

export default function App() {
    return(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="login" element={<Login/>} />
                <Route element={<PrivateRoute/>}>
                {" "}
                <Route path="patient/:id" element={<ViewPatients/>} />
                <Route path="/" element={<Home/>}/>
                <Route path="date/:id/:date" element={<ViewDateItem/>} />
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
    )
}