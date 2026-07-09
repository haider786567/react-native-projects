import type { CameraTimerOption, CameraZoomOption } from '../types/geoCamers.type';

export const ZOOM_OPTIONS: CameraZoomOption[] = [
	{ label: '1×', value: 0 },
	{ label: '1.5×', value: 0.15 },
	{ label: '2×', value: 0.35 },
	{ label: '3×', value: 0.65 },
];

export const TIMER_OPTIONS: CameraTimerOption[] = [0, 3, 10];