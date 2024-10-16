import React from "react";
import ReactDOM from "react-dom/client"; // ReactDOM from 'react-dom' 대신 'react-dom/client' 사용
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!); // Non-null assertion 사용
root.render(<App />);
