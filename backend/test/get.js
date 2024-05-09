const axios = require("axios");
const fs = require("fs");
const path = require("path");

const URL = "http://localhost:8000/image/1";

axios({
	method: "get",
	url: URL,
	responseType: "stream"
})
	.then(response => {
		const pathToFile = path.join(__dirname, "downloaded_image.jpeg");
		const writer = fs.createWriteStream(pathToFile);
		const annotation = response.headers["x-annotation"];

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on("finish", () => resolve(annotation));
			writer.on("error", reject);
		});
	})
	.then(annotation => {
		console.log("Image downloaded successfully.");
		console.log("Annotation:", annotation);
	})
	.catch(error => {
		console.error("Failed to download image:", error.message);
	});
