// ENV
require("dotenv-safe").config({
  path: "./config/.env",
  example: "./config/.env.example",
});

// Bibliotecas
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const vhost = require("vhost");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

// Contants
const { AUTHORIZATION, HOST, PORT } = require("./config/constants");
const { helloworld } = require("./servers/telegram/helloworld");

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
// API Online ?
app.get(`/`, (req, res, next) => {
  res.status(200).send({
    message: "Success",
    detail: "Online",
    content: {
      type: "String",
      value: "Hello",
    },
  });
});

// 'Public' Bots
app.use(vhost("telegram.bot.localhost", helloworld));
app.use(vhost("instagram.bot.localhost", helloworld));
app.use(vhost("whatsapp.bot.localhost", helloworld));

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

// Protected Bots
// app.use(vhost("telegram.bot.localhost", helloworld));
// app.use(vhost("instagram.bot.localhost", helloworld));
// app.use(vhost("whatsapp.bot.localhost", helloworld));

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

try {
  // HTTPS
  const HTTPSOptions = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem"),
  };
  https.createServer(HTTPSOptions, app).listen(PORT, HOST);
  console.log(`https server running on ${HOST}:${PORT}`);
} catch (e) {
  // HTTP
  app.listen(PORT, HOST, () => {
    console.log(`http server running on ${HOST}:${PORT}`);
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    message: "Error",
    detail: "Internal error",
  });
});
