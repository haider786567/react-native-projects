import { Pressable, Text, View } from 'react-native';
import type { CameraZoomBarProps, CameraZoomOption } from '../types/geoCamers.type';
import { ZOOM_OPTIONS } from '../constants/camera.constants';

function pickActive(options: CameraZoomOption[], zoom: number) {
	let best = options[0];
	let bestDiff = Math.abs(options[0].value - zoom);
	for (const option of options) {
		const diff = Math.abs(option.value - zoom);
		if (diff < bestDiff) {
			best = option;
			bestDiff = diff;
		}
	}
	return best;
}

export function CameraZoomBar({ zoom, options = ZOOM_OPTIONS, onChange }: CameraZoomBarProps) {
	const active = pickActive(options, zoom);
	return (
		<View className="flex-row items-center justify-center gap-2 self-center rounded-full bg-slate-950/55 px-2 py-1.5">
			{options.map((value) => {
				const isActive = active === value;
				return (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={`Set zoom to ${value.label}`}
						className={`min-w-11 items-center justify-center rounded-full px-3 py-1.5 active:opacity-80 ${isActive ? 'bg-white' : ''}`}
						key={value.label}
						onPress={() => onChange(value.value)}
					>
						<Text className={`text-xs font-bold ${isActive ? 'text-slate-950' : 'text-white/80'}`}>{value.label}</Text>
					</Pressable>
				);
			})}
		</View>
	);
}
