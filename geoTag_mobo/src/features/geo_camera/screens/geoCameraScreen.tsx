import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import Screen from '@/src/components/Screen';

import { ZOOM_OPTIONS } from '../constants/camera.constants';
import { CameraActionButton } from '../components/CameraActionButton';
import { CameraCapture } from '../components/CameraCapture';
import { CameraPreview } from '../components/CameraPreview';
import { CameraReticle } from '../components/CameraReticle';
import { CameraTopBar } from '../components/CameraTopBar';
import { CameraZoomBar } from '../components/CameraZoomBar';
import { CapturedReview } from '../components/CapturedReview';
import { CropOverlay } from '../components/CropOverlay';
import { useGeoCameraController } from '../hooks/useGeoCameraController';

export default function GeoCameraScreen() {
	const {
		accuracyLabel,
		capturedAt,
		capturedUri,
		cameraRef,
		coordinateLabel,
		coords,
		displayPlaceName,
		enableTorch,
		facing,
		flash,
		gpsState,
		handleCameraReady,
		handleCropApply,
		handleFlip,
		handleMountError,
		handleRetake,
		handleSave,
		handleShutter,
		handleTapToFocus,
		hideCrop,
		isCapturing,
		isCropVisible,
		isCropping,
		isReady,
		isSaving,
		locationLabel,
		permission,
		onClose,
		requestLocation,
		requestPermission,
		setZoom,
		showCrop,
		shutterHint,
		shutterLabel,
		statusLabel,
		timer,
		timerCountdown,
		torchSupported,
		toggleTorch,
		watermarkedPhotoRef,
		zoom,
		cycleFlash,
		cycleTimer,
	} = useGeoCameraController();

	if (!permission) {
		return <View className="flex-1 bg-slate-950" />;
	}

	if (!permission.granted) {
		return (
			<View className="flex-1 bg-slate-950 px-5 pb-8 pt-16">
				<View className="flex-1 justify-center">
					<View className="items-center rounded-4xl border border-white/10 bg-white/95 px-6 py-8">
						<View className="h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
							<Ionicons color="#10b981" name="camera-outline" size={36} />
						</View>
						<Text className="mt-5 text-center text-2xl font-extrabold text-slate-950">Camera access needed</Text>
						<Text className="mt-2 max-w-md text-center text-sm leading-6 text-slate-500">
							We need camera access to start the live preview right away.
						</Text>
						<Pressable
							accessibilityRole="button"
							className="mt-6 w-full max-w-sm rounded-2xl bg-emerald-500 px-5 py-4 active:opacity-90"
							onPress={requestPermission}
						>
							<Text className="text-center text-base font-bold text-white">Start camera</Text>
						</Pressable>
					</View>
				</View>
			</View>
		);
	}

	return (
		<Screen>
			<View className="flex-1 bg-slate-950">
				<CameraPreview
					cameraRef={cameraRef}
					capturedUri={capturedUri}
					enableTorch={enableTorch}
					facing={facing}
					flash={flash}
					gpsState={gpsState}
					isCapturing={isCapturing}
					isReady={isReady}
					onCameraReady={handleCameraReady}
					onMountError={handleMountError}
					onTapToFocus={handleTapToFocus}
					coords={coords}
					timer={timer}
					timerCountdown={timerCountdown}
					torchSupported={torchSupported}
					zoom={zoom}
					leftActions={
						<>
							<CameraActionButton
								active={flash === 'on'}
								icon={
									<Ionicons
										color={flash === 'on' ? '#0f172a' : 'white'}
										name={flash === 'off' ? 'flash-off' : flash === 'on' ? 'flash' : 'flash-outline'}
										size={18}
									/>
								}
								label={`Flash ${flash}`}
								onPress={cycleFlash}
							/>
							<CameraActionButton
								active={timer > 0}
								icon={
									<Ionicons
										color={timer > 0 ? '#0f172a' : 'white'}
										name={timer === 0 ? 'timer-outline' : 'timer'}
										size={18}
									/>
								}
								label={timer === 0 ? 'Timer' : `${timer}s`}
								onPress={cycleTimer}
							/>
						</>
					}
					reticle={<CameraReticle active={!capturedUri} label={gpsState === 'locked' ? 'Subject framed' : 'Waiting for GPS…'} />}
					rightActions={
						<>
							<CameraActionButton
								active={facing === 'front'}
								icon={<Ionicons color={facing === 'front' ? '#0f172a' : 'white'} name="camera-reverse-outline" size={18} />}
								label="Flip"
								onPress={handleFlip}
							/>
							<CameraActionButton
								active={enableTorch}
								icon={<Ionicons color={enableTorch ? '#0f172a' : 'white'} name={enableTorch ? 'flash' : 'flash-outline'} size={18} />}
								label={enableTorch ? 'Torch on' : 'Torch'}
								onPress={toggleTorch}
							/>
						</>
					}
					topBar={
						<CameraTopBar
							accuracy={null}
							accuracyLabel={accuracyLabel}
							gpsState={gpsState}
							locationLabel={displayPlaceName ?? locationLabel}
							subtitle={statusLabel}
							torchOn={enableTorch}
							torchSupported={torchSupported}
							onClose={onClose}
							onToggleTorch={toggleTorch}
						/>
					}
					zoomBar={<CameraZoomBar onChange={setZoom} options={ZOOM_OPTIONS} zoom={zoom} />}
					footer={
						<View className="items-center pt-1">
							<CameraCapture
								disabled={!isReady || isCapturing || timerCountdown != null}
								hint={shutterHint}
								isProcessing={isCapturing}
								label={shutterLabel}
								onPress={handleShutter}
							/>
						</View>
					}
				/>

				{gpsState === 'denied' && !capturedUri ? (
					<View pointerEvents="box-none" className="absolute bottom-40 left-4 right-4">
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Allow location for watermark"
							className="rounded-3xl border border-amber-300/30 bg-slate-950/85 px-4 py-4 active:opacity-90"
							onPress={requestLocation}
						>
							<View className="flex-row items-center gap-3">
								<View className="h-11 w-11 items-center justify-center rounded-full bg-amber-400/20">
									<Ionicons color="#fde68a" name="navigate-circle-outline" size={22} />
								</View>
								<View className="min-w-0 flex-1">
									<Text className="text-base font-extrabold text-white">Location watermark is off</Text>
									<Text className="mt-0.5 text-xs leading-5 text-white/70">
										Allow location to stamp latitude, longitude, accuracy, and capture time.
									</Text>
								</View>
							</View>
						</Pressable>
					</View>
				) : null}

				{capturedUri ? (
					<CapturedReview
						ref={watermarkedPhotoRef}
						accuracyLabel={accuracyLabel}
						coordinateLabel={coordinateLabel}
						gpsState={gpsState}
						isSaving={isSaving}
						isCropping={isCropping}
						locationLabel={locationLabel}
						placeName={displayPlaceName}
						timestamp={capturedAt ?? undefined}
						uri={capturedUri}
						onRequestLocation={requestLocation}
						onRetake={handleRetake}
						onSave={handleSave}
						onCrop={showCrop}
					/>
				) : null}

				{isCropVisible && capturedUri ? (
					<CropOverlay
						uri={capturedUri}
						isCropping={isCropping}
						onApply={handleCropApply}
						onCancel={hideCrop}
					/>
				) : null}
			</View>
		</Screen>
	);
}