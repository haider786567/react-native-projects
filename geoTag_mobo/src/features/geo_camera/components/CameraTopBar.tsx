import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { CameraTopBarProps } from '../types/geoCamers.type';

function getGpsColor(state: 'searching' | 'locked' | 'denied', accuracy?: number | null) {
	if (state === 'denied') return { bg: 'bg-rose-500/20', text: 'text-rose-100', dot: 'bg-rose-400' };
	if (state === 'searching') return { bg: 'bg-amber-500/20', text: 'text-amber-100', dot: 'bg-amber-300' };
	if (accuracy != null && accuracy > 30) return { bg: 'bg-amber-500/20', text: 'text-amber-100', dot: 'bg-amber-300' };
	return { bg: 'bg-emerald-500/20', text: 'text-emerald-100', dot: 'bg-emerald-400' };
}

function getGpsLabel(state: 'searching' | 'locked' | 'denied', accuracy?: number | null) {
	if (state === 'denied') return 'GPS off';
	if (state === 'searching') return 'Locating…';
	if (accuracy != null) return `±${accuracy.toFixed(0)} m`;
	return 'GPS locked';
}

export function CameraTopBar({
	title = 'Geo Camera',
	subtitle = 'Tap shutter to capture',
	locationLabel = 'GPS locked',
	accuracyLabel,
	accuracy,
	gpsState = 'locked',
	torchSupported = false,
	torchOn = false,
	onClose,
	onToggleTorch,
}: CameraTopBarProps) {
	const colors = getGpsColor(gpsState, accuracy);
	const gpsText = accuracyLabel ?? getGpsLabel(gpsState, accuracy);

	return (
		<View className="px-2 pt-3">
			<View className="flex-row items-center justify-between rounded-3xl bg-slate-950/55 px-3 py-2.5">
				<View className="flex-row items-center gap-2">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Close camera"
						className="h-6 w-8 items-center justify-center rounded-full bg-white/10 active:opacity-70"
						onPress={onClose}
					>
						<Ionicons color="white" name="chevron-down" size={15} />
					</Pressable>
					<View>
						<Text className="text-base font-extrabold text-white" numberOfLines={1}>
							{title}
						</Text>
						<Text className="text-[11px] font-medium text-white/70" numberOfLines={1}>
							{subtitle}
						</Text>
					</View>
				</View>

				<View className="flex-row items-center gap-2">
					<View className={`flex-row items-center gap-1.5 rounded-full ${colors.bg} px-2.5 py-1.5`}>
						<View className={`h-2 w-2 rounded-full ${colors.dot}`} />
						<Text className={`text-[11px] font-semibold ${colors.text}`} numberOfLines={1}>
							{gpsText}
						</Text>
					</View>

					<View className="rounded-3xl w-40 h-12 bg-white/10 px-3 py-2">
						<Text className="text-[0.7rem] font-semibold text-white" numberOfLines={2}>
							{locationLabel}
						</Text>
					</View>

					{torchSupported ? (
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={torchOn ? 'Turn torch off' : 'Turn torch on'}
							className={`h-10 w-10 items-center justify-center rounded-full active:opacity-70 ${torchOn ? 'bg-amber-400' : 'bg-white/10'}`}
							onPress={onToggleTorch}
						>
							<Ionicons color={torchOn ? '#0f172a' : 'white'} name={torchOn ? 'flash' : 'flash-off'} size={18} />
						</Pressable>
					) : null}
				</View>
			</View>
		</View>
	);
}
