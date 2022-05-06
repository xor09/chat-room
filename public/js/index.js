let socket = io();

let chatform = document.getElementById("chat-form");
let sendMessage = document.getElementById("sendMessage");
let viewPort = document.querySelector(".message-viewer");
let chatIDView = document.querySelector(".chat-ID");
let memberNameView = document.querySelector(".chat-members");

// get username and room from URL
const { username, chatID } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//join chat
socket.emit("joinChat", { username, chatID });

//join message for new user & set Chat ID
socket.on("welcome-message", (obj) => {
  welcomeMessageForNewUse(obj);
  setChatID(chatID);
});

//fetch all members
socket.on("fetch-members", (members) => {
  setMemberName(members);
});

//join message for other users
socket.on("newUser-update", (obj) => {
  newUserUpdateToOthers(obj);
});

// get message from user & show it to the same user
chatform.addEventListener("submit", (e) => {
  e.preventDefault();
  // get message from user
  const message = sendMessage.value;
  sendMessage.value = "";
  if (message.trim().length != 0) {
    socket.emit("user-message", message);
    //show it to the same user
    outputOwnMessage(message);
  }
});

//message from server
socket.on("other-receive", (obj) => {
  outputMessage(obj);
});

//user disconnect update to others
socket.on("disconnect-update", (obj) => {
  userDisconnectUpdateToOthers(obj);
});

//output message to DOM
const welcomeMessageForNewUse = (obj) => {
  const { username, message, time } = obj;
  const span = document.createElement("span");
  span.classList.add("message-center");
  span.innerHTML = `${time}   <b>${username}</b>${message}`;
  viewPort.appendChild(span);
  viewPort.scrollTop = viewPort.scrollHeight;
};

const newUserUpdateToOthers = (obj) => {
  const { username, message, time } = obj;
  const span = document.createElement("span");
  span.classList.add("message-center");
  span.innerHTML = `${time}   <b>${username}</b>${message}`;
  viewPort.appendChild(span);
  viewPort.scrollTop = viewPort.scrollHeight;
};

const userDisconnectUpdateToOthers = (obj) => {
  const { username, message, time } = obj;
  const span = document.createElement("span");
  span.classList.add("message-center");
  span.innerHTML = `${time}   <b>${username}</b>${message}`;
  viewPort.appendChild(span);
  viewPort.scrollTop = viewPort.scrollHeight;
};

const outputMessage = (obj) => {
  const { username, message, time } = obj;
  const span = document.createElement("span");
  span.classList.add("message-left");
  span.innerHTML = `<span class="message-name">${username}  <span class='message-time'>${time}</span><br></span>${message}`;
  viewPort.appendChild(span);
  viewPort.scrollTop = viewPort.scrollHeight;
};

const outputOwnMessage = (message) => {
  const span = document.createElement("span");
  span.innerHTML = `<span class="message-right">${message}</span>`;
  viewPort.appendChild(span);
  viewPort.scrollTop = viewPort.scrollHeight;
};

const setChatID = (chatID) => {
  const span = document.createElement("span");
  span.innerHTML = `<span
  style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">Chat
  ID</span><br> <span>${chatID}</span>`;
  chatIDView.appendChild(span);
};

const setMemberName = (members) => {
  memberNameView.innerHTML = "";
  members.map((user) => {
    const span = document.createElement("span");
    span.innerHTML = `<span>${user.username}</span>`;
    memberNameView.appendChild(span);
  });
};
