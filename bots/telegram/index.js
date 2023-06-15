const { Telegraf } = require("telegraf");

const { TELEGRAM } = require("../../config/constants");

// telegram delay 1 mensagem por segundo, 20 por minuto
const bot = new Telegraf(TELEGRAM.TOKEN);

bot.telegram.setWebhook(`${TELEGRAM.WEBHOOK}/webhook`);

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

module.exports = bot;
