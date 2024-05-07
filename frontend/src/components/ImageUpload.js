import React, { useState } from "react";
import axios from "axios";
import ImageUploadDropzone from "./ImageUploadDropzone";
import ImageAnnotationViewer from "./Viewer";
import { Button } from "@mantine/core";

function ImageUpload() {
	const [files, setFiles] = useState([]); // Stores array of {file, annotation}
	const [uploading, setUploading] = useState(false);

	const handleDrop = acceptedFiles => {
		const newFiles = acceptedFiles.map(file => ({ file, annotation: "" }));
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
			alert("Please select annotations for all images.");
			return;
		}

		const formData = new FormData();
		files.forEach(({ file, annotation }, index) => {
			formData.append(`images`, file);
			formData.append(`annotations[]`, annotation);
		});

		try {
			setUploading(true);
			const response = await axios.post(
				"http://localhost:8000/upload",
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			alert("Images and annotations uploaded successfully!");
			console.log(response.data);
			setFiles([]); // clear files after upload
		} catch (error) {
			console.error("Error uploading images:", error);
			alert("Failed to upload images and annotations.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
			{files.map((item, index) => (
				<ImageAnnotationViewer
					key={index}
					file={item.file}
					annotation={item.annotation}
					onAnnotationChange={newAnnotation =>
						handleAnnotationChange(index, newAnnotation)
					}
				/>
			))}

			<ImageUploadDropzone onDrop={handleDrop} disabled={uploading} />
			<Button
				type="submit"
				disabled={uploading || files.length === 0}
				variant="filled"
			>
				{uploading ? "Uploading..." : "Upload Images"}
			</Button>
		</form>
	);
}

export default ImageUpload;
