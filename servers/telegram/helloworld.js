// Bibliotecas
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");

// Contants
const { AUTHORIZATION } = require("../../config/constants");

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
app.get(`/online`, (req, res, next) => {
  res.status(200).send({
    message: "Success",
    detail: "Online",
    content: {
      type: "String",
      value: "Online",
    },
  });
});

app.get("/hello", (req, res, next) => {
  res.status(200).send({
    message: "Success",
    content: {
      type: "String",
      value: "Hello World",
    },
  });
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
  helloworld: app,
};
