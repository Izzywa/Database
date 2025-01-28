import React, { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [authenticated ,setAuthenticated] = useState(false)
    const nav = useNavigate();

    const checkAuth = useCallback(() => {
        setIsLoading(true)
        fetch('backend/auth_check', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }
            })
        .then(response => {
            if (response.ok) {
                setAuthenticated(true)
            } else {
                setAuthenticated(false)
            }
        })
        .catch(error => alert(error))
        .finally(() => {
            setIsLoading(false)
        })
    }, [authenticated])

    const logout = () => {
        fetch('backend/logout')
        .then(response => {
            if (response.ok) {
                console.log("logout successful");
                nav("/login")
            } else {
                throw new error("error logging out")
            }
        })
    }

    return(
        <AuthContext.Provider value={{ authenticated, setAuthenticated, checkAuth, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth Error. useAuth should be in AuthProvider");
    }
    return context
}