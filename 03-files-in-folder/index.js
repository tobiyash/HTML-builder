const path = require("path");
const fs = require("fs");
const folder = path.join(__dirname, "secret-folder");

fs.readdir(folder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const fileInfo = path.parse(file);
    fs.stat(path.join(folder, file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) 
      console.log(`${fileInfo.name} - ${fileInfo.ext.replace(".", "")} - ${Number(stats.size / 1024).toFixed(2)}kb`);
    })
  })  
})