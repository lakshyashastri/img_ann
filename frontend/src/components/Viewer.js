import React, { useState, useEffect } from "react";

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

	const handleAnnotationChange = event => {
		if (onAnnotationChange) {
			onAnnotationChange(event.target.value);
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
					<img
						src={imageUrl}
						alt="Uploaded"
						style={{ width: "300px", height: "auto" }}
					/>
				)}
			</div>
			<div>
				<label htmlFor="annotation-select">Choose an annotation:</label>
				<select
					id="annotation-select"
					value={annotation}
					onChange={handleAnnotationChange}
					style={{
						marginLeft: "10px",
						padding: "10px",
						width: "200px"
					}}
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
					<option value="truck">Truck</option>
				</select>
			</div>
		</div>
	);
}

export default ImageAnnotationViewer;
