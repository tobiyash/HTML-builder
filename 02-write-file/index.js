const fs = require('fs');
const path = require('path');
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join(__dirname, 'out.txt'));

const readLine = readline.createInterface({ input: process.stdin });

const exit = () => {
  readLine.close();
  console.log('\n', 'Goodbye, my dear friend');
  fs.unlink(writeStream.path, process.exit);
};

readLine.on('line', (read) => {
  if (read.trimEnd() === 'exit') exit();
  writeStream.write(read + '\n');
});

process.on('SIGINT', exit);