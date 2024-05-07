import React from "react";
import ImageUpload from "./components/ImageUpload";
import "./styles/styles.css";

function App() {
	return (
		<div className="app">
			<h1>Image Annotation Application</h1>
			<ImageUpload />
		</div>
	);
}

export default App;
