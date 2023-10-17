import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
	const [imgUploaderSelectedImages, setImgUploaderSelectedImages] = useState([]);
	const [imgUploaderLoader, setImgUploaderLoader] = useState(false);

	function imageUploaderHandleImageChange(e) {
		const fileInfo = [...e.target.files];
		const allowOnly = process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE.split(", ");
		const fileSize = Number(process.env.IMG_UPLOADER_IMAGE_SIZE_LIMIT) * 1024 * 1024;
		if (typeof fileInfo === "object") {
			const tempFile = [];
			for (let i = 0; i < fileInfo.length; i++) {
				const files = fileInfo[i];
				if (allowOnly.includes(files.type)) {
					if (files.size <= fileSize) {
						tempFile.push(fileInfo[i]);
					} else {
						e.target.value = null;
						toast.error(`Image size must be less than ${process.env.IMG_UPLOADER_IMAGE_SIZE_LIMIT}MB.`);
						break;
					}
				} else {
					e.target.value = null;
					toast.error(`Image file type must be ${process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE.replace(/image\//g, "")} only.`);
					break;
				}
			}
			// prevent duplicate images
			const imgUploaderFilteredSelectedImages = tempFile.filter((image) => {
				const imgUploaderFilteredImages = imgUploaderSelectedImages.filter((img) => img.name === image.name);
				if (imgUploaderFilteredImages.length === 0) {
					return image;
				} else {
					return false;
				}
			});
			setImgUploaderSelectedImages([...imgUploaderSelectedImages, ...imgUploaderFilteredSelectedImages]);
		}
	}

	async function imgUploaderHandleSubmit(e) {
		e.preventDefault();
		setImgUploaderLoader(true);

		if (!imgUploaderSelectedImages || imgUploaderSelectedImages.length === 0) {
			setImgUploaderLoader(false);
			return toast.error("Please select at least one image.");
		}

		const formData = new FormData();
		imgUploaderSelectedImages.forEach((image) => {
			formData.append(process.env.IMG_UPLOADER_IMAGE_INPUT_NAME, image);
		});

		await fetch(process.env.IMG_UPLOADER_API_PATH, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				setImgUploaderLoader(false);
				// your response here

				if (data.success) {
					toast.success("Images uploaded successfully!");
					setImgUploaderSelectedImages([]);
				} else {
					toast.error(data.msg);
				}
			})
			.catch((err) => {
				setImgUploaderLoader(false);
				console.log(err);
			});
	}

	return (
		<main className="bg-dark p-0 m-0 vh-100 vw-100 d-flex justify-content-center align-items-center">
			<div className="container-fluid row">
				<div className="card m-2 p-2 w-75 col-12 col-md-10 mx-auto bg-dark text-light rounded border border-2">
					<div className={`img-uploader-main-${process.env.IMG_UPLOADER_THEME} bg-dark`}>
						<form className="py-2 row" onSubmit={imgUploaderHandleSubmit}>
							<div className="col-12 mb-2">
								<label className="form-text text-white">First Name</label>
								<input className="form-control bg-dark text-white" type="text" placeholder="Name" />
							</div>
							<div className="col-12 mb-3">
								<label className={`text-${process.env.IMG_UPLOADER_THEME === "light" ? "dark" : "light"}`}>Image Upload</label>
								<div className={`custom-file-upload custom-file-upload-borderBack-${process.env.IMG_UPLOADER_THEME}`} htmlFor="file">
									{imgUploaderSelectedImages.length > 0 && (
										<>
											{imgUploaderSelectedImages?.map((image, index) => (
												<div className="position-relative col-4 col-xl-1 col-md-2 my-1" key={index + index}>
													<img className="preview-box img-fluid" src={image?.name ? URL.createObjectURL(image) : `/images/${image}`} alt="images" />
													<button
														type="button"
														onClick={(e) => {
															const filter = imgUploaderSelectedImages.filter((data, i) => i !== index);
															setImgUploaderSelectedImages((prev) => filter);
														}}
														className={`preview-close preview-close-${process.env.IMG_UPLOADER_THEME}`}
													>
														<i className="fas fa-times fa-sm" />
													</button>
												</div>
											))}
										</>
									)}
									<label>
										<div className={`add-moreRing add-moreRing-${process.env.IMG_UPLOADER_THEME}`} htmlFor="file">
											<i className="fas fa-plus fa-sm" />
										</div>
										<input
											type="file"
											name={process.env.IMG_UPLOADER_IMAGE_INPUT_NAME}
											accept={process.env.IMG_UPLOADER_API_ALLOWED_FILETYPE}
											onChange={(e) => imageUploaderHandleImageChange(e)}
											multiple
										/>
									</label>
								</div>
							</div>
							<div className="col-12 d-flex justify-content-center align-items-center">
								<button type="submit" className="btn btn-danger outline-none" disabled={imgUploaderLoader}>
									{imgUploaderLoader ? <i className="fa fa-spin fa-spinner px-3" /> : "Submit"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}
