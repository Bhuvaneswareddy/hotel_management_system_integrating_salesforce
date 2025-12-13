require('dotenv').config();
const jsforce = require('jsforce');

(async () => {
  try {
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL
    });
    await conn.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN
    );
    console.log('Salesforce login successful');
  } catch (err) {
    console.error('Salesforce login failed:', err);
  }
})();
