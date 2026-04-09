/**
 * Security Utility to prevent secret leakage in logs, errors, or responses.
 */
export function scrubSecrets(data: any, secretsToScrub: string[]): any {
  if (!data) return data;
  
  // Convert everything to a string for scanning if it's a primitive
  let jsonString = JSON.stringify(data);
  
  secretsToScrub.forEach(secret => {
    if (!secret || secret.length < 8) return; // Don't scrub very short strings to avoid over-matching
    
    // Escape regex characters just in case
    const escapedSecret = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSecret, 'g');
    
    jsonString = jsonString.replace(regex, '[REDACTED_SECRET]');
  });
  
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // If it wasn't valid JSON or parsing failed, return original sanitized string if it was a string
    return typeof data === 'string' ? jsonString : data;
  }
}
