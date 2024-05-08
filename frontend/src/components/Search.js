import React, { useState } from "react";
import axios from "axios";
import {
	Autocomplete,
	Button,
	Image,
	Group,
	Container,
	Text
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch } from "@tabler/icons-react";

function ImageSearch() {
	const [annotation, setAnnotation] = useState("");
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);

	const searchImages = async () => {
		if (!annotation) {
			notifications.show({
				title: "Search Error",
				message: "Please enter an annotation to search.",
				color: "yellow",
				autoClose: 5000
			});
			return;
		}
		setLoading(true);
		try {
			const response = await axios.get(`http://localhost:8000/search`, {
				params: { annotation }
			});
			setImages(response.data);
			if (response.data.length === 0) {
				notifications.show({
					title: "No Results",
					message: "No images found for this annotation.",
					color: "blue",
					autoClose: 5000
				});
			}
		} catch (error) {
			console.error("Search failed:", error);
			if (error.response && error.response.status === 404) {
				notifications.show({
					title: "No Images Found",
					message: "No images found for the specified annotation.",
					color: "blue",
					autoClose: 5000
				});
			} else {
				notifications.show({
					title: "Search Failed",
					message: "Failed to retrieve images due to an error.",
					color: "red",
					autoClose: 5000
				});
			}
		} finally {
			setLoading(false);
			setAnnotation("");
		}
	};

	return (
		<Container>
			<Autocomplete
				placeholder="Type to search..."
				value={annotation}
				onChange={setAnnotation}
				data={[
					"airplane",
					"car",
					"bird",
					"cat",
					"deer",
					"dog",
					"frog",
					"horse",
					"ship",
					"truck"
				]}
				onKeyPress={event => {
					if (event.key === "Enter") {
						searchImages();
					}
				}}
			/>
			<Button
				onClick={searchImages}
				leftSection={<IconSearch size={14} />}
				loading={loading}
				style={{ marginTop: "10px" }}
				variant="gradient"
				gradient={{ from: "grape", to: "blue", deg: 90 }}
			>
				Search
			</Button>
			<Group position="center" spacing="lg" style={{ marginTop: 20 }}>
				{images.map(image => (
					<div key={image.image_id} style={{ textAlign: "center" }}>
						<Image
							src={`http://localhost:8000/image/${image.image_id}`}
							alt={image.file_name}
							height={200}
							width={300}
							fit="cover"
							radius="md"
						/>
						<Text
							style={{
								backgroundColor: "#f0f0f0",
								padding: "5px 10px",
								borderRadius: "5px",
								marginTop: "10px",
								display: "inline-block"
							}}
						>
							{image.file_name}
						</Text>
					</div>
				))}
			</Group>
		</Container>
	);
}

export default ImageSearch;
