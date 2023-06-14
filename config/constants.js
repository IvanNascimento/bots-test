const HOST = "localhost";
const PORT = 8443;

// API KEY
const AUTHORIZATION = process.env.AUTHORIZATION;

// Telegram
const TELEGRAMTOKEN = process.env.TELEGRAMBOTTOKEN;
const TELEGRAMCHAT = process.env.TELEGRAMCHATID;
const TELEGRAMWEBHOOK = process.env.TELEGRAMWEB;

// Instagram

// Whatsapp

module.exports = {
  AUTHORIZATION: AUTHORIZATION,
  HOST: HOST,
  PORT: PORT,
  TELEGRAM: {
    CHAT: TELEGRAMCHAT,
    TOKEN: TELEGRAMTOKEN,
    WEBHOOK: TELEGRAMWEBHOOK,
  },
  INSTAGRAM: {
    TOKEN: "",
  },
  WHATSAPP: {
    TOKEN: "",
  },
};
