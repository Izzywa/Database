import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingPage from "./LoadingPage";

export default function PrivateRoute(){
    const { authenticated, checkAuth, isLoading } = useAuth();
    const pathname = useLocation();

    useEffect(() => {
        checkAuth()
    }, [])
    
    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }
    else {
        return authenticated ? <Outlet /> : <Navigate to="/login"/>
    }
}