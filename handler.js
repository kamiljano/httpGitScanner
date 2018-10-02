'use strict';

module.exports.handle = async event => {
  console.log(`The lambda has been triggered with event ${JSON.stringify(event)}`);
  // TODO: pull the git repo from URL from the event, do GIT hard reset and scan for the credentials
};