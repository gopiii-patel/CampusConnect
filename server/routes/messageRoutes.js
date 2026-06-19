const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  markAsSeen,
  editMessage,
  deleteMessage,
  createConversation,
} = require("../controllers/messageController");

// CREATE / GET CONVERSATION
router.post(
  "/conversation",
  authMiddleware,
  createConversation
);

// SEND MESSAGE
router.post(
  "/",
  authMiddleware,
  sendMessage
);

// GET MESSAGES
router.get(
  "/:conversationId",
  authMiddleware,
  getMessages
);

// MARK SEEN
router.put(
  "/seen/:conversationId",
  authMiddleware,
  markAsSeen
);

// EDIT MESSAGE
router.put(
  "/:id",
  authMiddleware,
  editMessage
);

// DELETE MESSAGE
router.delete(
  "/:id",
  authMiddleware,
  deleteMessage
);

module.exports = router;