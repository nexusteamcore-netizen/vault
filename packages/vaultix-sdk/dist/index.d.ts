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
}
