import React, { useState } from "react";
import axios from "axios";
import {
	Autocomplete,
	Button,
	Image,
	Group,
	Container,
	Text,
	Divider,
	Menu,
	Modal,
	Stack
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
	IconSearch,
	IconX,
	IconEdit,
	IconSettings,
	IconTrash
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

function ImageSearch({ onFocusChange }) {
	const [annotation, setAnnotation] = useState("");
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [lastSearch, setLastSearch] = useState("");
	const [hoveredImageId, setHoveredImageId] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentImageId, setCurrentImageId] = useState(null);
	const [modalAnnotation, setModalAnnotation] = useState("");

	const searchImages = async () => {
		if (!annotation) {
			notifications.show({
				title: "Search Error",
				message: "Please enter an annotation to search.",
				color: "yellow",
				autoClose: 5000
			});
			setImages([]);
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
			if (error.response && error.response.status === 404) {
				notifications.show({
					title: "No Images Found",
					message: "No images found for the specified annotation.",
					color: "blue"
				});
			} else {
				notifications.show({
					title: "Search Failed",
					message: "Failed to retrieve images due to an error.",
					color: "red",
					autoClose: 5000
				});
			}
			setImages([]);
		} finally {
			setLoading(false);
			setAnnotation("");
		}
	};

	const clearImages = () => {
		setLastSearch("");
		setImages([]);
	};

	const updateAnnotation = async () => {
		if (!modalAnnotation) {
			notifications.show({
				title: "Update Error",
				message: "The annotation cannot be empty.",
				color: "red",
				autoClose: 5000
			});
			return;
		}

		try {
			await axios.put(`http://localhost:8000/update/${currentImageId}`, {
				annotation: modalAnnotation
			});
			notifications.show({
				title: "Success",
				message: "Annotation updated successfully.",
				color: "green",
				autoClose: 5000
			});
			setIsEditModalOpen(false);
			clearImages();
			setModalAnnotation("");
		} catch (error) {
			console.error("Update failed:", error);
			notifications.show({
				title: "Update Failed",
				message: "Failed to update the annotation.",
				color: "red",
				autoClose: 5000
			});
		}
	};

	const confirmDeletion = async () => {
		try {
			await axios.delete(
				`http://localhost:8000/delete/${currentImageId}`
			);
			notifications.show({
				title: "Success",
				message: "Image deleted successfully.",
				color: "green",
				autoClose: 5000
			});
			setIsDeleteModalOpen(false);
			clearImages();
			setModalAnnotation("");
		} catch (error) {
			console.error("Deletion failed:", error);
			notifications.show({
				title: "Deletion Failed",
				message: "Failed to delete the image.",
				color: "red",
				autoClose: 5000
			});
		}
	};

	const options = [
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
	];

	return (
		<Container>
			<Autocomplete
				placeholder="Type to search..."
				value={annotation}
				onChange={setAnnotation}
				data={options}
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
							style={{
								textAlign: "center",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								width: "100%",
								maxWidth: "300px"
							}}
							layout
						>
							<div
								style={{
									position: "relative",
									width: "100%",
									maxWidth: "300px"
								}}
								onMouseEnter={() =>
									setHoveredImageId(image.image_id)
								}
								onMouseLeave={() => setHoveredImageId(null)}
							>
								<Image
									src={`http://localhost:8000/image/${image.image_id}`}
									alt={image.file_name}
									height={200}
									width={300}
									fit="cover"
									radius="md"
									style={{
										width: "100%",
										height: "auto"
									}}
								/>
								{hoveredImageId === image.image_id && (
									<Menu shadow="md" width={200}>
										<Menu.Target>
											<Button
												style={{
													position: "absolute",
													top: 10,
													right: 10
												}}
												variant="filled"
												radius="xl"
												size="xs"
											>
												<IconSettings />
											</Button>
										</Menu.Target>

										<Menu.Dropdown>
											<Menu.Item
												leftSection={<IconEdit />}
												onClick={() => {
													setCurrentImageId(
														image.image_id
													);
													setIsEditModalOpen(true);
												}}
											>
												Edit
											</Menu.Item>
											<Menu.Item
												leftSection={<IconTrash />}
												color="red"
												onClick={() => {
													setCurrentImageId(
														image.image_id
													);
													setIsDeleteModalOpen(true);
												}}
											>
												Delete
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								)}
							</div>
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
					<Modal
						opened={isEditModalOpen}
						onClose={() => setIsEditModalOpen(false)}
						title="Edit Annotation"
						overlayProps={{
							backgroundOpacity: 0.55,
							blur: 3
						}}
						transitionProps={{ transition: "skew-up" }}
						centered
					>
						<Stack align="center" justify="center" spacing="sm">
							<Autocomplete
								placeholder="Type to search..."
								value={modalAnnotation}
								onChange={setModalAnnotation}
								data={options}
								onKeyPress={event => {
									if (event.key === "Enter") {
										searchImages();
									}
								}}
								comboboxProps={{
									transitionProps: {
										transition: "pop",
										duration: 300
									}
								}}
							/>
							<Button
								onClick={updateAnnotation}
								variant="gradient"
								gradient={{
									from: "grape",
									to: "blue",
									deg: 90
								}}
							>
								Update
							</Button>
						</Stack>
					</Modal>

					<Modal
						opened={isDeleteModalOpen}
						onClose={() => setIsDeleteModalOpen(false)}
						title="Confirm Deletion"
						size="auto"
						overlayProps={{
							backgroundOpacity: 0.55,
							blur: 3
						}}
						transitionProps={{ transition: "skew-down" }}
						centered
					>
						<Stack align="center" justify="center" spacing="sm">
							<Text>
								Are you sure you want to delete this annotation?
							</Text>
							<Button
								onClick={confirmDeletion}
								variant="gradient"
								gradient={{
									from: "red",
									to: "orange",
									deg: 90
								}}
							>
								Delete
							</Button>
						</Stack>
					</Modal>
				</AnimatePresence>
			</Group>
		</Container>
	);
}

export default ImageSearch;
