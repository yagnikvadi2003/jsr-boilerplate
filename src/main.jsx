// @ts-nocheck
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";

/**
 * Retrieves the HTML container element with the id 'root'.
 * This is where the React application will be rendered.
 *
 * @type {HTMLElement}
 */
const container = document.getElementById("root");

if (!container) {
	throw new Error("Failed to find the root element");
}

/**
 * Creates a root instance for rendering React components within the container.
 * Use `createRoot(container)` if you are using React version without Concurrent Mode.
 *
 * @type {Root}
 */
const root = createRoot(container); // createRoot(container!) if you use Typescript

/**
 * Renders the main application component wrapped in React's StrictMode.
 * This enforces certain development practices and checks for potential issues.
 * The main application component is the entry point for the React application.
 */
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
