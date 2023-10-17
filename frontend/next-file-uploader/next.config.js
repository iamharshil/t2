/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		IMG_UPLOADER_API_ALLOWED_FILETYPE: "image/jpeg, image/png",
		IMG_UPLOADER_IMAGE_SIZE_LIMIT: 5,
		IMG_UPLOADER_IMAGE_INPUT_NAME: "images",
		IMG_UPLOADER_API_PATH: "/api/image-uploader-upload-image",
		IMG_UPLOADER_UPLOAD_PATH: "public/images",
		IMG_UPLOADER_THEME: "light"
	},
};

module.exports = nextConfig;
