import * as FileSystem from 'expo-file-system/legacy';

export type LocalGalleryItem = {
  id: string;
  type: 'pdf' | 'geo';
  title: string;
  uri: string; // local file URI in app documents
  coords?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
  placeName?: string;
  capturedAt: string;
};

export type GalleryStats = {
  totalScans: number;
  pdfCount: number;
  geoCount: number;
  thisWeekCount: number;
  storageSize: string;
  syncedCount: number;
};

const METADATA_PATH = `${FileSystem.documentDirectory}gallery_metadata.json`;
const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
const SCANS_DIR = `${FileSystem.documentDirectory}scans/`;

// Ensure directories exist helper
async function ensureDirsExist() {
  const photosDirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!photosDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
  const scansDirInfo = await FileSystem.getInfoAsync(SCANS_DIR);
  if (!scansDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(SCANS_DIR, { intermediates: true });
  }
}

export const LocalGalleryService = {
  async getItems(): Promise<LocalGalleryItem[]> {
    try {
      const info = await FileSystem.getInfoAsync(METADATA_PATH);
      if (!info.exists) return [];
      
      const content = await FileSystem.readAsStringAsync(METADATA_PATH);
      const items = JSON.parse(content) as LocalGalleryItem[];
      
      // Verify files still exist in storage
      const verifiedItems: LocalGalleryItem[] = [];
      for (const item of items) {
        const fileInfo = await FileSystem.getInfoAsync(item.uri);
        if (fileInfo.exists) {
          verifiedItems.push(item);
        }
      }
      
      if (verifiedItems.length !== items.length) {
        await this.saveMetadata(verifiedItems);
      }
      
      return verifiedItems.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
    } catch {
      return [];
    }
  },

  async saveMetadata(items: LocalGalleryItem[]): Promise<void> {
    await FileSystem.writeAsStringAsync(METADATA_PATH, JSON.stringify(items));
  },

  async addGeoPhoto(
    sourceUri: string,
    title: string,
    coords?: { latitude?: number; longitude?: number; accuracy?: number } | null,
    placeName?: string | null,
    capturedAt?: string | null
  ): Promise<LocalGalleryItem> {
    await ensureDirsExist();
    const timestamp = Date.now();
    const destUri = `${PHOTOS_DIR}photo_${timestamp}.jpg`;
    
    // Copy image file to local app sandboxed directory
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });

    const newItem: LocalGalleryItem = {
      id: `geo_${timestamp}`,
      type: 'geo',
      title,
      uri: destUri,
      coords: coords ?? undefined,
      placeName: placeName ?? undefined,
      capturedAt: capturedAt ?? new Date().toISOString(),
    };

    const items = await this.getItems();
    items.push(newItem);
    await this.saveMetadata(items);
    return newItem;
  },

  async addPdfScan(
    sourceUri: string,
    title: string,
    coords?: { latitude?: number; longitude?: number; accuracy?: number } | null,
    placeName?: string | null,
    capturedAt?: string | null
  ): Promise<LocalGalleryItem> {
    await ensureDirsExist();
    const timestamp = Date.now();
    const destUri = `${SCANS_DIR}scan_${timestamp}.pdf`;
    
    // Copy PDF file to local app sandboxed directory
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });

    const newItem: LocalGalleryItem = {
      id: `pdf_${timestamp}`,
      type: 'pdf',
      title,
      uri: destUri,
      coords: coords ?? undefined,
      placeName: placeName ?? undefined,
      capturedAt: capturedAt ?? new Date().toISOString(),
    };

    const items = await this.getItems();
    items.push(newItem);
    await this.saveMetadata(items);
    return newItem;
  },

  async deleteItem(id: string): Promise<void> {
    const items = await this.getItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;

    const item = items[index];
    try {
      await FileSystem.deleteAsync(item.uri, { idempotent: true });
    } catch {
      // Ignore deletion errors
    }

    items.splice(index, 1);
    await this.saveMetadata(items);
  },

  async getStats(): Promise<GalleryStats> {
    const items = await this.getItems();
    const pdfCount = items.filter((item) => item.type === 'pdf').length;
    const geoCount = items.filter((item) => item.type === 'geo').length;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCount = items.filter(
      (item) => new Date(item.capturedAt) >= oneWeekAgo
    ).length;

    // Calculate total actual storage size of local files
    let totalBytes = 0;
    for (const item of items) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(item.uri);
        if (fileInfo.exists) {
          totalBytes += fileInfo.size ?? 0;
        }
      } catch {
        // Ignore
      }
    }
    const mbSize = (totalBytes / (1024 * 1024)).toFixed(2);

    return {
      totalScans: items.length,
      pdfCount,
      geoCount,
      thisWeekCount,
      storageSize: `${mbSize} MB`,
      syncedCount: items.length, // Saved on device
    };
  },
};
