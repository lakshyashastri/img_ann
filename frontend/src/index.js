import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import React from "react";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container); // create a root.

root.render(
	<React.StrictMode>
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<App />
		</MantineProvider>
	</React.StrictMode>
);
