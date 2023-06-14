const { Telegraf } = require("telegraf");

const { TELEGRAM } = require("../../config/constants");

// telegram delay 1 mensagem por segundo, 20 por minuto
const bot = new Telegraf(TELEGRAM.TOKEN);

module.exports = bot;
