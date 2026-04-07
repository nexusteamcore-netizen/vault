#!/usr/bin/env node

const { Vaultix } = require('@vaultix/sdk');

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];
  const target = args[1];

  if (!command) {
    console.error(`
Usage:
  vaultix get <SECRET_NAME>
  vaultix list

Make sure VAULTIX_API_KEY environment variable is set.
`);
    process.exit(1);
  }

  let vault;
  try {
    vault = new Vaultix();
  } catch (err) {
    console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
    process.exit(1);
  }

  if (command === 'get') {
    if (!target) {
      console.error('\x1b[31m[Error]\x1b[0m Please provide a secret name, e.g. "vaultix get STRIPE_KEY"');
      process.exit(1);
    }
    
    try {
      const value = await vault.get(target);
      console.log(value); // output only the raw value so it can be piped into other tools
    } catch (err) {
      console.error(`\x1b[31m[Error]\x1b[0m ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'list') {
    try {
      const secrets = await vault.list();
      console.log('\x1b[36m--- Active Secrets ---\x1b[0m');
      secrets.forEach(s => {
        console.log(`\x1b[32m${s.name}\x1b[0m (Service: ${s.service})`);
      });
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
