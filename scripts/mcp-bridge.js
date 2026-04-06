const https = require('http');

/**
 * Vaultix MCP Bridge (v3 - Robust Parser)
 * Stable Stdio Transport handling multiple JSON messages.
 */

const TOKEN = "vtx_ff27c3ed146f9e3a3ec8efa6ba062b2a0a54abf0489b08e09e32e65fe00127ac";
const URL = "http://localhost:3000/api/mcp";

function log(msg) { console.error(`[VaultixBridge] ${msg}`); }

let buffer = '';

process.stdin.on('data', (chunk) => {
  buffer += chunk.toString();
  
  let lines = buffer.split('\n');
  buffer = lines.pop(); // Keep partial line in buffer

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const request = JSON.parse(trimmed);
      handleMessage(request);
    } catch (e) {
      log(`Parse error: ${e.message} on line: ${trimmed.substring(0, 50)}...`);
    }
  }
});

function handleMessage(request) {
  // Handle Initialization (Mandatory)
  if (request.method === 'initialize') {
    sendResponse(request.id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "vaultix-bridge", version: "3.0.0" }
    });
    return;
  }

  // Mandatory response to 'initialized' notification (no id expected)
  if (request.method === 'notifications/initialized') {
    return;
  }

  // Handle Tool Listing
  if (request.method === 'tools/list') {
    const req = https.get(URL, { headers: { 'Authorization': `Bearer ${TOKEN}` } }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          sendResponse(request.id, { tools: data.tools || [] });
        } catch (e) { log(`Tools listing error: ${e.message}`); }
      });
    });
    req.on('error', e => log(`HTTP error: ${e.message}`));
    return;
  }

  // Handle Tool Calls
  if (request.method === 'tools/call') {
    const tool = request.params.name;
    const params = request.params.arguments || {};

    const body = JSON.stringify({ tool, params });
    const req = https.request(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    }, (res) => {
      let responseData = '';
      res.on('data', c => responseData += c);
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          sendResponse(request.id, {
            content: [{ type: 'text', text: JSON.stringify(result.result || result, null, 2) }]
          });
        } catch (e) { log(`Call parsing error: ${e.message}`); }
      });
    });
    req.on('error', e => log(`HTTP call error: ${e.message}`));
    req.write(body);
    req.end();
    return;
  }

  // Fallback for unknown methods to prevent hangs
  if (request.id !== undefined) {
    sendResponse(request.id, { error: { code: -32601, message: "Method not found" } });
  }
}

function sendResponse(id, result) {
  const response = { jsonrpc: "2.0", id, result };
  process.stdout.write(JSON.stringify(response) + '\n');
}
