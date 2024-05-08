import React from "react";
import { MantineProvider, Tabs } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import ImageUpload from "./components/ImageUpload";
import SearchComponent from "./components/Search";
import "./styles/styles.css";
import { IconPhoto, IconFileSearch } from "@tabler/icons-react";

function App() {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Notifications position="top-right" />
			<div className="app">
				<h1>Image Annotation Application</h1>
				<Tabs defaultValue="upload">
					<Tabs.List grow>
						<Tabs.Tab
							value="upload"
							leftSection={<IconPhoto size={20} />}
						>
							Image annotate
						</Tabs.Tab>
						<Tabs.Tab
							value="search"
							leftSection={<IconFileSearch size={20} />}
						>
							Search
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="upload" pt="xs">
						<ImageUpload />
					</Tabs.Panel>

					<Tabs.Panel value="search" pt="xs">
						<SearchComponent />
					</Tabs.Panel>
				</Tabs>
			</div>
		</MantineProvider>
	);
}

export default App;
