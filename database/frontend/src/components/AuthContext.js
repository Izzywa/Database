import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [authenticated ,setAuthenticated] = useState(false)

    const checkAuth = useCallback(() => {
        setIsLoading(true)
        fetch('backend/auth_check')
        .then(response => response.json())
        .then(result => {
            setAuthenticated(result.authenticated)
        })
        .catch(error => {
            console.log(error)
            setAuthenticated(false)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [authenticated])

    return(
        <AuthContext.Provider value={{ authenticated, checkAuth, isLoading }}>
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