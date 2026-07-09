import type { CameraView } from 'expo-camera';
import type { ReactNode, RefObject } from 'react';
import type { LocationObjectCoords } from 'expo-location';

export type CameraFacing = 'back' | 'front';
export type CameraFlashMode = 'off' | 'on' | 'auto';
export type CameraTimerOption = 0 | 3 | 10;

export type CameraCaptureProps = {
	onPress?: () => void;
	disabled?: boolean;
	isProcessing?: boolean;
	label?: string;
	hint?: string;
};

export type CameraTopBarProps = {
	title?: string;
	subtitle?: string;
	locationLabel?: string;
	accuracyLabel?: string;
	accuracy?: number | null;
	gpsState?: 'searching' | 'locked' | 'denied';
	torchSupported?: boolean;
	torchOn?: boolean;
	onClose?: () => void;
	onToggleTorch?: () => void;
};

export type CameraReticleProps = {
	active?: boolean;
	label?: string;
};

export type CameraActionButtonProps = {
	icon: ReactNode;
	label?: string;
	active?: boolean;
	disabled?: boolean;
	onPress?: () => void;
};

export type CameraZoomBarProps = {
	zoom: number;
	options?: CameraZoomOption[];
	minZoom?: number;
	maxZoom?: number;
	onChange: (zoom: number) => void;
};

export type CameraZoomOption = {
	label: string;
	value: number;
};

export type CropRegion = {
	originX: number;
	originY: number;
	width: number;
	height: number;
};

export type CapturedReviewProps = {
	uri: string;
	locationLabel?: string;
	placeName?: string | null;
	coordinateLabel?: string;
	accuracyLabel?: string;
	timestamp?: string;
	gpsState?: 'searching' | 'locked' | 'denied';
	onRequestLocation?: () => void;
	onRetake: () => void;
	onSave: () => void;
	onCrop?: () => void;
	isSaving?: boolean;
	isCropping?: boolean;
};

export type CameraPreviewProps = {
	cameraRef: RefObject<CameraView | null>;
	facing: CameraFacing;
	zoom: number;
	flash: CameraFlashMode;
	enableTorch: boolean;
	timer: CameraTimerOption;
	coords: LocationObjectCoords | null;
	gpsState: 'searching' | 'locked' | 'denied';
	torchSupported: boolean;
	isReady: boolean;
	isCapturing: boolean;
	capturedUri: string | null;
	timerCountdown: number | null;
	topBar: ReactNode;
	zoomBar: ReactNode;
	leftActions: ReactNode;
	rightActions: ReactNode;
	reticle: ReactNode;
	footer: ReactNode;
	onCameraReady?: () => void;
	onMountError?: (event: { message?: string }) => void;
	onTapToFocus?: (event: { x: number; y: number }) => void;
};
