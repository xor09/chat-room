const moment = require("moment");
const formatMessage = (name, text) => {
  return {
    username: name,
    message: text,
    time: moment().format("h:mma"),
  };
};

module.exports = formatMessage;
