import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./login";
import Home from "./Home";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

export default function App() {
    return(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="login" element={<Login/>} />
                <Route element={<PrivateRoute/>}>
                {" "}
                <Route path="/" element={<Home/>}/>
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
    )
}