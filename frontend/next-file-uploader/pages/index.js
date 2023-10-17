import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
	const [IMG_UPLOADER_multipleSelectedImages, setIMG_UPLOADER_multipleSelectedImages] = useState([]);
	const [IMG_UPLOADER_multipleImagesLoader, setIMG_UPLOADER_multipleImagesLoader] = useState(false);

	const [IMG_UPLOADER_singleSelectedImage, setIMG_UPLOADER_singleSelectedImage] = useState([]);
	const [IMG_UPLOADER_singleImageLoader, setIMG_UPLOADER_singleImageLoader] = useState(false);

	const IMG_UPLOADER_API_ALLOWED_FILETYPE = process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE || "image/jpeg, image/png";
	const IMG_UPLOADER_IMAGE_SIZE_LIMIT = process.env.IMG_UPLOADER_IMAGE_SIZE_LIMIT || 5;
	const IMG_UPLOADER_IMAGE_INPUT_NAME = process.env.IMG_UPLOADER_IMAGE_INPUT_NAME || "imgUploaderImages";
	const IMG_UPLOADER_API_PATH = process.env.IMG_UPLOADER_API_PATH || "/api/upload";
	const IMG_UPLOADER_THEME = process.env.IMG_UPLOADER_THEME || "light";

	// single image
	const IMG_UPLOADER_handleSingleImageChange = useCallback(
		(e) => {
			const fileInfo = e.target.files[0];
			e.target.files = null;
			const IMG_UPLOADER_allowOnly = IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ");
			const IMG_UPLOADER_fileSize = Number(IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024;

			if (!IMG_UPLOADER_allowOnly.includes(fileInfo.type)) {
				toast.error(`Image file type must be ${IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g, "")} only.`);
				return false;
			}
			if (fileInfo.size > IMG_UPLOADER_fileSize) {
				toast.error(`Image size must be less than ${IMG_UPLOADER_IMAGE_SIZE_LIMIT} MB.`);
				return false;
			}

			setIMG_UPLOADER_singleSelectedImage([fileInfo]);
		},
		[IMG_UPLOADER_singleSelectedImage],
	);

	const IMG_UPLOADER_handleSingleImageSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setIMG_UPLOADER_singleImageLoader(true);

			if (!IMG_UPLOADER_singleSelectedImage || IMG_UPLOADER_singleSelectedImage.length === 0) {
				setIMG_UPLOADER_singleImageLoader(false);
				return toast.error("Please select an image.");
			}

			const IMG_UPLOADER_formData = new FormData();
			IMG_UPLOADER_formData.append(IMG_UPLOADER_IMAGE_INPUT_NAME, IMG_UPLOADER_singleSelectedImage[0]);

			await fetch(IMG_UPLOADER_API_PATH, {
				method: "POST",
				body: IMG_UPLOADER_formData,
			})
				.then((res) => res.json())
				.then((data) => {
					setIMG_UPLOADER_singleImageLoader(false);
					// your response here

					if (data.success) {
						toast.success("Image uploaded successfully!");
						setIMG_UPLOADER_singleSelectedImage([]);
						document.querySelector(`input[name="${IMG_UPLOADER_IMAGE_INPUT_NAME}"]`).value = null;
					} else {
						toast.error(data.msg.replace(/"/g, ""));
					}
				})
				.catch((err) => {
					setIMG_UPLOADER_singleImageLoader(false);
					console.log(err);
				});
		},
		[IMG_UPLOADER_singleSelectedImage],
	);

	// multiple Image
	const IMG_UPLOADER_handleMultipleImagesChange = useCallback(
		(e) => {
			const fileInfo = [...e.target.files];
			e.target.files = null;
			const IMG_UPLOADER_allowOnly = IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ");
			const IMG_UPLOADER_fileSize = Number(IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024;

			const IMG_UPLOADER_validFiles = fileInfo.filter(({ type, size }) => {
				if (!IMG_UPLOADER_allowOnly.includes(type)) {
					toast.error(`Image file type must be ${IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g, "")} only.`);
					return false;
				}
				if (size > IMG_UPLOADER_fileSize) {
					toast.error(`Image size must be less than ${IMG_UPLOADER_IMAGE_SIZE_LIMIT} MB.`);
					return false;
				}
				return true;
			});

			// prevent duplicate images
			const imgUploaderFilteredSelectedImages = IMG_UPLOADER_validFiles.filter(
				(image) => !IMG_UPLOADER_multipleSelectedImages.some((img) => img.name === image.name),
			);
			setIMG_UPLOADER_multipleSelectedImages([...IMG_UPLOADER_multipleSelectedImages, ...imgUploaderFilteredSelectedImages]);
		},
		[IMG_UPLOADER_multipleSelectedImages],
	);

	const IMG_UPLOADER_handleMultipleImagesSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setIMG_UPLOADER_multipleImagesLoader(true);

			if (!IMG_UPLOADER_multipleSelectedImages || IMG_UPLOADER_multipleSelectedImages.length === 0) {
				setIMG_UPLOADER_multipleImagesLoader(false);
				return toast.error("Please select at least one image.");
			}

			const IMG_UPLOADER_formData = new FormData();
			IMG_UPLOADER_multipleSelectedImages.forEach((image) => {
				IMG_UPLOADER_formData.append(IMG_UPLOADER_IMAGE_INPUT_NAME, image);
			});

			await fetch(IMG_UPLOADER_API_PATH, {
				method: "POST",
				body: IMG_UPLOADER_formData,
			})
				.then((res) => res.json())
				.then((data) => {
					setIMG_UPLOADER_multipleImagesLoader(false);
					// your response here

					if (data.success) {
						toast.success("Images uploaded successfully!");
						setIMG_UPLOADER_multipleSelectedImages([]);
						document.querySelector(`input[name="${IMG_UPLOADER_IMAGE_INPUT_NAME}"]`).value = null;
					} else {
						toast.error(data.msg.replace(/"/g, ""));
					}
				})
				.catch((err) => {
					setIMG_UPLOADER_multipleImagesLoader(false);
					console.log(err);
				});
		},
		[IMG_UPLOADER_multipleSelectedImages],
	);

	return (
		<div className={`img-uploader-main-${IMG_UPLOADER_THEME}`}>
			<div className="container">
				<form className="py-2 row" onSubmit={IMG_UPLOADER_handleSingleImageSubmit}>
					<div className="col-12 mb-3">
						<label className={`text-${IMG_UPLOADER_THEME === "light" ? "dark" : "light"}`}>Single Image Upload</label>
						<div className={`custom-file-upload custom-file-upload-borderBack-${IMG_UPLOADER_THEME}`} htmlFor="files">
							{IMG_UPLOADER_singleSelectedImage.length > 0 ? (
								<div className="position-relative col-4 col-xl-1 col-md-2 mx-0 pl-0 ml-0" key={IMG_UPLOADER_singleSelectedImage[0].name}>
									<div
										className="preview-box img-fluid"
										style={{
											background: `url(${
												IMG_UPLOADER_singleSelectedImage[0]?.name
													? URL.createObjectURL(IMG_UPLOADER_singleSelectedImage[0])
													: `/images/${IMG_UPLOADER_singleSelectedImage[0]}`
											})`,
										}}
									/>
									<button
										type="button"
										onClick={(e) => {
											setIMG_UPLOADER_singleSelectedImage([]);
										}}
										className={`preview-close preview-close-${IMG_UPLOADER_THEME}`}
									>
										<i className="fas fa-times fa-sm" />
									</button>
								</div>
							) : (
								<label>
									<div className={`add-moreRing add-moreRing-${IMG_UPLOADER_THEME} mt-1`} htmlFor="file">
										<i className="fas fa-plus fa-sm" />
									</div>
									<input
										type="file"
										name={IMG_UPLOADER_IMAGE_INPUT_NAME}
										accept={IMG_UPLOADER_API_ALLOWED_FILETYPE}
										onChange={IMG_UPLOADER_handleSingleImageChange}
									/>
								</label>
							)}
						</div>
					</div>
					<div className="col-12 d-flex justify-content-center align-items-center">
						<button type="submit" className="btn btn-danger outline-none" disabled={IMG_UPLOADER_singleImageLoader}>
							{IMG_UPLOADER_singleImageLoader ? <i className="fa fa-spin fa-spinner px-3" /> : "Submit"}
						</button>
					</div>
				</form>
				<form className="py-2 row" onSubmit={IMG_UPLOADER_handleMultipleImagesSubmit}>
					<div className="col-12 mb-3">
						<label className={`text-${IMG_UPLOADER_THEME === "light" ? "dark" : "light"}`}>Multiple Image Upload</label>
						<div className={`custom-file-upload custom-file-upload-borderBack-${IMG_UPLOADER_THEME}`} htmlFor="file">
							{IMG_UPLOADER_multipleSelectedImages.length > 0 && (
								<>
									{IMG_UPLOADER_multipleSelectedImages?.map((image, index) => (
										<div className="position-relative col-4 col-xl-1 col-md-2 mx-0 pl-0 ml-0" key={index + index}>
											<div
												className="preview-box img-fluid"
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
												className={`preview-close preview-close-${IMG_UPLOADER_THEME}`}
											>
												<i className="fas fa-times fa-sm" />
											</button>
										</div>
									))}
								</>
							)}
							<label>
								<div className={`add-moreRing add-moreRing-${IMG_UPLOADER_THEME} mt-1`} htmlFor="file">
									<i className="fas fa-plus fa-sm" />
								</div>
								<input
									type="file"
									name={IMG_UPLOADER_IMAGE_INPUT_NAME}
									accept={IMG_UPLOADER_API_ALLOWED_FILETYPE}
									onChange={IMG_UPLOADER_handleMultipleImagesChange}
									multiple
								/>
							</label>
						</div>
					</div>
					<div className="col-12 d-flex justify-content-center align-items-center">
						<button type="submit" className="btn btn-danger outline-none" disabled={IMG_UPLOADER_multipleImagesLoader}>
							{IMG_UPLOADER_multipleImagesLoader ? <i className="fa fa-spin fa-spinner px-3" /> : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
