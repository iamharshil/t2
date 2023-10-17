// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import convertToWebP from "@/helper/converter";

export default function handler(req, res) {
	const converted = convertToWebP(
		"public/images/test-1.jpeg",
		"public/images/1.webp",
	);
	if (converted) {
		return res.json({ message: "Image converted successfully" });
	} else {
		return res.json({ message: "Image conversion failed" });
	}
}
