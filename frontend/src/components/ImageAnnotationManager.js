import React, { useState } from "react";
import { ImageAnnotationViewer } from "./Viewer";
import { Button } from "@mantine/core";

function ImageAnnotationManager() {
	const [files, setFiles] = useState([]); // This will be an array of File objects
	const [annotations, setAnnotations] = useState({}); // Object keyed by file names

	const handleAnnotationChange = (filename, annotation) => {
		setAnnotations(prev => ({ ...prev, [filename]: annotation }));
	};

	const handleFileUpload = event => {
		setFiles([...files, ...event.target.files]);
	};

	return (
		<div>
			<input type="file" multiple onChange={handleFileUpload} />
			{files.map((file, index) => (
				<ImageAnnotationViewer
					key={file.name}
					file={file}
					annotation={annotations[file.name]}
					onAnnotationChange={annotation =>
						handleAnnotationChange(file.name, annotation)
					}
				/>
			))}
			<Button onClick={() => console.log(annotations)}>
				Log Annotations
			</Button>
		</div>
	);
}

export default ImageAnnotationManager;
