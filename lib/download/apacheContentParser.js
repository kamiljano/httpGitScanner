'use strict';

const getAllDirectories = sample => {
  const dirRows = sample.match(/alt="\[DIR\]"><\/td><td><a href="[^"]*"/ig);
  if (!dirRows) {
    return [];
  }
  return dirRows.map(row => {
    const parsedRow = row.match(/href="([^"]*)"/i);
    return parsedRow[1].endsWith('/') ? parsedRow[1].substr(0, parsedRow[1].length - 1) : parsedRow[1];
  });
};

const getAllFiles = sample => {
  const fileRows = sample.match(/alt="\[[\s\t]*\]"><\/td><td><a href="[^"]*"/ig);
  if (!fileRows) {
    return [];
  }
  return fileRows.map(row => {
    const parsedRow = row.match(/href="([^"]*)"/i);
    return parsedRow[1];
  });
};

module.exports = {
  supports: sample => sample && sample.includes('<address>Apache/2'),
  parse: sample => {
    const dirs = getAllDirectories(sample);
    const files = getAllFiles(sample);
    return {dirs, files};
  }
};