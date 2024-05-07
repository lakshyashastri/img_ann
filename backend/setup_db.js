const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: false
});

async function setupDatabase() {
	const createImagesTable = `
        CREATE TABLE IF NOT EXISTS Images (
            image_id SERIAL PRIMARY KEY,
            file_path TEXT NOT NULL,
            file_name VARCHAR(255) NOT NULL
        );
    `;

	const createAnnotationsTable = `
        CREATE TABLE IF NOT EXISTS Annotations (
            annotation_id SERIAL PRIMARY KEY,
            image_id INT,
            class_name VARCHAR(255) NOT NULL,
            FOREIGN KEY (image_id) REFERENCES Images(image_id)
        );
    `;

	try {
		await pool.query(createImagesTable);
		await pool.query(createAnnotationsTable);
		console.log("Database setup completed successfully.");
	} catch (error) {
		console.error("Error setting up the database:", error);
	}
}

(async () => {
	await setupDatabase();
	process.exit(0);
})();
