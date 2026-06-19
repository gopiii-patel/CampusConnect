const Note = require("../models/Note");

const {
  uploadToCloudinary,
} = require("../config/cloudinary");

// CREATE NOTE
 
const createNote = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      subject,
      branch,
      semester,
      category,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message:
          "File required",
      });
    }

    const note =
      await Note.create({
        title,
        description,
        subject,
        branch,
        semester,
        category,

        fileUrl:
          `/uploads/${req.file.filename}`,

        fileType:
          req.file.mimetype,

        uploadedBy:
          req.user.id,
      });

    const populated =
      await Note.findById(
        note._id
      ).populate(
        "uploadedBy",
        "name profilePicture"
      );

    req.app
      .get("io")
      .emit(
        "notes:new",
        populated
      );

    res.status(201).json(
      populated
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// GET NOTES
const getNotes = async (
  req,
  res
) => {
  try {
    const {
      search,
      branch,
      semester,
    } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (branch)
      query.branch = branch;

    if (semester)
      query.semester =
        semester;

    const notes =
      await Note.find(query)
        .populate(
          "uploadedBy",
          "name profilePicture"
        )
        .sort({
          createdAt: -1,
        });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// DOWNLOAD NOTE
const downloadNote = async (
  req,
  res
) => {
  try {
    const note =
      await Note.findById(
        req.params.id
      ).populate(
        "uploadedBy",
        "name profilePicture"
      );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.downloads += 1;

    await note.save();

    const io =
      req.app.get("io");

    io.emit(
      "notes:update",
      note
    );

    res.status(200).json({
      fileUrl: note.fileUrl,
      note,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE NOTE

const fs =
  require("fs");

const path =
  require("path");

const deleteNote = async (
  req,
  res
) => {
  try {
    const note =
      await Note.findById(
        req.params.id
      );

    if (!note) {
      return res.status(404).json({
        message:
          "Note not found",
      });
    }

    if (
      note.uploadedBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Unauthorized",
      });
    }

    const filePath =
      path.join(
        __dirname,
        "..",
        note.fileUrl
      );

    if (
      fs.existsSync(
        filePath
      )
    ) {
      fs.unlinkSync(
        filePath
      );
    }

    await note.deleteOne();

    req.app
      .get("io")
      .emit(
        "notes:delete",
        req.params.id
      );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  downloadNote,
  deleteNote,
};