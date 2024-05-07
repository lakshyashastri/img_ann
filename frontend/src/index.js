import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import React from "react";
import App from "./App";
import "@mantine/core/styles.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<App />
		</MantineProvider>
	</React.StrictMode>
);