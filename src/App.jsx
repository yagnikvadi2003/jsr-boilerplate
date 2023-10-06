import React, { useState } from "react";

import reactLogo from "@assets/svg/react.svg";

import "./App.css";

const App = () => {
	const [count, setCount] = useState(0);

	return (
		<React.Fragment>
			<div>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount(count => count + 1)}>count is {count}</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</React.Fragment>
	);
};

export default App;
