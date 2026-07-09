import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useCallback, useRef, useState } from 'react';
import { Alert, View, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { StorageAccessFramework } from 'expo-file-system/legacy';

import { useLocation } from '../../geo_camera/hooks/useLocation';
import { lightTap, mediumTap, success } from '../../geo_camera/hooks/useCamers';
import { generatePdfFromPages } from '../services/pdf.service';
import { LocalGalleryService } from '@/src/services/localGallery.service';
import type { ScannedPage } from '../types/pdf.type';
import type { PdfScannerMode } from '../types/pdf.type';

export function usePdfScanner() {
	const cameraRef = useRef<CameraView | null>(null);
	const pageRefs = useRef<(View | null)[]>([]);

	const [permission, requestPermission] = useCameraPermissions();
	const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

	const [mode, setMode] = useState<PdfScannerMode>('idle');
	const [pages, setPages] = useState<ScannedPage[]>([]);
	const [currentPageIndex, setCurrentPageIndex] = useState(0);
	const [isCapturing, setIsCapturing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isCameraReady, setIsCameraReady] = useState(false);

	const { coords, state: gpsState, accuracy, placeName, request: requestLocation } = useLocation(mode === 'camera');

	const handleCameraReady = useCallback(() => {
		setIsCameraReady(true);
	}, []);

	const handleStartScanning = useCallback(async () => {
		if (!permission?.granted) {
			const result = await requestPermission();
			if (!result.granted) {
				Alert.alert('Camera access needed', 'Allow camera access to scan documents.');
				return;
			}
		}
		await requestLocation();
		setMode('camera');
		setIsCameraReady(false);
		void lightTap();
	}, [permission, requestPermission, requestLocation]);

	const handleCapturePage = useCallback(async () => {
		if (!cameraRef.current || !isCameraReady) {
			Alert.alert('Camera not ready', 'Wait for the camera to initialize.');
			return;
		}

		setIsCapturing(true);
		try {
			await mediumTap();
			const photo = await cameraRef.current.takePictureAsync({
				quality: 0.9,
				skipProcessing: false,
			});

			if (!photo?.uri) {
				Alert.alert('Capture failed', 'The camera did not return a photo.');
				return;
			}

			const newPage: ScannedPage = {
				uri: photo.uri,
				capturedAt: new Date().toLocaleString(),
				coords: coords ?? null,
				placeName: placeName ?? null,
				accuracy: accuracy ?? null,
			};

			setPages((prev) => [...prev, newPage]);
			await success();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to capture page';
			Alert.alert('Capture failed', message);
		} finally {
			setIsCapturing(false);
		}
	}, [isCameraReady, coords, placeName, accuracy]);

	const handleReviewPages = useCallback(() => {
		if (pages.length === 0) {
			Alert.alert('No pages', 'Capture at least one page before reviewing.');
			return;
		}
		setMode('review');
		setCurrentPageIndex(0);
		void lightTap();
	}, [pages.length]);

	const handleAddMore = useCallback(() => {
		setMode('camera');
		setIsCameraReady(false);
		void lightTap();
	}, []);

	const handleRemovePage = useCallback(
		(index: number) => {
			if (pages.length <= 1) {
				Alert.alert('Cannot remove', 'You need at least one page.');
				return;
			}
			setPages((prev) => prev.filter((_, i) => i !== index));
			setCurrentPageIndex((prev) => Math.min(prev, pages.length - 2));
			void lightTap();
		},
		[pages.length],
	);

	const handleSavePdf = useCallback(async () => {
		if (pages.length === 0) return;

		setIsSaving(true);
		try {
			// Generate a real PDF with watermarked pages
			const pdfUri = await generatePdfFromPages(pages);

			// Save scan metadata locally inside app Gallery catalog
			try {
				const firstPage = pages[0];
				await LocalGalleryService.addPdfScan(
					pdfUri,
					`Scan - ${new Date().toLocaleDateString()}`,
					firstPage.coords ? { latitude: firstPage.coords.latitude, longitude: firstPage.coords.longitude, accuracy: firstPage.coords.accuracy ?? undefined } : null,
					firstPage.placeName ?? undefined,
					firstPage.capturedAt
				);
			} catch {
				// Non-blocking fallback
			}

			await success();

			if (Platform.OS === 'android') {
				// Android direct download using StorageAccessFramework (SAF)
				const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
				if (permissions.granted) {
					const filename = `scan_${Date.now()}`;
					const safUri = await StorageAccessFramework.createFileAsync(
						permissions.directoryUri,
						filename,
						'application/pdf'
					);

					// Read generated PDF as Base64 and write it to SAF location
					const base64 = await FileSystem.readAsStringAsync(pdfUri, {
						encoding: FileSystem.EncodingType.Base64,
					});
					await FileSystem.writeAsStringAsync(safUri, base64, {
						encoding: FileSystem.EncodingType.Base64,
					});

					Alert.alert(
						'PDF Saved Successfully! 💾',
						'Your document has been downloaded and saved directly to the selected folder.',
						[
							{
								text: 'Scan more',
								onPress: () => {
									setPages([]);
									setMode('camera');
									setIsCameraReady(false);
								},
							},
							{
								text: 'Done',
								onPress: () => {
									setPages([]);
									setMode('idle');
								},
							},
						]
					);
				} else {
					Alert.alert('Permission Denied', 'Storage access permission is required to download/save the PDF.');
				}
			} else {
				// iOS Native share sheet has built-in 'Save to Files' to download PDFs directly
				const canShare = await Sharing.isAvailableAsync();
				if (canShare) {
					await Sharing.shareAsync(pdfUri, {
						mimeType: 'application/pdf',
						dialogTitle: 'Save scanned PDF',
						UTI: 'com.adobe.pdf',
					});

					Alert.alert(
						'PDF Processed! 📄',
						'Your document is ready.',
						[
							{
								text: 'Scan more',
								onPress: () => {
									setPages([]);
									setMode('camera');
									setIsCameraReady(false);
								},
							},
							{
								text: 'Done',
								onPress: () => {
									setPages([]);
									setMode('idle');
								},
							},
						]
					);
				} else {
					Alert.alert('Sharing Unavailable', 'Unable to open the document sharing menu.');
				}
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to generate and save PDF';
			Alert.alert('Save failed', message);
		} finally {
			setIsSaving(false);
		}
	}, [pages]);

	const handleBackToIdle = useCallback(() => {
		if (pages.length > 0) {
			Alert.alert(
				'Discard pages?',
				`You have ${pages.length} scanned page${pages.length > 1 ? 's' : ''}. Discard them?`,
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Discard',
						style: 'destructive',
						onPress: () => {
							setPages([]);
							setMode('idle');
						},
					},
				],
			);
		} else {
			setMode('idle');
		}
		void lightTap();
	}, [pages.length]);

	return {
		cameraRef,
		pageRefs,
		permission,
		requestPermission,
		mode,
		pages,
		currentPageIndex,
		isCapturing,
		isSaving,
		isCameraReady,
		coords,
		gpsState,
		accuracy,
		placeName,
		handleCameraReady,
		handleStartScanning,
		handleCapturePage,
		handleReviewPages,
		handleAddMore,
		handleRemovePage,
		handleSavePdf,
		handleBackToIdle,
		setCurrentPageIndex,
	};
}
