export declare class Vaultix {
    private apiKey;
    private baseUrl;
    constructor(options?: {
        apiKey?: string;
        baseUrl?: string;
    });
    /**
     * Retireive a secret by its name.
     */
    get(name: string): Promise<string>;
    /**
     * Retrieve all secrets metadata (without values).
     */
    list(): Promise<Array<{
        name: string;
        service: string;
        description: string | null;
    }>>;
    /**
     * Create or update a secret by its name.
     */
    set(name: string, value: string, options?: {
        service?: string;
        description?: string;
    }): Promise<{
        name: string;
        service: string;
        description: string | null;
        message: string;
    }>;
    /**
     * Delete a secret by its name.
     */
    delete(name: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Execute a remote API securely via Vaultix without exposing your secret.
     * Vaultix injects the secret server-side into a secure predefined provider endpoint.
     */
    execute(options: {
        secretName: string;
        provider: string;
        endpoint: string;
        payload?: any;
    }): Promise<any>;
}
