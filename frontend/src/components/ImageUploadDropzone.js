import React, { useRef } from "react";
import { Text, Group, Button } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import "../styles/DropzoneStyles.css";

function ImageUploadDropzone({ onDrop, disabled }) {
	const openRef = useRef();

	return (
		<div className="wrapper">
			<Dropzone
				openRef={openRef}
				onDrop={onDrop}
				className="dropzone"
				radius="md"
				accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp]}
				maxSize={30 * 1024 ** 2}
				multiple={true}
				disabled={disabled}
			>
				<div style={{ pointerEvents: "none" }}>
					<Group
						position="center"
						style={{ justifyContent: "center", width: "100%" }}
					>
						<Dropzone.Accept>
							<IconDownload size={50} color="blue" />
						</Dropzone.Accept>
						<Dropzone.Reject>
							<IconX size={50} color="red" />
						</Dropzone.Reject>
						<Dropzone.Idle>
							<IconCloudUpload size={50} />
						</Dropzone.Idle>
					</Group>

					<Text align="center" weight={700} size="lg" mt="xl">
						<Dropzone.Accept>Drop files here</Dropzone.Accept>
						<Dropzone.Reject>
							Image must be less than 30mb
						</Dropzone.Reject>
						<Dropzone.Idle>Upload Image</Dropzone.Idle>
					</Text>
					<Text align="center" size="sm" mt="xs" color="dimmed">
						Drag and drop images here, or click to select files.
					</Text>
				</div>
			</Dropzone>

			<Button
				className="control"
				size="md"
				radius="xl"
				onClick={() => openRef.current?.()}
				disabled={disabled}
			>
				Select files
			</Button>
		</div>
	);
}

export default ImageUploadDropzone;
