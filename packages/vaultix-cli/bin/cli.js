#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const CONFIG_PATH = path.join(os.homedir(), '.vaultix.json');

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];
  const config = loadConfig();

  if (command === 'login') {
    const key = args[1];
    if (!key) {
      console.error('\x1b[31m[Error]\x1b[0m Please provide your API key: vaultix login vtx_your_key');
      process.exit(1);
    }
    saveConfig({ ...config, apiKey: key });
    console.log('\x1b[32m[Success]\x1b[0m Authenticated successfully. Your key is saved locally.');
    process.exit(0);
  }

  if (!command) {
    console.error(`
\x1b[36mVaultix CLI Help\x1b[0m
----------------
Steps to get started:
1. \x1b[33mvaultix login <API_KEY>\x1b[0m  (Authenticates your machine)
2. \x1b[33mvaultix list\x1b[0m            (Shows your secrets)
3. \x1b[33mvaultix get <NAME>\x1b[0m      (Retrieves a secret)

Full Commands:
  vaultix login <KEY>
  vaultix get <NAME>
  vaultix list
  vaultix set <NAME> <VALUE>
  vaultix delete <NAME>
`);
    process.exit(1);
  }

  const { apiKey } = loadConfig();
  const token = process.env.VAULTIX_API_KEY || apiKey;
  const baseUrl = process.env.VAULTIX_URL || 'http://localhost:3000';

  if (!token) {
    console.error(`\x1b[31m[Error]\x1b[0m No API key found.`);
    console.log('\x1b[33mTip:\x1b[0m Run "vaultix login <key>" to authenticate.');
    process.exit(1);
  }

  // Simplified internal client to avoid dependency issues
  const callApi = async (path, method = 'GET', body = null) => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || response.statusText);
      return data;
    } catch (err) {
      throw new Error(`Vaultix API Error: ${err.message}`);
    }
  };

  if (command === 'get') {
    if (!target) {
      console.error('\x1b[31m[Error]\x1b[0m Missing secret name.');
      process.exit(1);
    }
    
    try {
      const data = await callApi(`/api/v1/secrets/${encodeURIComponent(target)}`);
      console.log(data.value);
    } catch (err) {
      console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'list') {
    try {
      const data = await callApi('/api/v1/secrets');
      console.log('\x1b[36m--- Active Secrets ---\x1b[0m');
      data.secrets.forEach(s => {
        console.log(`\x1b[32m${s.name}\x1b[0m (Service: ${s.service})`);
      });
    } catch (err) {
      console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'set') {
    const value = args[2];
    if (!target || !value) {
      console.error('\x1b[31m[Error]\x1b[0m Usage: vaultix set <NAME> <VALUE>');
      process.exit(1);
    }
    
    try {
      await callApi(`/api/v1/secrets/${encodeURIComponent(target)}`, 'PUT', { value });
      console.log(`\x1b[32m[Success]\x1b[0m Secret '${target}' configured successfully.`);
    } catch (err) {
      console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'delete') {
    if (!target) {
      console.error('\x1b[31m[Error]\x1b[0m Missing secret name.');
      process.exit(1);
    }
    
    try {
      await callApi(`/api/v1/secrets/${encodeURIComponent(target)}`, 'DELETE');
      console.log(`\x1b[32m[Success]\x1b[0m Secret '${target}' deleted successfully.`);
    } catch (err) {
      console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
      process.exit(1);
    }
  } else {
    console.error(`\x1b[31m[Error]\x1b[0m Unknown command: ${command}`);
    process.exit(1);
  }
}

run();
