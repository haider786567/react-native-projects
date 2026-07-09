import { Pressable, Text, View } from 'react-native';
import type { CameraZoomBarProps, CameraZoomOption } from '../types/geoCamers.type';

const DEFAULT_OPTIONS: CameraZoomOption[] = [
	{ label: '1×', value: 0 },
	{ label: '1.5×', value: 0.15 },
	{ label: '2×', value: 0.35 },
	{ label: '3×', value: 0.65 },
];

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

export function CameraZoomBar({ zoom, options = DEFAULT_OPTIONS, onChange }: CameraZoomBarProps) {
	const active = pickActive(options, zoom);
	return (
		<View className="flex-row items-center justify-center gap-2 self-center rounded-full bg-slate-950/55 px-2 py-1.5">
			{options.map((value) => {
				const isActive = active === value;
				return (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={`Set zoom to ${value.label}`}
						className={`min-w-[44px] items-center justify-center rounded-full px-3 py-1.5 active:opacity-80 ${isActive ? 'bg-white' : ''}`}
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
