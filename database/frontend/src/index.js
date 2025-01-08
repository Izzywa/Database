import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App"

const appDiv = createRoot(document.getElementById("App"))
appDiv.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)