import React, { useState, useEffect } from "react";
import axios from "axios";

function ImageList() {
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/images"
				);
				setImages(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching images:", error);
				setLoading(false);
			}
		};

		fetchImages();
	}, []);

	return (
		<div>
			<h2>Uploaded Images</h2>
			{loading ? (
				<p>Loading images...</p>
			) : (
				<ul>
					{images.length > 0 ? (
						images.map(image => (
							<li key={image.image_id}>
								<img
									src={`http://localhost:8000/${image.file_path}`}
									alt={`Annotation: ${image.class_name}`}
									style={{ width: "100px", height: "100px" }}
								/>
								<p>Annotation: {image.class_name}</p>
							</li>
						))
					) : (
						<p>No images found.</p>
					)}
				</ul>
			)}
		</div>
	);
}

export default ImageList;
