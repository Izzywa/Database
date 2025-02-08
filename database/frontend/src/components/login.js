import React, { useRef, useState } from "react";
import csrftoken from "./CSRFToken";
import { useAuth } from "./AuthContext";

export default function Login(props) {
    const { setAuthenticated } = useAuth();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState({
        error: false,
        message: ''
    });

    function handleLogin() {
        const requestOptions = {
            method: ('POST'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken()
            },
            mode: 'same-origin',
            body: JSON.stringify({
                username: usernameRef.current.value.trim(),
                password: passwordRef.current.value.trim()
            })
        }

        fetch('backend/login', requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (!result.error){
                setAuthenticated(true)
                window.location.href = "/"
            } else {
                setError(result)
                throw new Error(result.message)
            }
        })
        .catch(error => console.log(error))
        
    }

    return (
        <div className="container d-flex justify-content-center align-items-center login-container">
            <div className="login-form">
                <h1>LOGIN</h1>
                {error.error ? 
                <p style={{color: 'red'}}> {error.message} </p>
                :null}
                <input 
                className="m-2"
                type="text"
                placeholder="username"
                ref={usernameRef}
                />
                <input 
                className="m-2"
                type="password"
                placeholder="password"
                ref={passwordRef}
                />
                <button 
                className="m-2 btn btn-success"
                onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    )
}