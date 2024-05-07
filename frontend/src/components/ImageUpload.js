import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
	const [file, setFile] = useState(null);
	const [annotation, setAnnotation] = useState("");
	const [uploading, setUploading] = useState(false);

	const handleFileChange = event => {
		setFile(event.target.files[0]); // Set the file to the first file if multiple files were selected (for now)
	};

	const handleAnnotationChange = event => {
		setAnnotation(event.target.value);
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
				{
					headers: {
						"Content-Type": "multipart/form-data"
					}
				}
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
			<label htmlFor="image-upload">Choose an image:</label>
			<input
				id="image-upload"
				type="file"
				onChange={handleFileChange}
				disabled={uploading}
			/>
			<label htmlFor="annotation-select">Choose an annotation:</label>
			<select
				id="annotation-select"
				value={annotation}
				onChange={handleAnnotationChange}
				disabled={uploading}
			>
				<option value="">Select Annotation</option>
				<option value="airplane">Airplane</option>
				<option value="car">Car</option>
				<option value="bird">Bird</option>
				<option value="cat">Cat</option>
				<option value="deer">Deer</option>
				<option value="dog">Dog</option>
				<option value="frog">Frog</option>
				<option value="horse">Horse</option>
				<option value="ship">Ship</option>
				<option value="trucks">Truck</option>
			</select>
			<button type="submit" disabled={uploading}>
				{uploading ? "Uploading..." : "Upload Image"}
			</button>
		</form>
	);
}

export default ImageUpload;
