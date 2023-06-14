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

bot.telegram.setWebhook(`${TELEGRAM.WEBHOOK}/webhook`);

app.use(bot.webhookCallback("/webhook"));

bot.telegram.setMyCommands([
  {
    command: "sandy",
    description: "Initial Functions",
  },
  {
    command: "dolar",
    description: "Valor do Dólar Americano atualmente",
  },
]);

bot.telegram.setChatMenuButton({
  menuButton: {
    type: "commands",
  },
});

bot.command("start", (ctx) => {
  console.log(ctx.from);

  bot.telegram.sendMessage(
    ctx.chat.id,
    "Olá! Eu atendo pelo nome de Sandy e estou aqui para te ajudar no que for possível"
  );
});

bot.command("sandy", async (ctx) => {
  return await ctx.reply(
    `Como posso ajudar @${ctx.chat.username} ?`,
    Markup.keyboard([
      ["🕛 Hora", "⛅ Clima"],
      ["💑 Love", "📚 Livros"],
      ["🏠 Automação", "📋 Tarefas"],
    ])
      .oneTime()
      .resize()
  );
});

bot.hears("🕛 Hora", async (ctx) => {
  let hour = new Date();
  let timestring = hour.toTimeString();
  await ctx.reply(
    `A hora atual é ${timestring.slice(0, 8)} pelo ${timestring
      .slice(timestring.indexOf("(") + 1, -1)
      .toLocaleLowerCase()}`
  );
});

bot.hears("⛅ Clima", async (ctx) => {
  await ctx.reply(`Será um dia lindo`);
});

bot.hears("💑 Love", async (ctx) => {
  await ctx.reply(`Com isso eu não posso ajudar`);
});

bot.hears("📚 Livros", async (ctx) => {
  await ctx.reply(`Senhor dos Anéis é uma opção`);
});

bot.hears("🏠 Automação", async (ctx) => {
  await ctx.reply(`Funcionalidade indiponível`);
});

bot.hears("📋 Tarefas", async (ctx) => {
  await ctx.reply(`Vai fazer seu dever de casa!!`);
});

bot.on(message("sticker"), async (ctx) => {
  await ctx.reply("👀");
});

bot.command("dolar", async (ctx) => {
  let valores = await fetch(`https://economia.awesomeapi.com.br/last/USD-BRL`);
  valores = await valores.json();
  let dolar = valores["USDBRL"]["bid"];
  dolar.replace(".", ",");
  let final = dolar.slice(0, 4);

  await ctx.reply(`Um Dólar Americano Atualmente vale R$ ${final}`);
});

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
