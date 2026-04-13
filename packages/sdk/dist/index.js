"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhantomAPI = void 0;
class PhantomAPI {
    constructor(options) {
        // Attempt to load from env if not explicitly provided
        this.apiKey = options?.apiKey || process.env.PHANTOMAPI_API_KEY || '';
        // Auto-detect base URL from smart token if available
        let smartUrl = '';
        if (this.apiKey && this.apiKey.startsWith('pa_')) {
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
        this.baseUrl = options?.baseUrl || process.env.PHANTOMAPI_URL || smartUrl || 'http://localhost:3000';
        if (!this.apiKey) {
            throw new Error('PhantomAPI SDK requires an API key. Pass it in options or set PHANTOMAPI_API_KEY in your environment.');
        }
    }
    /**
     * Retrieve a secret by its name.
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
            throw new Error(`PhantomAPI Error: ${data.error || response.statusText}`);
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
            throw new Error(`PhantomAPI Error: ${data.error || response.statusText}`);
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
            throw new Error(`PhantomAPI Error: ${data.error || response.statusText}`);
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
            throw new Error(`PhantomAPI Error: ${data.error || response.statusText}`);
        }
        return data;
    }
    /**
     * Execute a remote API securely via PhantomAPI without exposing your secret.
     * PhantomAPI injects the secret server-side into a secure predefined provider endpoint.
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
            throw new Error(`PhantomAPI Execute Error: ${result.error || response.statusText}`);
        }
        return result.data || result;
    }
}
exports.PhantomAPI = PhantomAPI;
