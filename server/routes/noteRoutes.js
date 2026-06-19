const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const {
  createNote,
  getNotes,
  downloadNote,
  deleteNote,
} = require(
  "../controllers/noteController"
);

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createNote
);

router.get(
  "/",
  getNotes
);

router.put(
  "/download/:id",
  authMiddleware,
  downloadNote
);

router.delete(
  "/:id",
  authMiddleware,
  deleteNote
);

module.exports =
  router;