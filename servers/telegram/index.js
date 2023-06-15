// Bibliotecas
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const { Markup } = require("telegraf");
const { message } = require("telegraf/filters");

// Contants
const { AUTHORIZATION, TELEGRAM } = require("../../config/constants");
const bot = require("../../bots/telegram/index");

// Inicialização de variáveis
const app = express();

// Limit the number of requisitions of a IP
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    legacyHeaders: false,
    message: {
      message: "Error",
      detail: "Rate limit exceeded",
    },
    statusCode: 429,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(express.json());

// API public routes
app.get(`/`, (req, res, next) => {
  res.status(200).send({
    message: "Success",
    detail: "Telegram Server",
    content: {
      type: "String",
      value: "Online",
    },
  });
});

app.use(bot.webhookCallback("/webhook"));

// Authentication system
app.use((req, res, next) => {
  if (req.get("Authorization") == AUTHORIZATION) {
    next();
  } else {
    res.status(403).send({
      message: "Error",
      details: "Access denied",
      extra: "Authentication required",
    });
  }
});

// API protected Routes

// 404
app.use((req, res, next) => {
  res.status(404).send({
    message: "Error",
    detail: "Page not Found",
    extra: {
      url: req.url,
      method: req.method,
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    message: "Error",
    detail: "Internal error",
  });
});

module.exports = {
  telegram: app,
};
