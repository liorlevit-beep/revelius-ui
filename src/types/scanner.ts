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
  status: string; // "active" | "inactive"
  success?: boolean; // true = completed successfully, false = failed (only present when status is "inactive")
  progress?: number;
  message?: string;
};

export type JsonReportResponse = unknown;
