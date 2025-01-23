import React from "react";
import csrftoken from "./CSRFToken";

export default function Login(props) {
    function handleLogin() {
        const requestOptions = {
            method: ('POST'),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken()
            },
            mode: 'same-origin',
            body: JSON.stringify({
                username: "username"
            })
        }

        fetch('backend/login', requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log(error))
    }

    return (
        <div className="container d-flex justify-content-center align-items-center login-container">
            <div className="login-form">
                <h1>LOGIN</h1>
                <input 
                className="m-2"
                type="text"
                placeholder="username"
                />
                <input 
                className="m-2"
                type="text"
                placeholder="password"
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