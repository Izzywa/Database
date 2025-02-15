import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from "./AuthContext";

export default function PrivateRoute(){
    const { authenticated, checkAuth, isLoading } = useAuth();
    const pathname = useLocation();

    useEffect(() => {
        checkAuth()
    }, [])
    
    if (isLoading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: '100vh'}}>
                <CircularProgress/>
                <p>Loading...</p>
            </div>
        )
    }
    else {
        return authenticated ? <Outlet /> : <Navigate to="/login"/>
    }
}