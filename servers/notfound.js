const notfound = require("express")();

// 404 server
notfound.use((req, res, next) => {
  res.status(404).send({
    message: "Error",
    details: `${req.url} not Found`,
    extra: {
      method: req.method,
      url: req.url,
    },
  });
});

module.exports = { notfound };
