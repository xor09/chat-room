const cors = require("cors");
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const formatMessage = require("../utils/messages");
const {
  userJoin,
  getCurrentUser,
  getMembers,
  removeMembers,
} = require("../utils/user");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

//set static folder
app.use(express.static(publicPath));
app.use(cors());

//run when a client connects
io.on("connection", (socket) => {
  socket.on("joinChat", ({ username, chatID }) => {
    // console.log(username, chatID);
    const user = userJoin(socket.id, username, chatID);
    socket.join(user.chatID);

    // joining message
    socket.emit(
      "welcome-message",
      formatMessage(username, ", welcome to the chat.")
    );

    // boardcast to others when a user joined
    socket.broadcast
      .to(user.chatID)
      .emit(
        "newUser-update",
        formatMessage(username, ", has joined the chat.")
      );

    // fetch all member on join
    io.to(user.chatID).emit("fetch-members", getMembers(user.chatID));

    socket.on("disconnect", () => {
      //disconnect-user
      socket.broadcast
        .to(user.chatID)
        .emit(
          "disconnect-update",
          formatMessage(username, ", leaves the chat.")
        );
      removeMembers(socket.id);
      io.to(user.chatID).emit("fetch-members", getMembers(user.chatID));
    });
  });

  //listen to user message
  socket.on("user-message", (message) => {
    const user = getCurrentUser(socket.id);
    console.log(user);
    socket.broadcast
      .to(user.chatID)
      .emit("other-receive", formatMessage(user.username, message));
  });
}); //end of io

server.listen(port, () => {
  console.log(`server connected to port: ${port} :)`);
});
