"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaultix = void 0;
class Vaultix {
    apiKey;
    baseUrl;
    constructor(options) {
        // Attempt to load from env if not explicitly provided
        this.apiKey = options?.apiKey || process.env.VAULTIX_API_KEY || '';
        // Auto-detect base URL from smart token if available
        let smartUrl = '';
        if (this.apiKey && this.apiKey.startsWith('vtx_')) {
            const parts = this.apiKey.split('_');
            if (parts.length === 3) {
                try {
                    const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
                    if (decoded.startsWith('http')) {
                        smartUrl = decoded;
                    }
                }
                catch (e) { }
            }
        }
        this.baseUrl = options?.baseUrl || process.env.VAULTIX_URL || smartUrl || 'http://localhost:3000';
        if (!this.apiKey) {
            throw new Error('Vaultix SDK requires an API key. Pass it in options or set VAULTIX_API_KEY in your environment.');
        }
    }
    /**
     * Retireive a secret by its name.
     */
    async get(name) {
        const url = `${this.baseUrl}/api/v1/secrets/${encodeURIComponent(name)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Vaultix Error: ${data.error || response.statusText}`);
        }
        return data.value;
    }
    /**
     * Retrieve all secrets metadata (without values).
     */
    async list() {
        const url = `${this.baseUrl}/api/v1/secrets`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Vaultix Error: ${data.error || response.statusText}`);
        }
        return data.secrets;
    }
    /**
     * Create or update a secret by its name.
     */
    async set(name, value, options) {
        const url = `${this.baseUrl}/api/v1/secrets/${encodeURIComponent(name)}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                value,
                service: options?.service,
                description: options?.description
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Vaultix Error: ${data.error || response.statusText}`);
        }
        return data;
    }
    /**
     * Delete a secret by its name.
     */
    async delete(name) {
        const url = `${this.baseUrl}/api/v1/secrets/${encodeURIComponent(name)}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Vaultix Error: ${data.error || response.statusText}`);
        }
        return data;
    }
    /**
     * Execute a remote API securely via Vaultix without exposing your secret.
     * Vaultix injects the secret server-side into a secure predefined provider endpoint.
     */
    async execute(options) {
        const url = `${this.baseUrl}/api/v1/proxy`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Vaultix Execute Error: ${result.error || response.statusText}`);
        }
        return result.data || result;
    }
}
exports.Vaultix = Vaultix;
