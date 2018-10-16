'use strict';

const fs = require('fs');
const path = require('path');

const rmDirRecursive = targetPath => {
  fs.readdirSync(targetPath).forEach(file => {
    const fullFilePath = path.join(targetPath, file);
    if (fs.lstatSync(fullFilePath).isDirectory()) {
      rmDirRecursive(fullFilePath);
    } else {
      fs.unlinkSync(fullFilePath);
    }
  });
  fs.rmdirSync(targetPath);
};

module.exports = {
  initTempPath() {
    if (fs.existsSync(process.env.TEMP_DIR)) {
      rmDirRecursive(process.env.TEMP_DIR);
    }
    fs.mkdirSync(process.env.TEMP_DIR);
  },
  writeStream(targetPath) {
    const targetPathInfo = path.parse(targetPath);
    const targetPathAdjusted = path.join(process.env.TEMP_DIR, targetPathInfo.dir);
    if (!fs.existsSync(targetPathAdjusted)) {
      fs.mkdirSync(targetPathAdjusted);
    }
    return fs.createWriteStream(path.join(process.env.TEMP_DIR, targetPath));
  }
};