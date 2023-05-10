const fs = require("fs");
const path = require("path");
const writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"));
const { stdin, stdout, exit } = require('process');
const textConsole = {
  START: "Hello! Enter your text below:\n",
  FINISH: "\nGoodbyе! See you later!"
}

stdout.write(textConsole.START)

stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    exitConsole();
  }
  writeStream.write(data);
})

process.on("SIGINT", exitConsole)

function exitConsole() {
  stdout.write(textConsole.FINISH);
  exit();
}