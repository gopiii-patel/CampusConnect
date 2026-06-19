const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createOrGetConversation,
  getConversations,
} = require("../controllers/chatController");

// GET all chats
router.get("/", authMiddleware, getConversations);

// create or open chat with seller
router.post("/", authMiddleware, createOrGetConversation);

module.exports = router;