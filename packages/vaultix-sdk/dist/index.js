"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaultix = void 0;
class Vaultix {
    apiKey;
    baseUrl;
    constructor(options) {
        // Attempt to load from env if not explicitly provided
        this.apiKey = options?.apiKey || process.env.VAULTIX_API_KEY || '';
        this.baseUrl = options?.baseUrl || process.env.VAULTIX_URL || 'http://localhost:3000';
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
}
exports.Vaultix = Vaultix;
