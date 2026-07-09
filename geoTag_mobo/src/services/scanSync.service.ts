import api from './api';

export type ScanRecord = {
  _id: string;
  type: 'pdf' | 'geo';
  title: string;
  filePath?: string;
  coords?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
  placeName?: string;
  capturedAt: string;
  createdAt: string;
};

export type ScanStats = {
  totalScans: number;
  pdfCount: number;
  geoCount: number;
  thisWeekCount: number;
  storageSize: string;
  syncedCount: number;
};

export const ScanSyncService = {
  async saveScan(
    type: 'pdf' | 'geo',
    title: string,
    metadata?: {
      coords?: { latitude?: number; longitude?: number; accuracy?: number } | null;
      placeName?: string | null;
      capturedAt?: string | null;
    }
  ): Promise<ScanRecord> {
    const response = await api.post<ScanRecord>('/scans', {
      type,
      title,
      coords: metadata?.coords ?? undefined,
      placeName: metadata?.placeName ?? undefined,
      capturedAt: metadata?.capturedAt ?? undefined,
    });
    return response.data;
  },

  async getScans(): Promise<ScanRecord[]> {
    const response = await api.get<ScanRecord[]>('/scans');
    return response.data;
  },

  async getStats(): Promise<ScanStats> {
    const response = await api.get<ScanStats>('/scans/stats');
    return response.data;
  },
};
