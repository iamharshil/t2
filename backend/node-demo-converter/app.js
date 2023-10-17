const express = require("express");
const app = express();
const convertToWebP = require("./helper/converter.helper");

app.get("/", (req, res) => {
	const converted = convertToWebP("images/test-1.jpeg", "images/1.webp");
	if (converted) {
		return res.json({ message: "Image converted successfully" });
	}
});

app.listen(4000, () => {
	console.log("Server running on port 4000");
});
