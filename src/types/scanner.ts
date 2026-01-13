/**
 * Scanner API types
 */

export type ScannerCategory = {
  id?: string;
  name: string;
  description?: string;
};

export type ScanWebsiteRequest = {
  url: string;
};

export type ScanWebsiteResponse = {
  session_id: string;
};

export type SessionStatusResponse = {
  status: string;
  progress?: number;
  message?: string;
};

export type JsonReportResponse = unknown;
