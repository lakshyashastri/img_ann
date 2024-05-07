import React, { useState, useEffect } from "react";
import { Select, Text } from "@mantine/core";

function ImageAnnotationViewer({ file, annotation, onAnnotationChange }) {
	const [imageUrl, setImageUrl] = useState("");
	const [filename, setFilename] = useState("");

	useEffect(() => {
		if (file) {
			const url = URL.createObjectURL(file);
			setImageUrl(url);
			setFilename(file.name);

			// Cleanup the URL object when the component unmounts
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	}, [file]);

	const handleAnnotationChange = value => {
		if (onAnnotationChange) {
			onAnnotationChange(value);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				margin: "20px"
			}}
		>
			<div style={{ marginRight: "20px" }}>
				{file && (
					<>
						<img
							src={imageUrl}
							alt="Uploaded"
							style={{ width: "300px", height: "auto" }}
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
							{filename}
						</Text>
					</>
				)}
			</div>
			<div>
				<label htmlFor="annotation-select">Choose an annotation:</label>
				<Select
					id="annotation-select"
					value={annotation}
					onChange={handleAnnotationChange}
					placeholder="Select Annotation"
					style={{
						marginLeft: "10px",
						padding: "10px",
						width: "200px"
					}}
					data={[
						{ value: "airplane", label: "Airplane" },
						{ value: "car", label: "Car" },
						{ value: "bird", label: "Bird" },
						{ value: "cat", label: "Cat" },
						{ value: "deer", label: "Deer" },
						{ value: "dog", label: "Dog" },
						{ value: "frog", label: "Frog" },
						{ value: "horse", label: "Horse" },
						{ value: "ship", label: "Ship" },
						{ value: "truck", label: "Truck" }
					]}
				/>
			</div>
		</div>
	);
}

export default ImageAnnotationViewer;
