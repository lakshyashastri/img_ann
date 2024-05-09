const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const URL = "http://localhost:8000/upload";

async function testUpload() {
	const form = new FormData();
	const testImage = fs.createReadStream(path.join(__dirname, "test.png"));

	form.append("image", testImage);
	form.append("class_name", "ship");

	try {
		const response = await axios.post(URL, form, {
			headers: {
				...form.getHeaders()
			}
		});

		console.log("Response:", response.data);
	} catch (error) {
		console.error(
			"Error uploading image:",
			error.response ? error.response.data : error.message
		);
	}
}

testUpload();
