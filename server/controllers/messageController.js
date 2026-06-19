const Message = require("../models/Message");
const Conversation = require("../models/Conversation");


const createConversation =
  async (req, res) => {
    try {

      const { userId } =
        req.body;

      let conversation =
        await Conversation.findOne({
          participants: {
            $all: [
              req.user.id,
              userId,
            ],
          },
        });

      if (!conversation) {
        conversation =
          await Conversation.create({
            participants: [
              req.user.id,
              userId,
            ],
          });
      }

      res.status(200).json(
        conversation
      );

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      receiverId,
      text,
    } = req.body;

    if (
      !conversationId ||
      !receiverId ||
      !text
    ) {
      return res.status(400).json({
        message:
          "conversationId, receiverId and text required",
      });
    }

    const onlineUsers =
      req.app.get("onlineUsers");

    const receiver =
      onlineUsers.get(receiverId);

    const message =
      await Message.create({
        conversationId,
        sender: req.user.id,
        receiver: receiverId,
        text,

        status: receiver
          ? "delivered"
          : "sent",

        deliveredAt: receiver
          ? new Date()
          : null,
      });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: text,
      }
    );

    const populatedMessage =
      await Message.findById(message._id)
        .populate(
          "sender",
          "name profilePicture"
        )
        .populate(
          "receiver",
          "name profilePicture"
        );

    const io = req.app.get("io");

    if (receiver) {
      io.to(receiver.socketId).emit(
        "chat:newMessage",
        populatedMessage
      );

      io.to(receiver.socketId).emit(
        "chat:notification",
        {
          title: "New Message",
          text: `${req.user.name} sent you a message`,
        }
      );
    }

    res.status(201).json(
      populatedMessage
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MESSAGES
const getMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await Message.find({
        conversationId:
          req.params.conversationId,
      })
        .populate(
          "sender",
          "name profilePicture"
        )
        .populate(
          "receiver",
          "name profilePicture"
        )
        .sort({
          createdAt: 1,
        });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// MARK AS SEEN
const markAsSeen = async (
  req,
  res
) => {
  try {
    await Message.updateMany(
      {
        conversationId:
          req.params.conversationId,

        receiver: req.user.id,

        status: {
          $ne: "seen",
        },
      },
      {
        status: "seen",
        seenAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// EDIT MESSAGE
const editMessage = async (
  req,
  res
) => {
  try {
    const message =
      await Message.findById(
        req.params.id
      );

    if (
      !message ||
      message.sender.toString() !==
        req.user.id
    ) {
      return res.status(404).json({
        message:
          "Message not found",
      });
    }

    message.text =
      req.body.text;

    message.edited = true;

    await message.save();

    const updatedMessage =
      await Message.findById(
        message._id
      )
        .populate(
          "sender",
          "name profilePicture"
        )
        .populate(
          "receiver",
          "name profilePicture"
        );

    const io = req.app.get("io");

    io.emit(
      "chat:messageEdited",
      updatedMessage
    );

    res.status(200).json(
      updatedMessage
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE MESSAGE
const deleteMessage = async (
  req,
  res
) => {
  try {
    const message =
      await Message.findById(
        req.params.id
      );

    if (
      !message ||
      message.sender.toString() !==
        req.user.id
    ) {
      return res.status(404).json({
        message:
          "Message not found",
      });
    }

    const messageId =
      message._id;

    await message.deleteOne();

    const io = req.app.get("io");

    io.emit(
      "chat:messageDeleted",
      {
        messageId,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getMessages,
  markAsSeen,
  editMessage,
  deleteMessage,
};