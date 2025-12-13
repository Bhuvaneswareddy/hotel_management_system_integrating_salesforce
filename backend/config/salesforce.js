const jsforce = require('jsforce');

// Salesforce Connected App credentials
const SF_LOGIN_URL = 'https://login.salesforce.com'; // or test.salesforce.com for sandbox
const SF_USERNAME = process.env.SF_USERNAME; // your Salesforce username
const SF_PASSWORD = process.env.SF_PASSWORD; // your Salesforce password
const SF_SECURITY_TOKEN = process.env.SF_SECURITY_TOKEN; // the security token from Salesforce
const SF_CLIENT_ID = process.env.SF_CLIENT_ID; // Consumer Key from connected app
const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET; // Consumer Secret from connected app
const SF_CALLBACK_URL = process.env.SF_CALLBACK_URL || 'http://localhost:5000/oauth/callback';

const conn = new jsforce.Connection({
    loginUrl: SF_LOGIN_URL,
    oauth2: {
        clientId: SF_CLIENT_ID,
        clientSecret: SF_CLIENT_SECRET,
        redirectUri: SF_CALLBACK_URL
    }
});

// Login using username + password + security token
async function login() {
    try {
        await conn.login(SF_USERNAME, SF_PASSWORD + SF_SECURITY_TOKEN);
        console.log('✅ Salesforce connected successfully!');
        return conn;
    } catch (err) {
        console.error('❌ Salesforce connection error:', err);
        throw err;
    }
}

module.exports = { conn, login };
