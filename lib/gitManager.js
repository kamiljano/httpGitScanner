'use strict';

const Git = require("nodegit");
const driveManager = require('./driveManager');

module.exports.hardReset = async () => {
  const repo = await Git.Repository.open(driveManager.getRepoPath());
  const head = await repo.getBranchCommit('HEAD');
  await Git.Reset.reset(repo, head, Git.Reset.TYPE.HARD);
};