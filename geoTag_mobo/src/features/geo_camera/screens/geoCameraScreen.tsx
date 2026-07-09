import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Screen from '@/src/components/Screen';

import { WatermarkService } from '@/src/services/watermark.service';
import { CameraActionButton } from '../components/CameraActionButton';
import { CameraCapture } from '../components/CameraCapture';
import { CameraPreview } from '../components/CameraPreview';
import { CameraReticle } from '../components/CameraReticle';
import { CameraTopBar } from '../components/CameraTopBar';
import { CameraZoomBar } from '../components/CameraZoomBar';
import { CapturedReview } from '../components/CapturedReview';
import { lightTap, mediumTap, success } from '../hooks/useCamers';
import { useLocation } from '../hooks/useLocation';
import type { CameraFacing, CameraFlashMode, CameraTimerOption, CameraZoomOption } from '../types/geoCamers.type';

const ZOOM_OPTIONS: CameraZoomOption[] = [
	{ label: '1×', value: 0 },
	{ label: '1.5×', value: 0.15 },
	{ label: '2×', value: 0.35 },
	{ label: '3×', value: 0.65 },
];
const TIMER_OPTIONS: CameraTimerOption[] = [0, 3, 10];

function formatCoord(value: number) {
	return value.toFixed(4);
}

function locationLabelFromCoords(coords: { latitude: number; longitude: number } | null, gpsState?: 'searching' | 'locked' | 'denied') {
	if (gpsState === 'denied') return 'Location permission denied';
	if (!coords) return 'Locating…';
	return `${formatCoord(coords.latitude)}, ${formatCoord(coords.longitude)}`;
}

function coordinateLabelFromCoords(coords: { latitude: number; longitude: number } | null, gpsState?: 'searching' | 'locked' | 'denied') {
	if (gpsState === 'denied') return 'Latitude/longitude unavailable';
	if (!coords) return 'Finding latitude and longitude…';
	return `Lat ${formatCoord(coords.latitude)}  Lon ${formatCoord(coords.longitude)}`;
}

function accuracyLabel(value: number | null) {
	if (value == null) return 'Accuracy — m';
	return `±${value.toFixed(0)} m`;
}

