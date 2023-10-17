import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import "./img-uploader-style.css";

export default function Home() {
	const [IMG_UPLOADER_multipleSelectedImages, setIMG_UPLOADER_multipleSelectedImages] = useState([]);
	const [IMG_UPLOADER_singleSelectedImages, setIMG_UPLOADER_singleSelectedImages] = useState([]);

	const [IMG_UPLOADER_multipleUploadLoader, setIMG_UPLOADER_multipleUploadLoader] = useState(false);
	const [IMG_UPLOADER_singleUploadLoader, setIMG_UPLOADER_singleUploadLoader] = useState(false);

	const REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE = process.env.REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE || "image/jpeg, image/png";
	const REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT = process.env.REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT || 5;
	const REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME = process.env.REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME || "imgUploaderImages";
	const REACT_APP_IMG_UPLOADER_API_PATH = process.env.REACT_APP_IMG_UPLOADER_API_PATH || "/api/upload";
	const REACT_APP_IMG_UPLOADER_THEME = process.env.REACT_APP_IMG_UPLOADER_THEME || "light";

	// Single images
	const IMG_UPLOADER_handleSingleImageChange = useCallback(
		(e) => {
			const fileInfo = e.target.files[0];
			e.target.files = null;
			const IMG_UPLOADER_allowOnly = REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ");
			const IMG_UPLOADER_fileSize = Number(REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024;

			if (!IMG_UPLOADER_allowOnly.includes(fileInfo.type)) {
				toast.error(`Image file type must be ${REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g, "")} only.`);
				return;
			}
			if (fileInfo.size > IMG_UPLOADER_fileSize) {
				toast.error(`Image size must be less than ${REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT} MB.`);
				return;
			}
			setIMG_UPLOADER_singleSelectedImages(fileInfo);
		},
		[IMG_UPLOADER_singleSelectedImages],
	);

	const IMG_UPLOADER_handleSingleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setIMG_UPLOADER_singleUploadLoader(true);

			if (!IMG_UPLOADER_singleSelectedImages) {
				setIMG_UPLOADER_singleUploadLoader(false);
				return toast.error("Please select an image.");
			}

			const IMG_UPLOADER_formData = new FormData();
			IMG_UPLOADER_formData.append(REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME, IMG_UPLOADER_singleSelectedImages);

			await fetch(REACT_APP_IMG_UPLOADER_API_PATH, {
				method: "POST",
				body: IMG_UPLOADER_formData,
			})
				.then((res) => res.json())
				.then((data) => {
					setIMG_UPLOADER_singleUploadLoader(false);
					// your response here

					if (data.success) {
						toast.success("Image uploaded successfully!");
						setIMG_UPLOADER_singleSelectedImages([]);
						document.querySelector(`input[name="${REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME}"]`).value = "";
					} else {
						toast.error(data.msg.replace(/"/g, ""));
					}
				})
				.catch((err) => {
					setIMG_UPLOADER_singleUploadLoader(false);
					console.log(err);
				});
		},
		[IMG_UPLOADER_singleSelectedImages],
	);

	// multiple images
	const IMG_UPLOADER_handleMultipleImageChange = useCallback(
		(e) => {
			const fileInfo = [...e.target.files];
			e.target.files = null;
			const IMG_UPLOADER_allowOnly = REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ");
			const IMG_UPLOADER_fileSize = Number(REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024;

			const IMG_UPLOADER_validFiles = fileInfo.filter(({ type, size }) => {
				if (!IMG_UPLOADER_allowOnly.includes(type)) {
					toast.error(`Image file type must be ${REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g, "")} only.`);
					return false;
				}
				if (size > IMG_UPLOADER_fileSize) {
					toast.error(`Image size must be less than ${REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT} MB.`);
					return false;
				}
				return true;
			});

			// prevent duplicate images
			const imgUploaderFilteredSelectedImages = IMG_UPLOADER_validFiles.filter(
				(image) => !IMG_UPLOADER_multipleSelectedImages.some((img) => img.name === image.name),
			);
			setIMG_UPLOADER_multipleSelectedImages((prevImages) => [...prevImages, ...imgUploaderFilteredSelectedImages]);
		},
		[IMG_UPLOADER_multipleSelectedImages],
	);

	const IMG_UPLOADER_handleMultipleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setIMG_UPLOADER_multipleUploadLoader(true);

			if (!IMG_UPLOADER_multipleSelectedImages || IMG_UPLOADER_multipleSelectedImages.length === 0) {
				setIMG_UPLOADER_multipleUploadLoader(false);
				return toast.error("Please select at least one image.");
			}

			const IMG_UPLOADER_formData = new FormData();
			IMG_UPLOADER_multipleSelectedImages.forEach((image) => {
				IMG_UPLOADER_formData.append(REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME, image);
			});

			await fetch(REACT_APP_IMG_UPLOADER_API_PATH, {
				method: "POST",
				body: IMG_UPLOADER_formData,
			})
				.then((res) => res.json())
				.then((data) => {
					setIMG_UPLOADER_multipleUploadLoader(false);
					// your response here

					if (data.success) {
						toast.success("Images uploaded successfully!");
						setIMG_UPLOADER_multipleSelectedImages([]);
						document.querySelector(`input[name="${REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME}"]`).value = "";
					} else {
						toast.error(data.msg.replace(/"/g, ""));
					}
				})
				.catch((err) => {
					setIMG_UPLOADER_multipleUploadLoader(false);
					console.log(err);
				});
		},
		[IMG_UPLOADER_multipleSelectedImages],
	);

	return (
		<div className={`img-uploader-main-${REACT_APP_IMG_UPLOADER_THEME}`}>
			<div className="container">
				<form className="py-2 row" onSubmit={IMG_UPLOADER_handleSingleSubmit}>
					<div className="col-12 mb-2">
						<label className={`text-${REACT_APP_IMG_UPLOADER_THEME === "light" ? "dark" : "light"}`}>Single Image Upload</label>
						<div className={`custom-file-upload custom-file-upload-borderBack-${REACT_APP_IMG_UPLOADER_THEME}`}>
							{IMG_UPLOADER_singleSelectedImages?.name ? (
								<div className="position-relative col-4 col-xl-1 col-md-2 mx-0 pl-0 ml-0" key={IMG_UPLOADER_singleSelectedImages.name}>
									<div
										className="preview-box p-0"
										style={{
											background: `url(${
												IMG_UPLOADER_singleSelectedImages?.name
													? URL.createObjectURL(IMG_UPLOADER_singleSelectedImages)
													: `/images/${IMG_UPLOADER_singleSelectedImages}`
											})`,
										}}
									/>
									<button
										type="button"
										onClick={(e) => {
											setIMG_UPLOADER_singleSelectedImages({});
										}}
										className={`preview-close preview-close-${REACT_APP_IMG_UPLOADER_THEME}`}
									>
										<i className="fas fa-times fa-sm" />
									</button>
								</div>
							) : (
								<label>
									<div className={`add-moreRing add-moreRing-${REACT_APP_IMG_UPLOADER_THEME} mt-1`}>
										<i className="fas fa-plus fa-sm" />
									</div>
									<input
										type="file"
										name={REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME}
										accept={REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE}
										onChange={IMG_UPLOADER_handleSingleImageChange}
									/>
								</label>
							)}
						</div>
					</div>
					<div className="col-12 d-flex justify-content-center align-items-center">
						<button type="submit" className="btn btn-danger outline-none" disabled={IMG_UPLOADER_singleUploadLoader}>
							{IMG_UPLOADER_singleUploadLoader ? <i className="fa fa-spin fa-spinner px-3" /> : "Submit"}
						</button>
					</div>
				</form>
				<form className="py-2 row" onSubmit={IMG_UPLOADER_handleMultipleSubmit}>
					<div className="col-12 mb-3">
						<label className={`text-${REACT_APP_IMG_UPLOADER_THEME === "light" ? "dark" : "light"}`}>Image Upload</label>
						<div className={`custom-file-upload custom-file-upload-borderBack-${REACT_APP_IMG_UPLOADER_THEME}`}>
							{IMG_UPLOADER_multipleSelectedImages.length > 0 && (
								<>
									{IMG_UPLOADER_multipleSelectedImages?.map((image, index) => (
										<div className="position-relative col-4 col-xl-1 col-md-2 mx-0 pl-0 ml-0" key={index + index}>
											<div
												className="preview-box p-0"
												style={{
													background: `url(${image?.name ? URL.createObjectURL(image) : `/images/${image}`})`,
												}}
											/>
											<button
												type="button"
												onClick={(e) => {
													const filter = IMG_UPLOADER_multipleSelectedImages.filter((data, i) => i !== index);
													setIMG_UPLOADER_multipleSelectedImages((prev) => filter);
												}}
												className={`preview-close preview-close-${REACT_APP_IMG_UPLOADER_THEME}`}
											>
												<i className="fas fa-times fa-sm" />
											</button>
										</div>
									))}
								</>
							)}
							<label>
								<div className={`add-moreRing add-moreRing-${REACT_APP_IMG_UPLOADER_THEME} mt-1`} htmlFor="file">
									<i className="fas fa-plus fa-sm" />
								</div>
								<input
									type="file"
									name={REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME}
									accept={REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE}
									onChange={IMG_UPLOADER_handleMultipleImageChange}
									multiple
								/>
							</label>
						</div>
					</div>
					<div className="col-12 d-flex justify-content-center align-items-center">
						<button type="submit" className="btn btn-danger outline-none" disabled={IMG_UPLOADER_multipleUploadLoader}>
							{IMG_UPLOADER_multipleUploadLoader ? <i className="fa fa-spin fa-spinner px-3" /> : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
