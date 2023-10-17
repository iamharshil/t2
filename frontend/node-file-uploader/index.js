const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const IMG_UPLOADER_IMAGE_SIZE = process.env.IMG_UPLOADER_IMAGE_SIZE || 5;
const IMG_UPLOADER_UPLOAD_PATH = process.env.IMG_UPLOADER_UPLOAD_PATH || "public/uploads";
const IMG_UPLOADER_API_ALLOWED_FILETYPE = process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE || "image/jpeg, image/png";
const IMG_UPLOADER_IMAGE_INPUT_NAME = process.env.IMG_UPLOADER_IMAGE_INPUT_NAME || "imgUploaderImages";
const IMG_UPLOADER_API_PATH = process.env.IMG_UPLOADER_API_PATH || "/api/upload";

const IMG_UPLOADER_storage = multer.diskStorage({
	destination: `${process.cwd()}/${IMG_UPLOADER_UPLOAD_PATH}`,
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${Math.floor(Math.random() * 999999)}${path.parse(file.originalname).ext}`);
	},
});
const img_uploader_upload = multer({
	storage: IMG_UPLOADER_storage,
	limits: { fileSize: Number(IMG_UPLOADER_IMAGE_SIZE) * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (!IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ").includes(file.mimetype)) {
			return cb(new Error(JSON.stringify({ success: false, msg: `Image must be type of ${IMG_UPLOADER_API_ALLOWED_FILETYPE}.` })));
		}
		cb(null, true);
	},
});

const ImgUploaderMulterMiddleware = async (req, res, next) => {
	const img_uploader = img_uploader_upload.any(IMG_UPLOADER_IMAGE_INPUT_NAME);

	img_uploader(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({ success: false, msg: `Image must be less than ${IMG_UPLOADER_IMAGE_SIZE} MB.` });
			} else if (err.code === "LIMIT_FILE_TYPE") {
				return res.status(400).json({ success: false, msg: `Image type must be ${IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g)}` });
			} else {
				return res.status(400).json({ success: false, msg: err.message });
			}
		} else if (err) {
			return res.status(500).json({ success: false, msg: err.message });
		}
		next();
	});
};

app.post(IMG_UPLOADER_API_PATH, ImgUploaderMulterMiddleware, (req, res) => {
	try {
		if (req.files.length === 0) {
			return res.status(400).json({ success: true, msg: "No file uploaded" });
		}
		// your code here

		return res.status(200).json({ success: true, msg: "File uploaded successfully" });
	} catch (error) {
		return res.status(500).json({ success: false, msg: error.message });
	}
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
