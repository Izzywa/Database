import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute(){
    const { authenticated, checkAuth, isLoading } = useAuth();

    useEffect(() => {
        checkAuth()
    }, [])
    
    if (isLoading) {
        return <div>Loading...</div>
    }
    else {
        console.log(authenticated)
        return authenticated ? <Outlet /> : <Navigate to="/login"/>
    }
}