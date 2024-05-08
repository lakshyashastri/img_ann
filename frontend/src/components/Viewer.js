import React, { useState, useEffect } from "react";
import { Image, Autocomplete, Text, Paper, Button } from "@mantine/core";
import "../styles/cardcss.css";
import { IconTrash } from "@tabler/icons-react";
import { motion } from "framer-motion";

function ImageAnnotationViewer({
	file,
	annotation,
	onAnnotationChange,
	onRemove
}) {
	const [imageUrl, setImageUrl] = useState("");
	const [cardGradient, setCardGradient] = useState(
		"linear-gradient(0deg, var(--mantine-color-red-6), var(--mantine-color-orange-6))"
	);

	const options = [
		{ value: "airplane", label: "Airplane" },
		{ value: "bird", label: "Bird" },
		{ value: "car", label: "Car" },
		{ value: "cat", label: "Cat" },
		{ value: "deer", label: "Deer" },
		{ value: "dog", label: "Dog" },
		{ value: "frog", label: "Frog" },
		{ value: "horse", label: "Horse" },
		{ value: "ship", label: "Ship" },
		{ value: "truck", label: "Truck" }
	];

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
				"linear-gradient(0deg, var(--mantine-color-green-6), var(--mantine-color-green-6))"
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
		<motion.div
			initial={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 300 }}
			transition={{ duration: 0.25, ease: "easeInOut" }}
			layout
		>
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
						{file.name}
					</Text>
					<Button
						color="red"
						style={{ marginTop: "10px" }}
						onClick={onRemove}
						leftSection={<IconTrash size={20} />}
					>
						Remove
					</Button>
				</div>
				<Autocomplete
					value={annotation}
					onChange={handleAnnotationChange}
					data={options}
					placeholder="Select Annotation"
					style={{
						width: "500px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center"
					}}
					comboboxProps={{
						transitionProps: { transition: "pop", duration: 300 }
					}}
					// variant="filled"
				/>
			</Paper>
		</motion.div>
	);
}

export default ImageAnnotationViewer;
