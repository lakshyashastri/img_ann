import React, { useState } from "react";
import axios from "axios";
import ImageUploadDropzone from "./ImageUploadDropzone";
import ImageAnnotationViewer from "./Viewer";

function ImageUpload() {
	const [file, setFile] = useState(null);
	const [annotation, setAnnotation] = useState("");
	const [uploading, setUploading] = useState(false);

	const handleDrop = acceptedFiles => {
		if (acceptedFiles.length > 0) {
			setFile(acceptedFiles[0]);
		}
	};

	const handleAnnotationChange = newAnnotation => {
		setAnnotation(newAnnotation);
	};

	const handleSubmit = async event => {
		event.preventDefault();
		if (!file || !annotation) {
			alert("Please select an image and an annotation.");
			return;
		}

		const formData = new FormData();
		formData.append("image", file);
		formData.append("class_name", annotation);

		try {
			setUploading(true);
			const response = await axios.post(
				"http://localhost:8000/upload",
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);
			alert("Image and annotation uploaded successfully!");
			console.log(response.data);
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Failed to upload image and annotation.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<ImageUploadDropzone onDrop={handleDrop} disabled={uploading} />
			{file && (
				<ImageAnnotationViewer
					file={file}
					annotation={annotation}
					onAnnotationChange={handleAnnotationChange}
				/>
			)}
			<button type="submit" disabled={uploading}>
				{uploading ? "Uploading..." : "Upload Image"}
			</button>
		</form>
	);
}

export default ImageUpload;
