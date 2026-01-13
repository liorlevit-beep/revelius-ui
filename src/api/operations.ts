import { getEnvConfig } from '../config/env';
import { apiFetch } from './http';

/**
 * Operations API - Promotional and webhook operations
 */
export const OperationsAPI = {
  /**
   * Create a promotional customer account
   */
  async createPromoCustomer(name: string, email: string): Promise<unknown> {
    return apiFetch('/operations/create_promo', {
      method: 'POST',
      body: { name, email },
    });
  },

  /**
   * Handle webhook delivery with internal identifier
   */
  async webhookHandler(internalIdentifier: string, payload: unknown): Promise<unknown> {
    const env = getEnvConfig();
    
    // Special handling for Internal-Identifier header
    const url = `${env.baseUrl}/operations/webhook_handler`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Internal-Identifier': internalIdentifier,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook handler failed: ${response.statusText}`);
    }

    return response.json();
  },
};
