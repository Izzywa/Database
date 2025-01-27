import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute(){
    const { authenticated, checkAuth, isLoading } = useAuth();
    const { pathname } = useLocation();

    useEffect(() => {
        checkAuth()
    }, [pathname])
    
    if (isLoading) {
        return <div>Loading...</div>
    }
    else {
        return authenticated ? <Outlet /> : <Navigate to="/login"/>
    }
}