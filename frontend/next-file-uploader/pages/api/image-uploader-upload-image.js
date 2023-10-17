import path from "path";
import multer from "multer";
import nextConnect from "next-connect";

export const config = {
	api: {
		bodyParser: false,
	},
};

const IMG_UPLOADER_IMAGE_SIZE_LIMIT = process.env.IMG_UPLOADER_IMAGE_SIZE_LIMIT || 5;
const IMG_UPLOADER_API_ALLOWED_FILETYPE = process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE || "image/jpeg, image/png";
const IMG_UPLOADER_IMAGE_INPUT_NAME = process.env.IMG_UPLOADER_IMAGE_INPUT_NAME || "imgUploaderImages";
const IMG_UPLOADER_UPLOAD_PATH = process.env.IMG_UPLOADER_UPLOAD_PATH || "public/uploads";

const IMG_UPLOADER_handler = nextConnect({
	onError(error, req, res) {
		if (error instanceof multer.MulterError) {
			if (error.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({ success: false, msg: `Image must be less than ${IMG_UPLOADER_IMAGE_SIZE_LIMIT} MB.` });
			} else if (error.code === "LIMIT_FILE_TYPE") {
				return res.status(400).json({ success: false, msg: `Image type must be ${IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g)}` });
			} else {
				return res.status(400).json({ success: false, msg: error.message });
			}
		} else {
			return res.status(500).json({ success: false, msg: error.message });
		}
	},
});

const IMG_UPLOADER_storage = multer.diskStorage({
	destination: `${process.cwd()}/${IMG_UPLOADER_UPLOAD_PATH}`,
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${Math.floor(Math.random() * 999999)}${path.parse(file.originalname).ext}`);
	},
});

const IMG_UPLOADER_allowFileType = IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ").map((item) => item.trim());

const IMG_UPLOADER_upload = multer({
	storage: IMG_UPLOADER_storage,
	limits: { fileSize: Number(Number(IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024) },
	fileFilter: (req, file, cb) => {
		if (!IMG_UPLOADER_allowFileType.includes(file.mimetype)) {
			return cb(new Error(JSON.stringify(`Image must be type of ${IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g, "")}.`)));
		}
		cb(null, true);
	},
}).array(IMG_UPLOADER_IMAGE_INPUT_NAME, 200);

export default IMG_UPLOADER_handler.use(IMG_UPLOADER_upload)
	.post((req, res) => {
		if (!req.method === "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
		try {
			const files = req.files;

			// files info will be in files variable
			if (!files || files.length === 0) return res.status(400).json({ success: false, msg: "Please upload at least one image" });
			return res.status(200).json({ success: true, msg: "Image uploaded successfully" });
		} catch (error) {
			return res.status(500).json({ success: false, msg: error.message });
		}
	})
	.all((req, res) => {
		return res.status(405).json({ success: false, msg: "Method not allowed" });
	});
