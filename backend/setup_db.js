const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const createTables = async () => {
	const createImagesTableQuery = `
    CREATE TABLE IF NOT EXISTS Images (
      image_id SERIAL PRIMARY KEY,
      image_data BYTEA,
      file_name VARCHAR(255),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

	const createAnnotationsTableQuery = `
    CREATE TABLE IF NOT EXISTS Annotations (
      annotation_id SERIAL PRIMARY KEY,
      image_id INT,
      class_name VARCHAR(255),
      annotated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (image_id) REFERENCES Images(image_id)
    );
  `;

	try {
		await pool.query(createImagesTableQuery);
		console.log("Images table created successfully.");
		await pool.query(createAnnotationsTableQuery);
		console.log("Annotations table created successfully.");
	} catch (err) {
		console.error("Error creating tables:", err);
	} finally {
		pool.end();
	}
};

createTables();
