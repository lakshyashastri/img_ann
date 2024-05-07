import React from "react";
import ImageUpload from "./components/ImageUpload";
import "./styles/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

function App() {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Notifications position="bottom-right" />
			<div className="app">
				<h1>Image Annotation Application</h1>
				<ImageUpload />
			</div>
		</MantineProvider>
	);
}

export default App;
