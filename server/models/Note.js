const mongoose =
  require("mongoose");

const noteSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      subject: {
        type: String,
        required: true,
      },

      branch: {
        type: String,
        required: true,
      },

      semester: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        default: "Notes",
      },

      fileUrl: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
      },

      fileType: {
        type: String,
        default: "application/pdf",
      },

      downloads: {
        type: Number,
        default: 0,
      },

      uploadedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Note",
    noteSchema
  );