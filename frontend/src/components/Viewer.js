import React, { useState, useEffect } from "react";
import { Card, Image, Select, Text } from "@mantine/core";
import Card2 from "./tempcard";

function ImageAnnotationViewer({ file, annotation, onAnnotationChange }) {
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		if (file) {
			const url = URL.createObjectURL(file);
			setImageUrl(url);

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
		<Card
			shadow="sm"
			padding="lg"
			style={{ margin: "20px", display: "flex", alignItems: "center" }}
		>
			<Image
				src={imageUrl}
				fit="contain"
				style={{ width: "300px", height: "auto", marginRight: "20px" }}
			/>
			<div>
				<Text
					style={{
						backgroundColor: "#f0f0f0",
						padding: "5px 10px",
						borderRadius: "5px",
						marginTop: "10px",
						display: "inline-block"
					}}
				>
					{file.name}
				</Text>
				<Select
					value={annotation}
					onChange={handleAnnotationChange}
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
					placeholder="Select Annotation"
					style={{ width: "200px", marginTop: "10px" }}
				/>
			</div>
		</Card>
	);
}

export default ImageAnnotationViewer;
