import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { LocationObjectCoords } from 'expo-location';

type PdfWatermarkProps = {
	coords: LocationObjectCoords | null;
	placeName: string | null;
	accuracy: number | null;
	capturedAt: string;
};

function formatCoord(value: number) {
	return value.toFixed(4);
}

export function PdfWatermark({ coords, placeName, accuracy, capturedAt }: PdfWatermarkProps) {
	const locationText = coords
		? `Lat ${formatCoord(coords.latitude)}  Lon ${formatCoord(coords.longitude)}`
		: 'Location unavailable';
	const placeText = placeName ?? (coords ? `${formatCoord(coords.latitude)}, ${formatCoord(coords.longitude)}` : 'Unknown location');
	const accuracyText = accuracy != null ? `±${accuracy.toFixed(0)} m` : '— m';

	return (
		<View className="absolute bottom-0 left-0 right-0 bg-slate-950/85 px-4 py-3">
			<View className="flex-row items-center gap-2">
				<View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
					<Ionicons color="#a7f3d0" name="location" size={16} />
				</View>
				<View className="min-w-0 flex-1">
					<Text className="text-[11px] font-bold uppercase text-emerald-200">Captured by Buildrigs</Text>
					<Text className="mt-0.5 text-sm font-extrabold text-white" numberOfLines={2}>
						{placeText}
					</Text>
				</View>
				<View className="rounded-full bg-white/10 px-2.5 py-1">
					<Text className="text-[11px] font-bold text-white">{accuracyText}</Text>
				</View>
			</View>
			<View className="mt-2 flex-row items-center gap-2">
				<Ionicons color="#cbd5e1" name="navigate-outline" size={13} />
				<Text className="flex-1 text-xs font-semibold text-white/85" numberOfLines={1}>
					{locationText}
				</Text>
			</View>
			<View className="mt-1.5 flex-row items-center gap-2">
				<Ionicons color="#cbd5e1" name="time-outline" size={13} />
				<Text className="text-xs font-medium text-white/75">{capturedAt}</Text>
			</View>
		</View>
	);
}
