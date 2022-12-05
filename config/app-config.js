const fs = require('fs');
const appRoot = require('app-root-path');

function config() {
  try {
    const jsonString = fs.readFileSync(
      `${appRoot}/node-microservice-input/application-config.json`
    );
    const appConfigJson = JSON.parse(jsonString);
    console.log(appConfigJson);
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
