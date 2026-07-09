import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { CameraCaptureProps } from '../types/geoCamers.type';

export function CameraCapture({
	onPress,
	disabled = false,
	isProcessing = false,
	label = 'Capture',
	hint = 'Use the shutter to start capturing now',
}: CameraCaptureProps) {
	const buttonStateClass = disabled ? 'opacity-50' : 'active:opacity-80';
	const inner = isProcessing ? (
		<View className="h-18 w-18 items-center justify-center rounded-full border border-white/70 bg-white shadow-sm">
			<View className="h-2 w-2 animate-pulse rounded-full bg-slate-900" />
		</View>
	) : (
		<View className="h-18 w-18 items-center justify-center rounded-full border border-white/70 bg-white shadow-sm">
			<Ionicons color="#0f172a" name="camera" size={26} />
		</View>
	);

	return (
		<View className="items-center">
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={label}
				className={`items-center justify-center rounded-full border-2 border-white p-1.5 ${buttonStateClass}`}
				disabled={disabled}
				onPress={onPress}
			>
				{inner}
			</Pressable>
			<Text className="mt-2 text-sm font-bold text-white">{label}</Text>
			<Text className="mt-0.5 text-[11px] leading-4 text-white/70">{hint}</Text>
		</View>
	);
}
