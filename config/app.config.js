const fs = require('fs');
const appRoot = require('app-root-path');

function config() {
  try {
    const jsonString = fs.readFileSync(
      `${appRoot}/volumes/config/application-config.json`
    );
    const appConfigJson = JSON.parse(jsonString);
    if (appConfigJson) {
      for (let prop in appConfigJson) {
        process.env[prop] = appConfigJson[prop];
      }
    }
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = { config };
