'use strict';

const DEFAULT_RETRY_ATTEMPTS = 5;
const DEFAULT_TIMEOUT = 1000;

module.exports = async (action, maxAttempts = DEFAULT_RETRY_ATTEMPTS, timeout = DEFAULT_TIMEOUT) => {
  let attempt = 0;
  let lastError;
  do {
    try {
      return await action();
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, timeout));
      }
    }
  } while (attempt < maxAttempts);

  if (lastError) {
    throw lastError;
  }
};