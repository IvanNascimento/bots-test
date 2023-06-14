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

// Servers
const { telegram } = require("./servers/telegram/index");
const { instagram } = require("./servers/instagram/index");
const { discord } = require("./servers/discord/index");
const { whatsapp } = require("./servers/whatsapp/index");
const { redirectServer, redirect } = require("./servers/redirect");
const { notfound } = require("./servers/notfound");

// Inicialização
const app = express();

// Bots Servers
app.use(vhost("telegram.bot.localhost", telegram));
app.use(vhost("instagram.bot.localhost", instagram));
app.use(vhost("whatsapp.bot.localhost", whatsapp));
app.use(vhost("discord.bot.localhost", discord));

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Sucess",
    detail: "Main Server online",
  });
});

app.use(redirect);

// 404
app.use(notfound);
app.use(vhost("*", notfound));

try {
  // HTTPS
  const HTTPSOptions = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem"),
  };
  https.createServer(HTTPSOptions, app).listen(PORT, HOST);
  console.log(`https server running on ${HOST}:${PORT}`);

  redirectServer.listen(80, () => {
    console.log("http -> https server running on port 80");
  });
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
