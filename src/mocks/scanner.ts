import type { ApiEnvelope } from '../types/common';
import type {
  ScannerCategory,
  ScanWebsiteResponse,
  SessionStatusResponse,
  JsonReportResponse,
} from '../types/scanner';

export const scannerMocks = {
  getCategories: (): ApiEnvelope<ScannerCategory[]> => ({
    data: [
      { name: 'Tobacco' },
      { name: 'CBD' },
      { name: 'Adult' },
    ],
  }),

  scanWebsite: (): ApiEnvelope<ScanWebsiteResponse> => ({
    data: {
      session_id: 'demo_session_123',
    },
  }),

  getSessionStatus: (): ApiEnvelope<SessionStatusResponse> => ({
    data: {
      status: 'completed',
      progress: 100,
    },
  }),

  getJsonReport: (): ApiEnvelope<JsonReportResponse> => ({
    data: {
      summary: 'Demo report',
      findings: [],
    },
  }),

  getPdfReport: (): Blob => {
    return new Blob(['Demo PDF'], { type: 'application/pdf' });
  },
};
