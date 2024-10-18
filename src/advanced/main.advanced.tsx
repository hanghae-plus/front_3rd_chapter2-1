// main.advanced.tsx
import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";

function main() {
  const appElement = document.getElementById("app");
  if (appElement) {
    const app = ReactDOM.createRoot(appElement);
    app.render(<App />);
  }
}

main();
