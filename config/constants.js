const HOST = "localhost";
const PORT = 8443;

// API KEY
const AUTHORIZATION = process.env.AUTHORIZATION;

// Telegram
const TELEGRAMTOKEN = process.env.TELEGRAMBOTTOKEN;
const TELEGRAMCHAT = process.env.TELEGRAMCHATID;

// Instagram

// Whatsapp

module.exports = {
  AUTHORIZATION: AUTHORIZATION,
  HOST: HOST,
  PORT: PORT,
  TELEGRAM: {
    CHAT: TELEGRAMCHAT,
    TOKEN: TELEGRAMTOKEN,
  },
  INSTAGRAM: {
    TOKEN: "",
  },
  WHATSAPP: {
    TOKEN: "",
  },
};
