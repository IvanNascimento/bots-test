const { Telegraf } = require("telegraf");

const { TELEGRAM } = require("../../config/constants");

const bot = new Telegraf(TELEGRAM.TOKEN);

// telegram delay 1 mensagem por segundo, 20 por minuto

module.exports = bot;
