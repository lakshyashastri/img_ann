import React from "react";
import ImageUpload from "./components/ImageUpload";
// import ImageList from "./components/ImageList";
import "./styles/styles.css";

function App() {
	return (
		<div className="app">
			<h1>Image Annotation Application</h1>
			<ImageUpload />
			{/* <ImageList /> */}
		</div>
	);
}

export default App;
