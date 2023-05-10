const fs = require("fs");
const path = require("path");
const { readdir, mkdir } = require('fs/promises');
const newDir = path.join(__dirname, 'project-dist');
const compHtml = path.join(__dirname, 'components');
const stylePath = path.join(__dirname, 'styles');
const stylePathOut = path.join(__dirname, 'project-dist', 'style.css');

fs.rm(newDir, { recursive: true, force: true }, () => {
  mkdir(newDir, { recursive: true }).then(() => {
    copyDirectory(path.join(__dirname, 'assets'), path.join(newDir, 'assets'), function(err) {
      if (err) throw err;
    });
    mergeStyles(path.join(newDir, 'style.css'));
    buildHtml(path.join(__dirname, 'template.html'), path.join(newDir, 'index.html'));
  });
});

function copyDirectory(assets, assetsDist) {
  mkdir(assetsDist, { recursive: true }).then(() => {
    readdir(assets).then((files) => {
      files.forEach(file => {
        let assetsChild = path.join(assets, file);
        let assetsDistChild = path.join(assetsDist, file);
        fs.stat(assetsChild, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            copyDirectory(assetsChild, assetsDistChild);
          } else {
            fs.createReadStream(assetsChild).pipe(fs.createWriteStream(assetsDistChild));
          }
        });
      });
    });
  });
}

function mergeStyles() {
  fs.readdir(stylePath, { withFileTypes: true }, function(err, fileNames) {
    if (err) throw err;
    const writeStream = fs.createWriteStream(stylePathOut);
    fileNames.forEach(function(fileName) {
      const ext = path.parse(fileName.name).ext;
      if (fileName.isFile() === true && ext === '.css')  {
        const readStream = fs.createReadStream(path.join(stylePath, fileName.name));
        readStream.on('data', data => writeStream.write(data));
        readStream.on('error', error => console.log('Error', error.message));
      }
    });
  });  
}

function buildHtml(template, index) {
  let html = '';
  let templateReadStream = fs.createReadStream(template, {encoding: 'utf8'});
  
  templateReadStream.on('data', chunk => {
    html = chunk.toString();
  });

  templateReadStream.on('end', () => {
    addContent(html, index);
  });
}

function addContent(html, index) {
  let objHtml = {};
  let count = 0;
  readdir(compHtml).then((files) => {
    files.forEach(file => {
      let pathFile = path.join(compHtml, file);
      let pathFileCont = file.replace(path.extname(file), '');
      objHtml[pathFileCont] = '';
      fs.createReadStream(
        path.join(pathFile))
        .on('data', (a) => {objHtml[pathFileCont] += a.toString();})
        .on('end', () => {
          count++;
          if (count >= files.length) {
            for (let i in objHtml) {
              html = html.replace('{{'+ i + '}}', objHtml[i]);
            }
            let htmlStream = fs.createWriteStream(index, {encoding: 'utf8'});
            htmlStream.write(html);
          }
        });
    });
  });
}