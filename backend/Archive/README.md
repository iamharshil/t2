# Convert To WebP

A image converter for converting jpeg/jpg, png or svg to webp in JavaScript.

## Requirement

- Most modern macOS, Windows and Linux systems running `Node.js >= 14.15.0`

## User guide

Step 1:

- Install sharp by `npm i sharp`.

Step 2:

- import path, fs and sharp in your code.

```javascript
import path from "path";
import fs from "fs";
import sharp from "sharp";
// or
const path = require("path");
const fs = require("fs);
const sharp = require("sharp");
```

Step 3:

- call `convertToWebP()` in your code and provide it 2 required arguments, first absolute path of file like `public/images/test-1.jpg` then provide absolute output path like `public/webp-images/test-1.webp` third argument is optional which is quality of image from 0 to 100 and 80 is default quality.

## Example code

```javascript
// example
await convertToWebP("file path", "file path + filename.webp", 80); // third parameter(optional) for managing quality of file.

// code implementation
await convertToWebP("public/images/test-1.jpg", "public/converted/test-1.webp");
// or
await convertToWebP(
  "public/images/test-1.jpg",
  "public/converted/test-1.webp",
  70
);
```
