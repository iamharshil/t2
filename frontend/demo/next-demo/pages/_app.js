import "../styles/img-uploader-style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
	return (
		<>
			<Component {...pageProps} />
			<ToastContainer theme={`${process.env.IMG_UPLOADER_THEME === "gray" || process.env.IMG_UPLOADER_THEME === "dark" ? "dark" : "light"}`} />
		</>
	);
}
