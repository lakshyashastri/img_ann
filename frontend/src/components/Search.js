import React, { useState } from "react";
import axios from "axios";
import {
	Autocomplete,
	Button,
	Image,
	Group,
	Container,
	Text,
	Divider
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

function ImageSearch({ onFocusChange }) {
	const [annotation, setAnnotation] = useState("");
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [lastSearch, setLastSearch] = useState("");

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
			setLastSearch(annotation);
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
			notifications.show({
				title: "Search Failed",
				message: "Failed to retrieve images due to an error.",
				color: "red",
				autoClose: 5000
			});
		} finally {
			setLoading(false);
			setAnnotation("");
		}
	};

	const clearImages = () => {
		setLastSearch("");
		setImages([]);
	};

	return (
		<Container>
			<Autocomplete
				placeholder="Type to search..."
				value={annotation}
				onChange={setAnnotation}
				data={[
					"Airplane",
					"Bird",
					"Car",
					"Cat",
					"Deer",
					"Dog",
					"Frog",
					"Horse",
					"Ship",
					"Truck"
				]}
				onKeyPress={event => {
					if (event.key === "Enter") {
						searchImages();
					}
				}}
				comboboxProps={{
					transitionProps: { transition: "pop", duration: 300 }
				}}
			/>
			<Group
				position="center"
				style={{
					display: "flex",
					flexGrow: 1,
					justifyContent: "center",
					marginTop: 20
				}}
			>
				<AnimatePresence>
					<Button
						onClick={searchImages}
						leftSection={<IconSearch size={14} />}
						loading={loading}
						variant="gradient"
						gradient={{ from: "grape", to: "blue", deg: 90 }}
					>
						Search
					</Button>
					{images.length > 0 && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{
								type: "spring",
								stiffness: 260,
								damping: 20
							}}
						>
							<Button
								onClick={clearImages}
								leftSection={<IconX size={14} />}
								variant="subtle"
								color="red"
							>
								Clear
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</Group>

			{images.length > 0 && (
				<Divider label={lastSearch} labelPosition="center" my="md" />
			)}

			<Group justify="center" spacing="lg" style={{ marginTop: 20 }}>
				<AnimatePresence>
					{images.map(image => (
						<motion.div
							key={image.image_id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							style={{ textAlign: "center" }}
						>
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
						</motion.div>
					))}
				</AnimatePresence>
			</Group>
		</Container>
	);
}

export default ImageSearch;
