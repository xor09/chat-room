let users = [];

//join user to chat
const userJoin = (id, username, chatID) => {
  const user = { id, username, chatID };
  users.push(user);
  return user;
};

//get the current user
const getCurrentUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getMembers = (chatID) => {
  return users.filter((user) => {
    return chatID === user.chatID;
  });
};

const removeMembers = (id) => {
  users = users.filter((user) => user.id !== id);
};

module.exports = {
  userJoin,
  getCurrentUser,
  getMembers,
  removeMembers,
};
