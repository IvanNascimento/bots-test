const { PORT } = require("../config/constants");

const express = require("express");
const vhost = require("vhost");

const httptohttps = express();
const redirect = express();

redirect.use((req, res, next) => {
  let url = req.url;
  let position = -1;
  let redirectUrl = "";
  if (url.includes("/", 1)) {
    position = url.indexOf("/", 1);
    url = url.slice(0, url.indexOf("/", 1));
  }

  console.log(url);

  switch (url) {
    case "/telegram":
      redirectUrl = `https://telegram.bot.localhost:${PORT}${`${req.url}/`.slice(
        position
      )}`;

      res.status(308).redirect(redirectUrl);

      break;
    case "/instagram":
      redirectUrl = `https://instagram.bot.localhost:${PORT}${`${req.url}/`.slice(
        position
      )}`;

      res.status(308).redirect(redirectUrl);

      break;

    case "/discord":
      redirectUrl = `https://discord.bot.localhost:${PORT}${`${req.url}/`.slice(
        position
      )}`;

      res.status(308).redirect(redirectUrl);

      break;

    case "/whatsapp":
      redirectUrl = `https://whatsapp.bot.localhost:${PORT}${`${req.url}/`.slice(
        position
      )}`;

      res.status(308).redirect(redirectUrl);

      break;
    default:
      res.status(308).redirect(`https://${req.hostname}:8443/`);
      break;
  }
});

// HTTP > HTTPS Server
httptohttps.use(redirect);
httptohttps.use(vhost("*.localhost", redirect));
httptohttps.use(vhost("*.bot.localhost", redirect));

module.exports = {
  redirectServer: httptohttps,
  redirect: redirect,
};
