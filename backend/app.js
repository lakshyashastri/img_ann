require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

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
app.post("/upload", upload.single("image"), async (req, res) => {
	if (!req.file) {
		return res.status(400).send({ message: "No image uploaded!" });
	}
	if (
		!req.body.class_name ||
		!validAnnotations.includes(req.body.class_name)
	) {
		return res
			.status(400)
			.send({ message: "Invalid or missing annotation!" });
	}

	try {
		const file_path = req.file.path;
		const file_name = req.file.originalname;
		const class_name = req.body.class_name;

		const insertImageText =
			"INSERT INTO Images(file_path, file_name) VALUES($1, $2) RETURNING image_id;";
		const insertAnnotationText =
			"INSERT INTO Annotations(image_id, class_name) VALUES($1, $2);";

		await pool.connect(async (err, client, done) => {
			if (err) throw err;

			try {
				await client.query("BEGIN");
				const imageRes = await client.query(insertImageText, [
					file_path,
					file_name
				]);
				const image_id = imageRes.rows[0].image_id;
				await client.query(insertAnnotationText, [
					image_id,
					class_name
				]);
				await client.query("COMMIT");
				res.status(201).send({
					message: "Image and annotation saved successfully!"
				});
			} catch (err) {
				await client.query("ROLLBACK");
				throw err;
			} finally {
				done();
			}
		});
	} catch (err) {
		console.error("Failed to save image and annotation:", err);
		res.status(500).send({
			message: "Failed to save image and annotation"
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

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
