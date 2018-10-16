'use strict';

const downloadManager = require('./lib/download/downloadManager');
const gitManager = require('./lib/gitManager');

const getDotGitUrl = url => {
  const result = url.match(/.*\/\.git\//);
  return result ? result[0] : undefined;
};

module.exports.handle = async event => {
  console.log(`The lambda has been triggered with event ${JSON.stringify(event)}`);
  try {
    const gitRepoUrl = getDotGitUrl(event.url);
    if (!gitRepoUrl) {
      console.error('Unsupported path ' + event.url);
      return;
    }
    await downloadManager.downloadGitRepository(gitRepoUrl);
    await gitManager.hardReset();

    // TODO: do GIT hard reset and scan for the credentials

    console.log('Lambda executed successfully');
  } catch (err) {
    console.error(`Lambda execution failed. ${err.stack || err}`);
    throw err;
  }
};