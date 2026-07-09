import type { LocationObjectCoords } from 'expo-location';
import type { RefObject } from 'react';
import type { View } from 'react-native';

export type ScannedPage = {
	uri: string;
	capturedAt: string;
	coords: LocationObjectCoords | null;
	placeName: string | null;
	accuracy: number | null;
};

export type PdfScannerMode = 'idle' | 'camera' | 'review';

export type PdfWatermarkProps = {
	uri: string;
	coords: LocationObjectCoords | null;
	placeName: string | null;
	accuracy: number | null;
	capturedAt: string;
};

export type PdfPageReviewProps = {
	pages: ScannedPage[];
	currentIndex: number;
	isSaving: boolean;
	onPageChange: (index: number) => void;
	onRemovePage: (index: number) => void;
	onAddMore: () => void;
	onSavePdf: () => void;
	onBack: () => void;
	pageRefs: RefObject<(View | null)[]>;
};
