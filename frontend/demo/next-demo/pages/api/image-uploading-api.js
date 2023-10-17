import path from "path";
import multer from "multer";
import nextConnect from "next-connect";

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = nextConnect({
	onError(error, req, res) {
		if (error instanceof multer.MulterError) {
			return res.status(400).json({ success: false, msg: error.message.replace('"', "") });
		} else if (error.message.startsWith("Image must be type of")) {
			return res.status(400).json({ success: false, msg: error.message.replace('"', "") });
		} else {
			return res.status(500).json({ success: false, msg: error.message.replace(/"/g, "") });
		}
	},
});
const storage = multer.diskStorage({
	destination: `${process.cwd()}/${process.env.IMG_UPLOADER_UPLOAD_PATH}`,
	filename: (req, file, cb) => {
		cb(null, `${Date.now() + Math.floor(Math.random() * 99999)}${path.parse(file.originalname).ext}`);
	},
});

const allowFileType = process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ").map((item) => item.trim());

const upload = multer({
	storage,
	limits: { fileSize: Number(Number(process.env.IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024) },
	fileFilter: (req, file, cb) => {
		if (!allowFileType.includes(file.mimetype)) {
			return cb(new Error(JSON.stringify(`Image must be type of ${process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE}.`)));
		}
		cb(null, true);
	},
}).array(process.env.IMG_UPLOADER_IMAGE_INPUT_NAME, 200);

export default handler
	.use(upload)
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
