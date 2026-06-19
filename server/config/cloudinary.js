const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (
  fileBuffer,
  resourceType = "auto",
  originalName = "file"
) => {
  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "campusconnect_notes",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },

      (error, result) => {

        if (error) {
          return reject(error);
        }

        // IMPORTANT
        resolve(result.secure_url);

      }
    );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(uploadStream);

  });
};

module.exports = {
  uploadToCloudinary,
};