const Conversation = require("../models/Conversation");

// CREATE OR GET CONVERSATION (buyer ↔ seller)
const createOrGetConversation = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const userId = req.user.id;

    if (!sellerId) {
      return res.status(400).json({ message: "sellerId required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, sellerId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, sellerId],
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER CONVERSATIONS
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "name profilePicture");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrGetConversation,
  getConversations,
};