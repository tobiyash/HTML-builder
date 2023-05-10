const fs = require("fs/promises");
const path = require("path");
const dir = path.join(__dirname, "files");
const dirCopy = path.join(__dirname, "files-copy");

fs.rm(dirCopy, {
  recursive: true,
  force: true,
}).finally(function() {
  fs.mkdir(dirCopy, {recursive: true});
  fs.readdir(dir, {withFileTypes: true })
    .then(files => {
      files.forEach(file => {
        if (file.isFile()) {
          let pathFile = path.join(dir, file.name);
          let pathFileCopy = path.join(dirCopy, file.name);
          fs.copyFile(pathFile, pathFileCopy);
          console.log(file.name);
        }
      });
    });
}); 