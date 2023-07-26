"use strict";

const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 *
 * @param {Date} date Data object
 * @returns YYYY-MM-DD
 */
function dateToString(date = new Date()) {
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 *
 * @param {JSON | Error} data information to save
 * @param {string} name file name
 * @param {string} extension file extension
 * @returns Success or Failure
 */
async function saveLog(data, name, extension = "json") {
  try {
    if (!fs.existsSync("../logs")) {
      fs.mkdirSync("../logs");
    }
    if (data instanceof Error) {
      fs.writeFileSync(
        `../logs/${name}.${extension}`,
        JSON.stringify({
          cause: data.cause,
          message: data.message,
          stack: data.stack,
        })
      );
    } else {
      fs.writeFileSync(`../logs/${name}.${extension}`, JSON.stringify(data));
    }
    return "Success";
  } catch (e) {
    console.error({
      message: "Error",
      error: e,
    });
    return "Failure";
  }
}

/**
 *
 * @param {string} path directory path
 * @param {string[]} ignore ignored files
 * @returns Finished
 */
async function folderCleaner(path = "logs", ignore = []) {
  // every 5 minutes
  console.log(`Start clear ./${path}`);
  let files = fs.readdirSync(`${__dirname}/${path}`);
  for (let file of files) {
    if (ignore.includes(file)) {
      continue;
    }
    fs.unlink(`${__dirname}/${path}/${file}`, (err) => {
      if (err) throw err;
      console.log(`File ${file} deleted`);
    });
  }
  return "Finished";
}

/**
 *
 * @param {string} path directory path
 * @param {string} filename report file name
 * @returns Finished
 */
async function deleteReportFile(path = "reports", filename) {
  fs.unlink(`${__dirname}/${path}/${filename}`, (err) => {
    if (err) throw err;
    console.log(`File ${filename} deleted`);
  });
  return "Finished";
}

// Feito com pelo Chat GPT
/**
 *
 * @param {String} word a word
 * @returns pluralized word
 */
function pluralize(word) {
  // Lista de exceções
  const exceptions = {
    goose: "geese",
    mouse: "mice",
    child: "children",
    woman: "women",
    man: "men",
  };

  // Verifica se a palavra é uma exceção
  if (exceptions.hasOwnProperty(word)) {
    return exceptions[word];
  }

  // Verifica se a palavra termina em "y"
  if (word.endsWith("y")) {
    return word.slice(0, -1) + "ies";
  }

  // Adiciona o "s" no final da palavra
  return word + "s";
}

module.exports = {
  sleep,
  saveLog,
  folderCleaner,
  dateToString,
  pluralize,
  deleteReportFile,
};
