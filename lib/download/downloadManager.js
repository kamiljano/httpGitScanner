'use strict';

const request = require('request-promise-native');
const driveManager = require('../driveManager');
const path = require('path');
const retry = require('./retry');

const parsers = [
  require('./apacheContentParser')
];

const saveFile = async (httpPath, localPath) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = request(httpPath).pipe(driveManager.writeStream(localPath));
      stream.on('finish', resolve);
      stream.on('error', reject)
    });
  } catch(err) {
    console.error(`Failed to download file ${httpPath} to ${localPath}. Reason: ${err}`);
    throw err;
  }
};

const downloadRecursively = async (gitPath, parser, sample, pathPrefix = '') => {
  const contents = parser.parse(sample);
  const promises = [];
  for (let file of contents.files) {
    const filePath = path.join(pathPrefix, file);
    promises.push(saveFile(gitPath + filePath.replace('\\', '/'), filePath));
  }
  for (let dir of contents.dirs) {
    const fullGitPath = gitPath + pathPrefix + dir + '/';
    const download = async () => {
      let result;
      try {
        result = await retry(() => request.get(fullGitPath));
      } catch (err) {
        console.error(`Failed to download ${fullGitPath}`);
        throw err;
      }
      await downloadRecursively(gitPath, parser, result, pathPrefix + dir + '/');
    };
    promises.push(download());
  }

  await Promise.all(promises);
};

module.exports.downloadGitRepository = async gitPath => {
  driveManager.initTempPath();
  const rootContent = await request.get(gitPath);
  const parser = parsers.find(parser => parser.supports(rootContent));

  if (!parser) {
    console.log('Unsupported sample: ' + rootContent);
    throw new Error('Unsupported sample: ' + rootContent);
  }

  await downloadRecursively(gitPath, parser, rootContent);
};