require("dotenv").config();


const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const noteRoutes = require("./routes/noteRoutes");

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

app.set("io", io);

const onlineUsers = new Map();

app.set(
  "onlineUsers",
  onlineUsers
);

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on(
    "user:online",
    (userData) => {
      onlineUsers.set(
        userData._id,
        {
          socketId: socket.id,
          user: userData,
        }
      );

      const users =
        Array.from(
          onlineUsers.values()
        ).map(
          (u) => u.user
        );

      io.emit(
        "users:online",
        users
      );
    }
  );
// MESSAGE SEEN
socket.on(
  "message:seen",
  ({ senderId, conversationId }) => {
    const sender =
      onlineUsers.get(senderId);

    if (sender) {
      io.to(sender.socketId).emit(
        "message:seen",
        {
          conversationId,
        }
      );
    }
  }
);
  // TYPING
  socket.on(
    "typing:start",
    ({
      receiverId,
      senderName,
    }) => {
      const receiver =
        onlineUsers.get(
          receiverId
        );

      if (receiver) {
        io.to(
          receiver.socketId
        ).emit(
          "typing:start",
          {
            senderName,
          }
        );
      }
    }
  );

  socket.on(
    "typing:stop",
    ({ receiverId }) => {
      const receiver =
        onlineUsers.get(
          receiverId
        );

      if (receiver) {
        io.to(
          receiver.socketId
        ).emit(
          "typing:stop"
        );
      }
    }
  );

  socket.on(
    "disconnect",
    () => {
      for (const [
        userId,
        value,
      ] of onlineUsers.entries()) {
        if (
          value.socketId ===
          socket.id
        ) {
          onlineUsers.delete(
            userId
          );
          break;
        }
      }

      const users =
        Array.from(
          onlineUsers.values()
        ).map(
          (u) => u.user
        );

      io.emit(
        "users:online",
        users
      );

      console.log(
        "User disconnected:",
        socket.id
      );
    }
  );
});

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/notes",
  noteRoutes
);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});