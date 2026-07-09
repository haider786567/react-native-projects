import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CameraPreviewProps } from '../types/geoCamers.type';

export function CameraPreview({
	cameraRef,
	facing,
	zoom,
	flash,
	enableTorch,
	timer,
	isReady = true,
	isCapturing = false,
	capturedUri,
	timerCountdown,
	topBar,
	zoomBar,
	leftActions,
	rightActions,
	reticle,
	footer,
	onCameraReady,
	onMountError,
	onTapToFocus,
}: CameraPreviewProps) {
	const cameraZoom = Number.isFinite(zoom) ? Math.min(1, Math.max(0, zoom)) : 0;

	return (
		<View className="flex-1 bg-slate-950">
			<View style={StyleSheet.absoluteFill}>
				<CameraView
					key={facing}
					ref={cameraRef}
					active
					enableTorch={enableTorch}
					facing={facing}
					flash={flash}
					mode="picture"
					onCameraReady={onCameraReady}
					onMountError={onMountError}
					style={StyleSheet.absoluteFill}
					zoom={cameraZoom}
				/>
				<Pressable
					onPress={(event) => {
						const { locationX, locationY } = event.nativeEvent;
						onTapToFocus?.({ x: locationX, y: locationY });
					}}
					style={StyleSheet.absoluteFill}
				/>
			</View>

			<View pointerEvents="box-none" className="absolute inset-0">
				<View pointerEvents="box-none" className="absolute left-0 right-0 top-0">
					{topBar}
				</View>

				<View pointerEvents="box-none" className="absolute inset-0 items-center justify-center">
					{reticle}
				</View>

				{timerCountdown != null && timerCountdown > 0 ? (
					<View pointerEvents="none" className="absolute inset-0 items-center justify-center bg-black/30">
						<View className="h-28 w-28 items-center justify-center rounded-full bg-slate-950/70">
							<Text className="text-5xl font-extrabold text-white">{timerCountdown}</Text>
						</View>
					</View>
				) : null}

				<View pointerEvents="box-none" className="absolute bottom-0 left-0 right-0">
					<View className="px-4 pb-3">
						<View className="flex-row items-end justify-between">
							<View className="gap-3">{leftActions}</View>
							<View className="items-center gap-3">
								{zoomBar}
								{footer}
							</View>
							<View className="items-end gap-3">{rightActions}</View>
						</View>
					</View>
				</View>

				{isCapturing ? <View pointerEvents="none" className="absolute inset-0 bg-white" /> : null}

				{capturedUri ? (
					<View className="absolute right-4 top-24 overflow-hidden rounded-2xl border border-white/25 bg-slate-950/85 p-1">
						<View className="h-20 w-14 items-center justify-center bg-slate-800">
							<Ionicons color="#a7f3d0" name="image" size={18} />
						</View>
						<View className="absolute bottom-1 left-1 rounded-full bg-emerald-500 px-2 py-0.5">
							<Text className="text-[10px] font-bold text-white">Shot</Text>
						</View>
					</View>
				) : null}

				{!isReady ? (
					<View className="absolute inset-0 items-center justify-center bg-slate-950/55">
						<View className="items-center rounded-2xl bg-white px-5 py-4 shadow-lg">
							<ActivityIndicator color="#10b981" />
							<Text className="mt-2 text-sm font-semibold text-slate-900">Preparing camera</Text>
							{timer > 0 ? (
								<Text className="mt-0.5 text-[11px] text-slate-500">{timer}s timer armed</Text>
							) : null}
						</View>
					</View>
				) : null}
			</View>

		</View>
	);
}
