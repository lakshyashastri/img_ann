const axios = require("axios");

const URL = "http://localhost:8000/delete/16"; // Adjust the image_id as necessary

async function testDeleteImage() {
	try {
		const response = await axios.delete(URL);
		console.log("Response:", response.data);
	} catch (error) {
		console.error(
			"Error deleting image:",
			error.response ? error.response.data : error.message
		);
	}
}

testDeleteImage();
