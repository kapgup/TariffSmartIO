import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "./lib/analytics";

// Initialize Google Analytics
initGA();

// Mount the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No root element found");
const root = createRoot(rootElement);
root.render(<App />);
