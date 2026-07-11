import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, View } from 'react-native';

import { WatermarkService } from '../service/watermark.service';
import { LocalGalleryService } from '@/src/services/localGallery.service';
import { TIMER_OPTIONS } from '../constants/camera.constants';
import {
	cycleTimerOption,
	formatAccuracyLabel,
	formatCoordinateLabel,
	formatLocationLabel,
	getCameraStatusLabel,
	getShutterHint,
	getShutterLabel,
} from '../service/camera.service';
import { lightTap, mediumTap, success } from './useCamers';
import { useCrop } from './useCrop';
import { useLocation } from './useLocation';
import type { CameraFacing, CameraFlashMode, CameraTimerOption, CropRegion } from '../types/geoCamers.type';

export function useGeoCameraController() {
	const router = useRouter();
	const cameraRef = useRef<CameraView | null>(null);
	const watermarkedPhotoRef = useRef<View | null>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

	const [facing, setFacing] = useState<CameraFacing>('back');
	const [zoom, setZoom] = useState(0);
	const [flash, setFlash] = useState<CameraFlashMode>('off');
	const [enableTorch, setEnableTorch] = useState(false);
	const [timer, setTimer] = useState<CameraTimerOption>(0);
	const [timerCountdown, setTimerCountdown] = useState<number | null>(null);

	const [capturedUri, setCapturedUri] = useState<string | null>(null);
	const [capturedAt, setCapturedAt] = useState<string | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const { coords, state: gpsState, accuracy, placeName, request: requestLocation } = useLocation(!!permission?.granted);
	const { isCropVisible, isCropping, showCrop, hideCrop, applyCrop } = useCrop();

	// Track original vs cropped URI separately
	const [originalUri, setOriginalUri] = useState<string | null>(null);

	const statusLabel = useMemo(() => getCameraStatusLabel(isReady, capturedUri), [capturedUri, isReady]);
	const locationLabel = useMemo(() => formatLocationLabel(coords, gpsState), [coords, gpsState]);
	const coordinateLabel = useMemo(() => formatCoordinateLabel(coords, gpsState), [coords, gpsState]);
	const accuracyLabel = useMemo(() => formatAccuracyLabel(accuracy), [accuracy]);
	const displayPlaceName = gpsState === 'locked' ? placeName : null;
	const shutterLabel = useMemo(() => getShutterLabel(capturedUri, isCapturing), [capturedUri, isCapturing]);
	const shutterHint = useMemo(() => getShutterHint(capturedUri, timer), [capturedUri, timer]);
	const torchSupported = facing === 'back';

	const handleCameraReady = useCallback(() => {
		setIsReady(true);
	}, []);

	const handleMountError = useCallback((event: { message?: string }) => {
		setIsReady(false);
		Alert.alert('Camera unavailable', event.message ?? 'The camera preview could not start.');
	}, []);

	const handleTapToFocus = useCallback(() => {
		void lightTap();
	}, []);

	const onClose = useCallback(() => {
		router.back();
	}, [router]);

	const performCapture = useCallback(async () => {
		if (!cameraRef.current || !isReady) {
			Alert.alert('Camera not ready', 'Wait for the live preview to appear, then try again.');
			return;
		}

		setIsCapturing(true);
		try {
			const photo = await cameraRef.current.takePictureAsync({
				quality: 0.9,
				skipProcessing: false,
			});

			if (!photo?.uri) {
				Alert.alert('Capture failed', 'The camera did not return a photo. Please try again.');
				return;
			}

			setCapturedUri(photo.uri);
			setOriginalUri(photo.uri);
			setCapturedAt(new Date().toLocaleString());
			await success();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to capture photo';
			Alert.alert('Capture failed', message);
		} finally {
			setIsCapturing(false);
		}
	}, [isReady]);

	const clearCapture = useCallback(async () => {
		setCapturedUri(null);
		setOriginalUri(null);
		setCapturedAt(null);
		await lightTap();
	}, []);

	const handleShutter = useCallback(async () => {
		if (!isReady) return;
		if (capturedUri) {
			await clearCapture();
			return;
		}

		await mediumTap();
		if (timer === 0) {
			await performCapture();
			return;
		}

		setTimerCountdown(timer);
	}, [capturedUri, clearCapture, isReady, performCapture, timer]);

	useEffect(() => {
		if (timerCountdown == null) return;
		if (timerCountdown <= 0) {
			setTimerCountdown(null);
			void performCapture();
			return;
		}

		const handle = setTimeout(() => setTimerCountdown((value) => (value == null ? null : value - 1)), 1000);
		return () => clearTimeout(handle);
	}, [performCapture, timerCountdown]);

	const handleFlip = useCallback(() => {
		setIsReady(false);
		setFacing((current) => (current === 'back' ? 'front' : 'back'));
		setZoom(0);
		void lightTap();
	}, []);

	const cycleFlash = useCallback(() => {
		setFlash((current) => (current === 'off' ? 'on' : current === 'on' ? 'auto' : 'off'));
		void lightTap();
	}, []);

	const cycleTimer = useCallback(() => {
		setTimer((current) => cycleTimerOption(current, TIMER_OPTIONS));
		void lightTap();
	}, []);

	const toggleTorch = useCallback(() => {
		if (!torchSupported) return;
		setEnableTorch((value) => !value);
		void lightTap();
	}, [torchSupported]);

	const handleSave = useCallback(async () => {
		if (!capturedUri) return;

		setIsSaving(true);
		try {
			const watermarkedUri = await WatermarkService.captureWatermarkedView(watermarkedPhotoRef);
			if (!mediaPermission?.granted) {
				const result = await requestMediaPermission();
				if (!result.granted) {
					Alert.alert('Watermarked photo ready', 'Allow Photos access to save the stamped photo to your library.');
					return;
				}
			}

			await MediaLibrary.saveToLibraryAsync(watermarkedUri);

			// Save photo locally inside app Gallery catalog
			try {
				await LocalGalleryService.addGeoPhoto(
					watermarkedUri,
					`Geo Photo - ${placeName ?? 'No Location'}`,
					coords ? { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy ?? undefined } : null,
					placeName,
					capturedAt
				);
			} catch {
				// Non-blocking fallback
			}

			await success();
			Alert.alert('Photo saved', 'Your geo watermarked photo is in the library.', [
				{
					text: 'Take another',
					onPress: () => {
						setCapturedUri(null);
						setCapturedAt(null);
					},
				},
				{ text: 'Done', onPress: () => router.back() },
			]);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Could not save the watermarked photo';
			Alert.alert('Save failed', message);
		} finally {
			setIsSaving(false);
		}
	}, [capturedUri, mediaPermission, requestMediaPermission, router, placeName, coords, capturedAt]);

	const handleRetake = useCallback(async () => {
		await clearCapture();
	}, [clearCapture]);

	const handleCropApply = useCallback(
		async (region: CropRegion) => {
			const sourceUri = originalUri ?? capturedUri;
			if (!sourceUri) return;
			const croppedUri = await applyCrop(sourceUri, region);
			if (croppedUri) {
				setCapturedUri(croppedUri);
			}
		},
		[applyCrop, capturedUri, originalUri],
	);

	return {
		accuracyLabel,
		capturedAt,
		capturedUri,
		cameraRef,
		coordinateLabel,
		coords,
		cycleFlash,
		cycleTimer,
		displayPlaceName,
		enableTorch,
		facing,
		flash,
		gpsState,
		handleCameraReady,
		handleCropApply,
		handleFlip,
		handleMountError,
		handleRetake,
		handleSave,
		handleShutter,
		handleTapToFocus,
		hideCrop,
		isCapturing,
		isCropVisible,
		isCropping,
		isReady,
		isSaving,
		locationLabel,
		mediaPermission,
		onClose,
		permission,
		requestLocation,
		requestMediaPermission,
		requestPermission,
		setZoom,
		showCrop,
		shutterHint,
		shutterLabel,
		statusLabel,
		timer,
		timerCountdown,
		torchSupported,
		toggleTorch,
		watermarkedPhotoRef,
		zoom,
	};
}