import type { CameraTimerOption } from '../types/geoCamers.type';

type CameraGpsState = 'searching' | 'locked' | 'denied';

type Coordinates = { latitude: number; longitude: number } | null;

function formatCoord(value: number) {
	return value.toFixed(4);
}

export function formatLocationLabel(coords: Coordinates, gpsState?: CameraGpsState) {
	if (gpsState === 'denied') return 'Location permission denied';
	if (!coords) return 'Locating…';
	return `${formatCoord(coords.latitude)}, ${formatCoord(coords.longitude)}`;
}

export function formatCoordinateLabel(coords: Coordinates, gpsState?: CameraGpsState) {
	if (gpsState === 'denied') return 'Latitude/longitude unavailable';
	if (!coords) return 'Finding latitude and longitude…';
	return `Lat ${formatCoord(coords.latitude)}  Lon ${formatCoord(coords.longitude)}`;
}

export function formatAccuracyLabel(value: number | null) {
	if (value == null) return 'Accuracy — m';
	return `±${value.toFixed(0)} m`;
}

export function getCameraStatusLabel(isReady: boolean, capturedUri: string | null) {
	if (capturedUri) return 'Reviewing';
	if (!isReady) return 'Starting camera';
	return 'Live preview';
}

export function getShutterLabel(capturedUri: string | null, isCapturing: boolean) {
	if (capturedUri) return 'Retake';
	if (isCapturing) return 'Capturing…';
	return 'Capture';
}

export function getShutterHint(capturedUri: string | null, timer: CameraTimerOption) {
	if (capturedUri) return 'Tap to discard and shoot again';
	if (timer > 0) return `${timer}s timer is armed`;
	return 'Tap to capture a geo-tagged frame';
}

export function cycleTimerOption(current: CameraTimerOption, options: CameraTimerOption[]) {
	const index = options.indexOf(current);
	return options[(index + 1) % options.length];
}