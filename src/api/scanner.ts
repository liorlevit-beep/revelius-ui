import { apiFetch } from './http';
import type { ApiEnvelope } from '../types/common';
import type {
  ScannerCategory,
  ScanWebsiteResponse,
  SessionStatusResponse,
  JsonReportResponse,
} from '../types/scanner';

/**
 * Scanner API - Website scanning and compliance checking
 */
export const ScannerAPI = {
  /**
   * Get all available scanner categories
   */
  async getCategories(): Promise<ApiEnvelope<ScannerCategory[]>> {
    return apiFetch<ApiEnvelope<ScannerCategory[]>>('/scanner/categories');
  },

  /**
   * Scan a website and create a new session
   */
  async scanWebsite(url: string): Promise<ApiEnvelope<ScanWebsiteResponse>> {
    return apiFetch<ApiEnvelope<ScanWebsiteResponse>>('/scanner/scan', {
      method: 'POST',
      body: { url },
    });
  },

  /**
   * Get the status of a scanning session
   */
  async getSessionStatus(sessionId: string): Promise<ApiEnvelope<SessionStatusResponse>> {
    console.log(`[ScannerAPI] Getting session status for: ${sessionId}`);
    const response = await apiFetch<ApiEnvelope<SessionStatusResponse>>('/scanner/session/status', {
      sessionId,
    });
    console.log(`[ScannerAPI] Session status response:`, response);
    return response;
  },

  /**
   * Get all sessions
   */
  async getAllSessions(): Promise<ApiEnvelope<unknown>> {
    return apiFetch<ApiEnvelope<unknown>>('/scanner/session/all');
  },

  /**
   * Get the JSON report for a completed session
   */
  async getJsonReport(sessionId: string): Promise<ApiEnvelope<JsonReportResponse>> {
    return apiFetch<ApiEnvelope<JsonReportResponse>>('/scanner/report/json', {
      sessionId,
    });
  },

  /**
   * Get the PDF report for a completed session
   */
  async getPdfReport(sessionId: string): Promise<Blob> {
    return apiFetch<Blob>('/scanner/report/pdf', {
      sessionId,
      responseType: 'blob',
    });
  },
};
