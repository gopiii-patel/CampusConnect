const Product = require("../models/product");
const { uploadToCloudinary } = require("../config/cloudinary");

// FALLBACK IMAGES
const CATEGORY_FALLBACK_IMAGES = {
  "Textbooks & Notes": [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
  ],

  "Electronics & Gadgets": [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
  ],

  "Lab Gear & Instruments": [
    "https://images.unsplash.com/photo-1581091215367-59ab6dcef10b?auto=format&fit=crop&q=80&w=600",
  ],

  "Cycles & Vehicles": [
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=600",
  ],

  "Hostel Essentials": [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600",
  ],
};

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      condition,
    } = req.body;

    // VALIDATION
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !condition
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    let imageUrls = [];

    // CLOUDINARY IMAGE
    if (req.file) {
      try {
        const cloudinaryUrl =
          await uploadToCloudinary(
            req.file.buffer
          );

        if (cloudinaryUrl) {
          imageUrls.push(cloudinaryUrl);
        }
      } catch (err) {
        console.log(
          "Cloudinary upload failed:",
          err.message
        );
      }
    }

    // FALLBACK IMAGE
    if (imageUrls.length === 0) {
      const fallbacks =
        CATEGORY_FALLBACK_IMAGES[category] || [
          DEFAULT_FALLBACK_IMAGE,
        ];

      const randomImage =
        fallbacks[
          Math.floor(
            Math.random() * fallbacks.length
          )
        ];

      imageUrls.push(randomImage);
    }

    // CREATE PRODUCT
    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      images: imageUrls,
      seller: req.user.id,
      status: "Available",
    });

    const populatedProduct =
      await Product.findById(product._id).populate(
        "seller",
        "name branch profilePicture semester year email"
      );

    // SOCKET
    const io = req.app.get("io");

    if (io) {
      io.emit(
        "marketplace:new",
        populatedProduct
      );
    }

    res.status(201).json({
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.log(
      "Create product error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    let query = {};

    // SEARCH
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // CATEGORY
    if (category) {
      query.category = category;
    }

    // PRICE FILTER
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte =
          Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte =
          Number(maxPrice);
      }
    }

    // SORTING
    let sortOptions = {
      createdAt: -1,
    };

    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOptions = { price: -1 };
    }

    const products = await Product.find(
      query
    )
      .sort(sortOptions)
      .populate(
        "seller",
        "name branch profilePicture semester year email"
      );

    res.status(200).json(products);
  } catch (error) {
    console.log(
      "Get products error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      ).populate(
        "seller",
        "name branch profilePicture semester year email"
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(
      "Get single product error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE STATUS
const updateProductStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Available",
      "Sold",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // OWNER CHECK
    if (
      product.seller.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    product.status = status;

    await product.save();

    const updatedProduct =
      await Product.findById(
        product._id
      ).populate(
        "seller",
        "name branch profilePicture semester year email"
      );

    // SOCKET
    const io = req.app.get("io");

    if (io) {
      io.emit(
        "marketplace:update",
        updatedProduct
      );
    }

    res.status(200).json({
      message: "Product status updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(
      "Update product status error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // OWNER CHECK
    if (
      product.seller.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    // SOCKET
    const io = req.app.get("io");

    if (io) {
      io.emit(
        "marketplace:delete",
        req.params.id
      );
    }

    res.status(200).json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.log(
      "Delete product error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductStatus,
  deleteProduct,
};