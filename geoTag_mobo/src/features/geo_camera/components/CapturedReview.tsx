import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import type { CapturedReviewProps } from '../types/geoCamers.type';

export const CapturedReview = forwardRef<View, CapturedReviewProps>(function CapturedReview({
	uri,
	locationLabel = 'Location unavailable',
	placeName,
	coordinateLabel,
	accuracyLabel = 'Accuracy 4.2 m',
	timestamp,
	gpsState = 'locked',
	onRequestLocation,
	onRetake,
	onSave,
	onCrop,
	isSaving = false,
	isCropping = false,
}, ref) {
	const stamp = timestamp ?? new Date().toLocaleString();
	const isGpsDenied = gpsState === 'denied';
	const title = placeName || locationLabel;
	const coordinates = coordinateLabel ?? locationLabel;

	return (
		<View className="absolute inset-0 bg-slate-950">
			<View ref={ref} collapsable={false} className="absolute inset-0 bg-slate-950">
				<Image accessibilityLabel="Captured photo" className="h-full w-full" resizeMode="cover" source={{ uri }} />

				<View className="absolute inset-0 bg-black/10" />

				<View className="absolute bottom-36 left-4 right-4 rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3">
					<View className="flex-row items-center gap-2">
						<View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
							<Ionicons color="#a7f3d0" name={isGpsDenied ? 'location-outline' : 'location'} size={16} />
						</View>
						<View className="min-w-0 flex-1">
							<Text className="text-[11px] font-bold uppercase text-emerald-200">Captured by Buildrigs</Text>
							<Text className="mt-1 text-sm font-extrabold text-white" numberOfLines={3}>
								{title}
							</Text>
						</View>
						<View className="rounded-full bg-white/10 px-2.5 py-1">
							<Text className="text-[11px] font-bold text-white">{accuracyLabel}</Text>
						</View>
					</View>
					<View className="mt-2 flex-row items-center gap-2">
						<Ionicons color="#cbd5e1" name="navigate-outline" size={13} />
						<Text className="flex-1 text-xs font-semibold text-white/85" numberOfLines={1}>
							{coordinates}
						</Text>
					</View>
					<View className="mt-2 flex-row items-center gap-2">
						<Ionicons color="#cbd5e1" name="time-outline" size={13} />
						<Text className="text-xs font-medium text-white/75">{stamp}</Text>
					</View>
				</View>
			</View>

			<View className="absolute left-0 right-4 top-14 flex-row items-start justify-between">
				<View>
					<Text className="text-xs font-semibold uppercase tracking-[2px] text-emerald-300">Captured</Text>
					<Text className="mt-1 text-2xl font-extrabold text-white">Review your shot</Text>
				</View>
				{/* <View className="items-center-safe gap-2">
					<View className="rounded-full bg-emerald-500/20 px-2 py-1.5 justify-center">
						<Text className="text-[10px] font-semibold text-emerald-100 items-center justify-center-safe" numberOfLines={2}>
							{title}
						</Text>
					</View>
					<View className="rounded-full bg-white/15 px-3 py-1.5">
						<Text className="text-[11px] font-semibold text-white">{accuracyLabel}</Text>
					</View>
				</View> */}
			</View>

			<View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4">
				{isGpsDenied ? (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Allow location for watermark"
						className="rounded-2xl border border-amber-300/30 bg-amber-400/20 px-4 py-3 active:opacity-85"
						onPress={onRequestLocation}
					>
						<View className="flex-row items-center gap-2">
							<Ionicons color="#fde68a" name="navigate-circle-outline" size={18} />
							<Text className="flex-1 text-sm font-bold text-amber-50">Allow location to stamp exact GPS on this photo</Text>
						</View>
					</Pressable>
				) : null}

				<View className="mt-4 flex-row items-center gap-3">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Retake photo"
						className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 active:opacity-80"
						onPress={onRetake}
					>
						<Ionicons color="white" name="refresh" size={18} />
						<Text className="text-base font-bold text-white">Retake</Text>
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Crop photo"
						className="h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-amber-500/90 active:opacity-80"
						disabled={isCropping}
						onPress={onCrop}
					>
						<Ionicons color="white" name="crop" size={22} />
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Save photo to record"
						className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-500 active:opacity-90"
						disabled={isSaving}
						onPress={onSave}
					>
						{isSaving ? (
							<ActivityIndicator color="white" />
						) : (
							<>
								<Ionicons color="white" name="checkmark" size={18} />
								<Text className="text-base font-bold text-white">Use this shot</Text>
							</>
						)}
					</Pressable>
				</View>
			</View>
		</View>
	);
});
