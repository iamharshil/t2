/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		IMG_UPLOADER_API_ALLOWED_FILETYPE: "image/jpg, image/jpeg, image/png",
		IMG_UPLOADER_IMAGE_SIZE_LIMIT: 1,
		IMG_UPLOADER_IMAGE_INPUT_NAME: "profile",
		IMG_UPLOADER_API_PATH: "/api/image-uploading-api",
		IMG_UPLOADER_UPLOAD_PATH: "public/profiles",
		IMG_UPLOADER_THEME: "gray",
	},
};

module.exports = nextConfig;
