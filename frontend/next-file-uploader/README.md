# Multiple Image Selector

This module provides a way to select multiple images in a Next.js frontend and store them in a specific directory, such as the public folder.

## Requirement

- The requirements for this module are Node.js version 16 or higher.

## Usage

- For frontend install `react-toastify`. The backend requires `next-connect` and `multer`.
- Add ToastContainer in `_app.js` and add bootstrap and font awesome cdn in `_document.js`.
- Copy css file from `./styles` folder and add it in your project.
- Set the following environment variables in your `.env.local` file:
  - `IMG_UPLOADER_API_ALLOWED_FILETYPE`: a comma-separated string of allowed file types, e.g. `'image/png, image/jpeg, image/svg'`.
  - `IMG_UPLOADER_IMAGE_SIZE_LIMIT`: the maximum file size in MB, e.g. `1` or `5`.
  - `IMG_UPLOADER_IMAGE_INPUT_NAME`: the input name for the image.
  - `IMG_UPLOADER_API_PATH`: the API path for the image.
  - `THEME`: the theme for the frontend, e.g. `dark` or `light`.
  - Set `IMG_UPLOADER_API_DESTINATION` for directory where images will be stored.
  - Setup ToastContainer container in `_app.js` and add bootstrap cdn and font awesome cdn inside `_document.js`.
  - Change `img-uploader-style.css` based on your requirement.
- For API if you want custom filename then change filename in multer.
- Inside api after files variable you can write your code.

## Installation

- To use this plugin install `next-connect`, `multer` and `react-toastify`.
  ```bash
  npm i next-connect multer react-toastify
  ```

## Examples

- There are 2 different way to use this which is with single image and multiple both examples with code are in `pages/index.js`.
- Both uses same api since api can handle both single file and multiple files `pages/api/image-uploader-upload-image.js` for a backend example.
