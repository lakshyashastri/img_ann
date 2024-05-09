const axios = require("axios");

const URL = "http://localhost:8000/search";

async function testSearch() {
	const annotation = "car";

	try {
		const response = await axios.get(URL, {
			params: {
				annotation
			}
		});

		console.log("Response:", response.data);
	} catch (error) {
		console.error(
			"Error during search:",
			error.response ? error.response.data : error.message
		);
	}
}

testSearch();
