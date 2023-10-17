# Node api for image upload

## Requirement

- Requirement for backend is node >= 16.

## Packages

- Install `npm i multer cors`.

## Usage

- Set `IMG_UPLOADER_API_PATH` which sets api path (keep this env value same as frontend api path) and set `IMG_UPLOADER_API_ALLOWED_FILETYPE` as string like `"image/png, image/jpeg, image/jpg"` for allowed file types.
- Set image size in `IMG_UPLOADER_IMAGE_SIZE` in MB.
- Put `img_uploader_upload` middleware in your api.

## Example

- See `index.js` for an example of how to use the image uploader api.
