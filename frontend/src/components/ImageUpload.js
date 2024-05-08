import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import ImageUploadDropzone from "./ImageUploadDropzone";
import ImageAnnotationViewer from "./Viewer";
import "@mantine/notifications/styles.css";
import { IconUpload } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

function ImageUpload() {
	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);

	const handleDrop = acceptedFiles => {
		const newFiles = acceptedFiles.map(file => ({
			file,
			annotation: "",
			id: file.name + Date.now()
		}));
		setFiles(prevFiles => [...prevFiles, ...newFiles]);
	};

	const handleAnnotationChange = (index, newAnnotation) => {
		const updatedFiles = files.map((item, idx) =>
			idx === index ? { ...item, annotation: newAnnotation } : item
		);
		setFiles(updatedFiles);
	};

	const handleSubmit = async event => {
		event.preventDefault();
		if (files.some(file => !file.annotation)) {
			notifications.show({
				title: "Missing Annotations",
				message: "Please select annotations for all images.",
				color: "red",
				autoClose: 5000
			});
			return;
		}

		const formData = new FormData();
		files.forEach(({ file, annotation }) => {
			formData.append("images", file);
			formData.append("annotations[]", annotation);
		});

		try {
			setUploading(true);
			const response = await axios.post(
				"http://localhost:8000/upload",
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			notifications.show({
				title: "Success",
				message: "Images and annotations uploaded successfully!",
				color: "green",
				autoClose: 5000
			});
			console.log(response.data);
			setFiles([]);
		} catch (error) {
			console.error("Error uploading images:", error);
			notifications.show({
				title: "Upload Failed",
				message: "Failed to upload images and annotations.",
				color: "red",
				autoClose: 5000
			});
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = index => {
		setFiles(files.filter((_, idx) => idx !== index));
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
			<AnimatePresence>
				{files.map((item, index) => (
					<ImageAnnotationViewer
						key={item.id}
						file={item.file}
						annotation={item.annotation}
						onAnnotationChange={newAnnotation =>
							handleAnnotationChange(index, newAnnotation)
						}
						onRemove={() => handleRemove(index)}
					/>
				))}
				<motion.div
					layout
					transition={{ duration: 0.25, ease: "easeInOut" }}
				>
					<ImageUploadDropzone
						onDrop={handleDrop}
						disabled={uploading}
					/>
					<Button
						type="submit"
						disabled={uploading || files.length === 0}
						variant="gradient"
						gradient={{ from: "grape", to: "blue", deg: 90 }}
						leftSection={<IconUpload size={20} />}
					>
						{uploading
							? "Uploading..."
							: "Upload Images and Annotations"}
					</Button>
				</motion.div>
			</AnimatePresence>
		</form>
	);
}

export default ImageUpload;
