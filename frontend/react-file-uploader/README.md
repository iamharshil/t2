# React file uploader

## Requirements

- The minimum version of Node depends on the version of React used in the project.

## Installation

- To run this install react-toastify.
  ```bash
  npm i react-toastify
  ```
- Add bootstrap and font-awesome cdn in your `public/index.html`.

## Usage

- Set the following environment variables in your `.env` file:
  - `REACT_APP_IMG_UPLOADER_API_ALLOWED_FILETYPE`: a comma-separated string of allowed file types, e.g. `'image/png, image/jpeg, image/svg'`.
  - `REACT_APP_IMG_UPLOADER_IMAGE_SIZE_LIMIT`: the maximum file size in MB, e.g. `1` or `5`.
  - `REACT_APP_IMG_UPLOADER_IMAGE_INPUT_NAME`: the input name for the image.
  - `REACT_APP_IMG_UPLOADER_API_PATH`: the API path for the image.
- Ensure that the input name and API path are the same for both the React frontend and the Node backend.
- Set your theme using `REACT_APP_THEME`, e.g. `REACT_APP_THEME=dark`, `REACT_APP_THEME=light` or `REACT_APP_THEME=gray`.
- Customize `img-uploader-style.css` based on your requirement.
- Add bootstrap and font awesome cdn in `public/index.html` file.
- Add ToastContainer in `index.js` and it's css file.

# Example

- An example implementation of single image upload and multiple image upload can be found in the `App.js` file in the `src` folder.
