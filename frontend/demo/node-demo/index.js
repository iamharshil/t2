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

const { IMG_UPLOADER_UPLOAD_PATH, IMG_UPLOADER_IMAGE_SIZE, IMG_UPLOADER_API_PATH, IMG_UPLOADER_IMAGE_INPUT_NAME, IMG_UPLOADER_API_ALLOWED_FILETYPE } =
	process.env;

const storage = multer.diskStorage({
	destination: `${process.cwd()}/${IMG_UPLOADER_UPLOAD_PATH}`,
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${Math.floor(Math.random() * 999999)}${path.parse(file.originalname).ext}`);
	},
});
const img_uploader_upload = multer({
	storage: storage,
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
		if (err) throw err;
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
