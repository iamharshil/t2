import fs from "fs";
import path from "path";
import sharp from "sharp";

export default async function convertToWebP(imagePath, outputPath) {
	try {
		const absoluteImagePath = path.join(process.cwd(), imagePath);
		const absoluteOutputPath = path.join(process.cwd(), outputPath);

		if (!fs.existsSync(absoluteImagePath)) {
			throw new Error("Image file does not exist");
		}

		await sharp(absoluteImagePath).webp().toFile(absoluteOutputPath);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
