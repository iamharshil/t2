import express from "express";
import convertToWebP from "../helper/converter.js"; // Add the file extension ".js" at the end
import compression from "compression";
import multer from "multer";

// configurations
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

const upload = multer({
	dest: "public/uploads/",
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "public/uploads/");
		},
		filename: (req, file, cb) => {
			cb(null, `${Date.now()}-${file.originalname}`);
		},
	}),
});

// routes
app
	.get("/", async (request, response) => {
		try {
			const converted = await convertToWebP(
				request.body.image_path,
				request.body.output_path,
			);
			if (!converted) {
				return response
					.status(400)
					.json({ success: false, message: "Image not converted" });
			}
			return response
				.status(200)
				.json({ success: true, message: "Image converted" });
		} catch (error) {
			return response
				.status(500)
				.json({ success: false, message: error.message });
		}
	})
	.get("/image", upload.single("image"), async (request, response) => {
		try {
			const converted = await convertToWebP(
				`public/uploads/${request.file.filename}`,
				request.body.output_path,
			);
			if (!converted) {
				return response
					.status(400)
					.json({ success: false, message: "Image not converted" });
			}
			return response
				.status(200)
				.json({ success: true, message: "Image converted" });
		} catch (error) {
			console.log("--> || file: index.js:45 || app.get || error:", error);
			return response
				.status(500)
				.json({ success: false, message: error.message });
		}
	})
	.all("*", (request, response) =>
		response.status(404).json({ success: false, message: "Page not found" }),
	);
// server
app.listen(PORT, () =>
	console.log(`Server is running at http://localhost:${PORT}.`),
);
