require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const fs = require("fs").promises;

// PostgreSQL connection
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: false
});

// multer for file handling to save files to a directory
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname); // adding timestamp to filename to avoid name conflicts
	}
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

const validAnnotations = [
	"airplane",
	"car",
	"bird",
	"cat",
	"deer",
	"dog",
	"frog",
	"horse",
	"ship",
	"truck"
];

// image upload
app.post("/upload", upload.array("images", 100), async (req, res) => {
	if (!req.files || req.files.length === 0) {
		return res.status(400).send({ message: "No images uploaded!" });
	}
	if (!req.body.annotations) {
		return res.status(400).send({ message: "Annotations are required!" });
	}

	const annotations = req.body.annotations;

	try {
		await pool.connect(async (err, client, done) => {
			if (err) throw err;

			try {
				await client.query("BEGIN");

				for (let i = 0; i < req.files.length; i++) {
					const file = req.files[i];
					const _annotation = annotations[i];
					const annotation = _annotation.toLowerCase();

					if (!validAnnotations.includes(annotation)) {
						throw new Error("Invalid annotation");
					}

					const insertImageText =
						"INSERT INTO Images(file_path, file_name) VALUES($1, $2) RETURNING image_id;";
					const insertAnnotationText =
						"INSERT INTO Annotations(image_id, class_name) VALUES($1, $2);";

					const imageRes = await client.query(insertImageText, [
						file.path,
						file.originalname
					]);
					const image_id = imageRes.rows[0].image_id;

					await client.query(insertAnnotationText, [
						image_id,
						annotation
					]);
				}

				await client.query("COMMIT");
				res.status(201).send({
					message: "Images and annotations saved successfully!"
				});
			} catch (err) {
				await client.query("ROLLBACK");
				throw err;
			} finally {
				done();
			}
		});
	} catch (err) {
		console.error("Failed to save images and annotations:", err);
		res.status(500).send({
			message: "Failed to save images and annotations"
		});
	}
});

// image retrieval with annotation
app.get("/image/:image_id", async (req, res) => {
	const { image_id } = req.params;

	try {
		const getImageQuery = `
            SELECT Images.file_path, Annotations.class_name 
            FROM Images 
            JOIN Annotations ON Images.image_id = Annotations.image_id 
            WHERE Images.image_id = $1;
        `;
		const { rows } = await pool.query(getImageQuery, [image_id]);

		if (rows.length > 0) {
			const filePath = rows[0].file_path;
			const annotation = rows[0].class_name;

			res.sendFile(path.resolve(filePath));
			res.header("X-Annotation", annotation); // Annotation in custom header
		} else {
			res.status(404).send({ message: "Image not found" });
		}
	} catch (err) {
		console.error("Failed to retrieve image:", err);
		res.status(500).send({ message: "Failed to retrieve image" });
	}
});

// searching images by annotation
app.get("/search", async (req, res) => {
	const { annotation } = req.query;

	// validate search input
	if (!annotation) {
		return res.status(400).send({
			message: "Annotation query parameter is required for search."
		});
	}

	const searchQuery = `
        SELECT Images.image_id, Images.file_path, Images.file_name
        FROM Images
        JOIN Annotations ON Images.image_id = Annotations.image_id
        WHERE Annotations.class_name ILIKE $1;
    `;

	try {
		const { rows } = await pool.query(searchQuery, [`%${annotation}%`]); // partial matching allowed
		if (rows.length === 0) {
			return res.status(404).send({
				message: "No images found with the given annotation."
			});
		}
		res.status(200).json(rows);
	} catch (err) {
		console.error("Search failed:", err);
		res.status(500).send({ message: "Error occurred during the search." });
	}
});

// Update image annotation
app.put("/update/:image_id", async (req, res) => {
	const { image_id } = req.params;
	const { annotation } = req.body;

	if (!annotation) {
		return res.status(400).send({ message: "Annotation is required." });
	}

	const newAnnotation = annotation.toLowerCase();

	if (!validAnnotations.includes(newAnnotation)) {
		return res
			.status(400)
			.send({ message: "Invalid annotation provided." });
	}

	try {
		await pool.connect(async (err, client, done) => {
			if (err) throw err;

			try {
				await client.query("BEGIN");

				// Check if the image exists
				const checkImageQuery =
					"SELECT * FROM Images WHERE image_id = $1;";
				const checkImageResult = await client.query(checkImageQuery, [
					image_id
				]);

				if (checkImageResult.rows.length === 0) {
					throw new Error("Image not found.");
				}

				// Update the annotation
				const updateAnnotationQuery = `
                    UPDATE Annotations 
                    SET class_name = $1 
                    WHERE image_id = $2;
                `;
				await client.query(updateAnnotationQuery, [
					newAnnotation,
					image_id
				]);

				await client.query("COMMIT");
				res.status(200).send({
					message: "Annotation updated successfully."
				});
			} catch (err) {
				await client.query("ROLLBACK");
				throw err;
			} finally {
				done();
			}
		});
	} catch (err) {
		console.error("Failed to update annotation:", err);
		res.status(500).send({ message: "Failed to update annotation" });
	}
});

// Delete image
app.delete("/delete/:image_id", async (req, res) => {
	const { image_id } = req.params;

	try {
		await pool.connect(async (err, client, done) => {
			if (err) throw err;

			try {
				await client.query("BEGIN");

				// Retrieve file path from database before deletion
				const getPathQuery = `SELECT file_path FROM Images WHERE image_id = $1;`;
				const pathResult = await client.query(getPathQuery, [image_id]);
				if (pathResult.rows.length === 0) {
					throw new Error("Image not found.");
				}
				const filePath = pathResult.rows[0].file_path;

				const deleteAnnotationsQuery = `DELETE FROM Annotations WHERE image_id = $1;`;
				await client.query(deleteAnnotationsQuery, [image_id]);

				const deleteImageQuery = `DELETE FROM Images WHERE image_id = $1;`;
				await client.query(deleteImageQuery, [image_id]);
				await client.query("COMMIT");

				// Delete file
				await fs.unlink(filePath);

				res.status(200).send({
					message: "Image and annotations deleted successfully."
				});
			} catch (err) {
				await client.query("ROLLBACK");
				throw err;
			} finally {
				done();
			}
		});
	} catch (err) {
		console.error("Failed to delete image and annotations:", err);
		res.status(500).send({
			message: "Failed to delete image and annotations"
		});
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
