const { Telegraf } = require("telegraf");

const { TELEGRAM } = require("../../config/constants");
const { sleep } = require("../../modules/common");

const { Markup, Scenes, Composer } = require("telegraf");
const { message } = require("telegraf/filters");

// telegram delay 1 mensagem por segundo, 20 por minuto
const bot = new Telegraf(TELEGRAM.TOKEN);

let livros = ["Harry Potter", "Senhor dos Aneis", "Narnia", "O Hobbit", "1964"];

const tarefas = {
  pendentes: [],
  completas: [],
};

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
  await ctx.reply(
    `${livros[Math.floor(Math.random() * livros.length)]} é uma opção`
  );
});

bot.hears("🏠 Automação", async (ctx) => {
  await ctx.reply(`Funcionalidade indiponível`);
});

bot.hears("📋 Tarefas", async (ctx) => {
  await ctx.reply(
    `/Adicionar_Tarefa \n/Concluir_Tarefa \n/Tarefas_pendentes \n/Tarefas_Completas`
  );
});

bot.use(
  new Scenes.Stage(
    new Scenes.WizardScene("wizard"),
    async (ctx) => {
      await ctx.reply("Qual a tarefa ?");
      return ctx.wizard.next();
    },
    new Composer().command("Adicionar_Tarefa", async (ctx) => {
      await ctx.reply("");
      return ctx.wizard.next();
    })
  )
);

module.exports = bot;

// bot.command("Adicionar_Tarefa", async (ctx) => {
//   await ctx.reply(`Qual a tarefa ?`);
// });

// bot.command("Concluir_Tarefa", async (ctx) => {
//   await ctx.reply(`Qual a terefa concluida ? ex.: 1`);
//   let c = tarefas.pendentes.splice(parseInt(ctx.message?.text) - 1, 1);
//   tarefas.completas.push(c);
//   await ctx.reply(`Tarefa "${c} concluida com sucesso!"`);
// });

// bot.command("Tarefas_pendentes", async (ctx) => {
//   let resposta = tarefas.pendentes.map((tarefa, index) => {
//     return `${index + 1}° ${tarefa}\n`;
//   });
//   await ctx.reply(resposta.toString() || "Nenhuma Tarefa Pendente");
// });

// bot.command("Tarefas_Completas", async (ctx) => {
//   let resposta = tarefas.completas.map((tarefa, index) => {
//     return `${index + 1}° ${tarefa}\n`;
//   });

//   console.log(resposta);

//   await ctx.reply(resposta.toString() || "Nenhuma Tarefa Completa");
// });
