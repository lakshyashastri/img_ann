import React, { useState, useEffect } from "react";
import { Card, Image, Select, NativeSelect, Text, Paper } from "@mantine/core";
import "../styles/cardcss.css";

function ImageAnnotationViewer({ file, annotation, onAnnotationChange }) {
	const [imageUrl, setImageUrl] = useState("");
	const [cardGradient, setCardGradient] = useState(
		"linear-gradient(0deg, var(--mantine-color-red-6), var(--mantine-color-orange-6))"
	);

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
		if (value) {
			setCardGradient(
				"linear-gradient(0deg, var(--mantine-color-green-6), var(--mantine-color-blue-6))"
			);
		} else {
			setCardGradient(
				"linear-gradient(0deg, var(--mantine-color-red-6), var(--mantine-color-orange-6))"
			);
		}
		if (onAnnotationChange) {
			onAnnotationChange(value);
		}
	};

	return (
		<Paper
			withBorder
			radius="md"
			className="card"
			style={{
				margin: "20px",
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				"--card-gradient": cardGradient
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					marginRight: "20px"
				}}
			>
				<Image
					src={imageUrl}
					fit="contain"
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
					{file.name}
				</Text>
			</div>
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
				style={{
					width: "200px"
				}}
			/>
		</Paper>
	);
}

export default ImageAnnotationViewer;
