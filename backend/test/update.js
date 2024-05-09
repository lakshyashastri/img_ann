const axios = require("axios");

const URL = "http://localhost:8000/update/16";

async function testUpdateAnnotation() {
	const data = {
		annotation: "bird"
	};

	try {
		const response = await axios.put(URL, data, {
			headers: {
				"Content-Type": "application/json"
			}
		});

		console.log("Response:", response.data);
	} catch (error) {
		console.error(
			"Error updating annotation:",
			error.response ? error.response.data : error.message
		);
	}
}

testUpdateAnnotation();
