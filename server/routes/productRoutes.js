const express = require("express");

const router = express.Router();

const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/productController");

// MULTER MEMORY STORAGE
const storage = multer.memoryStorage();

// FILE FILTER
const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// TEST
router.get("/test", (req, res) => {
  res.send(
    "Product route working"
  );
});

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// CREATE PRODUCT
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createProduct
);

// UPDATE STATUS
router.put(
  "/:id/status",
  authMiddleware,
  updateProductStatus
);

// DELETE PRODUCT
router.delete(
  "/:id",
  authMiddleware,
  deleteProduct
);

module.exports = router;