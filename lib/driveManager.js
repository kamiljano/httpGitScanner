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

const mkDirRecursive = targetPath => {
  const pathElements = targetPath.split(/[\/\\]/);
  if (!pathElements.length) {
    return;
  }
  let currentPath;
  for (let element of pathElements) {
    if (!currentPath) {
      currentPath = element;
    } else {
      currentPath += '/' + element;
    }
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
};

const dotGitPath = () => path.join(process.env.TEMP_DIR, '.git');

module.exports = {
  initTempPath() {
    if (fs.existsSync(process.env.TEMP_DIR)) {
      rmDirRecursive(process.env.TEMP_DIR);
    }
    mkDirRecursive(dotGitPath());
  },
  getRepoPath() {
    return process.env.TEMP_DIR;
  },
  writeStream(targetPath) {
    const targetPathInfo = path.parse(targetPath);
    const targetPathAdjusted = path.join(dotGitPath(), targetPathInfo.dir);
    if (!fs.existsSync(targetPathAdjusted)) {
      mkDirRecursive(targetPathAdjusted);
    }
    return fs.createWriteStream(path.join(dotGitPath(), targetPath));
  }
};