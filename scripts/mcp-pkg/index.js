#!/usr/bin/env node
const http = require('http');
const https = require('https');

/**
 * Vaultix MCP Bridge (v4 - Cloud Ready)
 * Connects Cursor/Claude Desktop to external Vercel API via Stdio.
 */

const TOKEN = process.env.VAULTIX_TOKEN;
const API_URL = process.env.VAULTIX_URL;

if (!TOKEN || !API_URL) {
  console.error("[VaultixBridge] Error: Missing VAULTIX_TOKEN or VAULTIX_URL environment variables.");
  process.exit(1);
}

const isHttps = API_URL.startsWith('https');
const requestSource = isHttps ? https : http;

function log(msg) { console.error(`[VaultixBridge] ${msg}`); }

let buffer = '';

process.stdin.on('data', (chunk) => {
  buffer += chunk.toString();
  let lines = buffer.split('\n');
  buffer = lines.pop();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const request = JSON.parse(trimmed);
      handleMessage(request);
    } catch (e) {
      log(`Parse error: ${e.message}`);
    }
  }
});

function handleMessage(request) {
  if (request.method === 'initialize') {
    sendResponse(request.id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "vaultix-bridge", version: "4.0.0" }
    });
    return;
  }

  if (request.method === 'notifications/initialized') return;

  if (request.method === 'tools/list') {
    const req = requestSource.get(API_URL, { headers: { 'Authorization': `Bearer ${TOKEN}` } }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          sendResponse(request.id, { tools: data.tools || [] });
        } catch (e) { log(`Tools error: ${e.message}`); }
      });
    });
    req.on('error', e => log(`HTTP error: ${e.message}`));
    return;
  }

  if (request.method === 'tools/call') {
    const tool = request.params.name;
    const params = request.params.arguments || {};
    const body = JSON.stringify({ tool, params });

    const req = requestSource.request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Length': Buffer.byteLength(body) // Required for correct POST
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
        } catch (e) { log(`Call error: ${e.message} - Res: ${responseData}`); }
      });
    });
    req.on('error', e => log(`HTTP call error: ${e.message}`));
    req.write(body);
    req.end();
    return;
  }

  if (request.id !== undefined) {
    sendResponse(request.id, { error: { code: -32601, message: "Method not found" } });
  }
}

function sendResponse(id, result) {
  const response = { jsonrpc: "2.0", id, result };
  process.stdout.write(JSON.stringify(response) + '\n');
}