export default function GeoCameraScreen() {
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
	const hasTorch = enableTorch;

	const { coords, state: gpsState, accuracy, placeName, request: requestLocation } = useLocation(!!permission?.granted);

	const statusLabel = useMemo(() => {
		if (capturedUri) return 'Reviewing';
		if (!isReady) return 'Starting camera';
		return 'Live preview';
	}, [capturedUri, isReady]);

	const performCapture = useCallback(async () => {
		if (!cameraRef.current || !isReady) {
			Alert.alert('Camera not ready', 'Wait for the live preview to appear, then try again.');
			return;
		}
		setIsCapturing(true);
		try {
			const photo = await cameraRef.current?.takePictureAsync({
				quality: 0.9,
				skipProcessing: false,
			});
			if (photo?.uri) {
				setCapturedUri(photo.uri);
				setCapturedAt(new Date().toLocaleString());
				await success();
			} else {
				Alert.alert('Capture failed', 'The camera did not return a photo. Please try again.');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to capture photo';
			Alert.alert('Capture failed', message);
		} finally {
			setIsCapturing(false);
		}
	}, [isReady]);

	const handleShutter = useCallback(async () => {
		if (!isReady) return;
		if (capturedUri) {
			setCapturedUri(null);
			setCapturedAt(null);
			await lightTap();
			return;
		}
		await mediumTap();
		if (timer === 0) {
			await performCapture();
			return;
		}
		setTimerCountdown(timer);
	}, [capturedUri, isReady, performCapture, timer]);

	useEffect(() => {
		if (timerCountdown == null) return;
		if (timerCountdown <= 0) {
			setTimerCountdown(null);
			void performCapture();
			return;
		}
		const handle = setTimeout(() => setTimerCountdown((value) => (value == null ? null : value - 1)), 1000);
		return () => clearTimeout(handle);
	}, [timerCountdown, performCapture]);

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
		setTimer((current) => {
			const index = TIMER_OPTIONS.indexOf(current);
			return TIMER_OPTIONS[(index + 1) % TIMER_OPTIONS.length];
		});
		void lightTap();
	}, []);

	const toggleTorch = useCallback(() => {
		setEnableTorch((value) => !value);
		void lightTap();
	}, []);

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
			await success();
			Alert.alert('Photo saved', 'Your geo watermarked photo is in the library.', [
				{ text: 'Take another', onPress: () => { setCapturedUri(null); setCapturedAt(null); } },
				{ text: 'Done', onPress: () => router.back() },
			]);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Could not save the watermarked photo';
			Alert.alert('Save failed', message);
		} finally {
			setIsSaving(false);
		}
	}, [capturedUri, mediaPermission, requestMediaPermission, router]);

	if (!permission) {
		return <View className="flex-1 bg-slate-950" />;
	}

	if (!permission.granted) {
		return (
			<View className="flex-1 bg-slate-950 px-5 pb-8 pt-16">
				<View className="flex-1 justify-center">
					<View className="items-center rounded-4xl border border-white/10 bg-white/95 px-6 py-8">
						<View className="h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
							<Ionicons color="#10b981" name="camera-outline" size={36} />
						</View>
						<Text className="mt-5 text-center text-2xl font-extrabold text-slate-950">Camera access needed</Text>
						<Text className="mt-2 max-w-md text-center text-sm leading-6 text-slate-500">
							We need camera access to start the live preview right away.
						</Text>
						<Pressable
							accessibilityRole="button"
							className="mt-6 w-full max-w-sm rounded-2xl bg-emerald-500 px-5 py-4 active:opacity-90"
							onPress={requestPermission}
						>
							<Text className="text-center text-base font-bold text-white">Start camera</Text>
						</Pressable>
					</View>
				</View>
			</View>
		);
	}

	const shutterLabel = capturedUri ? 'Retake' : isCapturing ? 'Capturing…' : 'Capture';
	const shutterHint = capturedUri
		? 'Tap to discard and shoot again'
		: timer > 0
			? `${timer}s timer is armed`
			: 'Tap to capture a geo-tagged frame';
	const locationLabel = locationLabelFromCoords(coords, gpsState);
	const coordinateLabel = coordinateLabelFromCoords(coords, gpsState);
	const displayPlaceName = gpsState === 'locked' ? placeName : null;

	return (
        <Screen>
		<View className="flex-1 bg-slate-950">
			<CameraPreview
				cameraRef={cameraRef}
				capturedUri={capturedUri}
				enableTorch={enableTorch}
				facing={facing}
				flash={flash}
				gpsState={gpsState}
				isCapturing={isCapturing}
				isReady={isReady}
				onCameraReady={() => setIsReady(true)}
				onMountError={(event) => {
					const message = event.message ?? 'The camera preview could not start.';
					setIsReady(false);
					Alert.alert('Camera unavailable', message);
				}}
				onTapToFocus={() => lightTap()}
				coords={coords}
				timer={timer}
				timerCountdown={timerCountdown}
				torchSupported={hasTorch}
				zoom={zoom}
				leftActions={
					<>
						<CameraActionButton
							active={flash === 'on'}
							icon={
								<Ionicons
									color={flash === 'on' ? '#0f172a' : 'white'}
									name={flash === 'off' ? 'flash-off' : flash === 'on' ? 'flash' : 'flash-outline'}
									size={18}
								/>
							}
							label={`Flash ${flash}`}
							onPress={cycleFlash}
						/>
						<CameraActionButton
							active={timer > 0}
							icon={
								<Ionicons
									color={timer > 0 ? '#0f172a' : 'white'}
									name={timer === 0 ? 'timer-outline' : 'timer'}
									size={18}
								/>
							}
							label={timer === 0 ? 'Timer' : `${timer}s`}
							onPress={cycleTimer}
						/>
					</>
				}
				reticle={<CameraReticle active={!capturedUri} label={gpsState === 'locked' ? 'Subject framed' : 'Waiting for GPS…'} />}
				rightActions={
					<>
						<CameraActionButton
							active={facing === 'front'}
							icon={<Ionicons color={facing === 'front' ? '#0f172a' : 'white'} name="camera-reverse-outline" size={18} />}
							label="Flip"
							onPress={handleFlip}
						/>
						<CameraActionButton
							active={enableTorch}
							icon={<Ionicons color={enableTorch ? '#0f172a' : 'white'} name={enableTorch ? 'flash' : 'flash-outline'} size={18} />}
							label={enableTorch ? 'Torch on' : 'Torch'}
							onPress={toggleTorch}
						/>
					</>
				}
				topBar={
					<CameraTopBar
						accuracy={accuracy}
						accuracyLabel={accuracyLabel(accuracy)}
						gpsState={gpsState}
						locationLabel={displayPlaceName ?? locationLabel}
						subtitle={statusLabel}
						torchOn={enableTorch}
						torchSupported={hasTorch}
						onClose={() => router.back()}
						onToggleTorch={hasTorch ? toggleTorch : undefined}
					/>
				}
				zoomBar={<CameraZoomBar onChange={(value) => { setZoom(value); void lightTap(); }} options={ZOOM_OPTIONS} zoom={zoom} />}
				footer={
					<View className="items-center pt-1">
						<CameraCapture
							disabled={!isReady || isCapturing || timerCountdown != null}
							hint={shutterHint}
							isProcessing={isCapturing}
							label={shutterLabel}
							onPress={handleShutter}
						/>
					</View>
				}
			/>

			{gpsState === 'denied' && !capturedUri ? (
				<View pointerEvents="box-none" className="absolute bottom-40 left-4 right-4">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Allow location for watermark"
						className="rounded-3xl border border-amber-300/30 bg-slate-950/85 px-4 py-4 active:opacity-90"
						onPress={requestLocation}
					>
						<View className="flex-row items-center gap-3">
							<View className="h-11 w-11 items-center justify-center rounded-full bg-amber-400/20">
								<Ionicons color="#fde68a" name="navigate-circle-outline" size={22} />
							</View>
							<View className="min-w-0 flex-1">
								<Text className="text-base font-extrabold text-white">Location watermark is off</Text>
								<Text className="mt-0.5 text-xs leading-5 text-white/70">
									Allow location to stamp latitude, longitude, accuracy, and capture time.
								</Text>
							</View>
						</View>
					</Pressable>
				</View>
			) : null}

			{capturedUri ? (
				<CapturedReview
					ref={watermarkedPhotoRef}
					accuracyLabel={accuracyLabel(accuracy)}
					coordinateLabel={coordinateLabel}
					gpsState={gpsState}
					isSaving={isSaving}
					locationLabel={locationLabel}
					placeName={displayPlaceName}
					timestamp={capturedAt ?? undefined}
					uri={capturedUri}
					onRequestLocation={requestLocation}
					onRetake={() => {
						setCapturedUri(null);
						setCapturedAt(null);
						void lightTap();
					}}
					onSave={handleSave}
				/>
			) : null}
		</View>
        </Screen>
	);
}
