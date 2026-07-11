import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Screen from '@/src/components/Screen';
import { usePdfScanner } from '../hooks/pdf.hooks';
import { PdfPageReview } from '../components/PdfPageReview';
import { useTranslation } from '../../../store/hooks';
import { useTheme } from '../../../constants/theme';

export default function PdfScannerScreen() {
	const { t } = useTranslation();
	const { isDark } = useTheme();
	const c = {
		bg: isDark ? '#0f172a' : '#f8f9fa',
		card: isDark ? 'bg-slate-900 border border-white/5' : 'bg-white border border-slate-200 shadow-sm',
		text: isDark ? 'text-white' : 'text-slate-900',
		textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
		border: isDark ? 'border-white/5' : 'border-slate-200',
		tealPillBg: isDark ? 'bg-teal-950/45' : 'bg-teal-50',
		tealText: isDark ? 'text-teal-400' : 'text-[#006767]',
		amberPillBg: isDark ? 'bg-amber-950/45' : 'bg-amber-50',
		amberText: isDark ? 'text-amber-400' : 'text-[#f59e0b]',
		indigoPillBg: isDark ? 'bg-indigo-950/45' : 'bg-indigo-50',
		indigoText: isDark ? 'text-indigo-400' : 'text-[#4f46e5]',
	};

	const {
		cameraRef,
		pageRefs,
		permission,
		requestPermission,
		mode,
		pages,
		currentPageIndex,
		isCapturing,
		isSaving,
		isCameraReady,
		gpsState,
		handleCameraReady,
		handleStartScanning,
		handleCapturePage,
		handleReviewPages,
		handleAddMore,
		handleRemovePage,
		handleSavePdf,
		handleBackToIdle,
		setCurrentPageIndex,
		isCropVisible,
		setIsCropVisible,
		isCropping,
		handleApplyCrop,
	} = usePdfScanner();

	// ──────────────────────────── Idle mode ────────────────────────────
	if (mode === 'idle') {
		return (
			<Screen>
				<View className="flex-1 px-5 pt-8" style={{ backgroundColor: c.bg }}>
					{/* Header */}
					<View className="mb-6">
						<Text className={`text-3xl font-extrabold tracking-tight ${c.text}`}>{t.pdfScannerTitle}</Text>
						<Text className={`mt-1 text-sm leading-5 ${c.textMuted}`}>
							{t.pdfScannerSubtitle}
						</Text>
					</View>

					{/* Scanner card */}
					<View className={`items-center rounded-2xl px-6 py-8 ${c.card}`}>
						<View className="h-24 w-24 items-center justify-center rounded-full bg-teal-50/10">
							<View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#006767]">
								<Ionicons color="white" name="document-text-outline" size={32} />
							</View>
						</View>
						<Text className={`mt-6 text-center text-2xl font-bold ${c.text}`}>{t.scanADoc}</Text>
						<Text className={`mt-2 max-w-md text-center text-sm leading-6 ${c.textMuted}`}>
							{t.scanADocDesc}
						</Text>
						<Pressable
							accessibilityRole="button"
							className="mt-6 w-full max-w-sm flex-row items-center justify-center rounded-xl bg-[#006767] py-4 active:opacity-85"
							onPress={handleStartScanning}
						>
							<Ionicons color="white" name="scan" size={20} />
							<Text className="ml-2 font-bold text-white">{t.startScanning}</Text>
						</Pressable>
					</View>

					{/* Info cards */}
					<View className="mt-6 gap-3">
						<View className={`flex-row items-center rounded-2xl p-4 ${c.card}`}>
							<View className={`h-11 w-11 items-center justify-center rounded-xl ${c.tealPillBg}`}>
								<Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="location" size={22} />
							</View>
							<View className="mx-3 flex-1">
								<Text className={`font-semibold ${c.text}`}>{t.locWatermark}</Text>
								<Text className={`mt-0.5 text-xs ${c.textMuted}`}>
									{t.locWatermarkDesc}
								</Text>
							</View>
						</View>
						<View className={`flex-row items-center rounded-2xl p-4 ${c.card}`}>
							<View className={`h-11 w-11 items-center justify-center rounded-xl ${c.amberPillBg}`}>
								<Ionicons color="#f59e0b" name="time" size={22} />
							</View>
							<View className="mx-3 flex-1">
								<Text className={`font-semibold ${c.text}`}>{t.timestamp}</Text>
								<Text className={`mt-0.5 text-xs ${c.textMuted}`}>
									{t.timestampDesc}
								</Text>
							</View>
						</View>
						<View className={`flex-row items-center rounded-2xl p-4 ${c.card}`}>
							<View className={`h-11 w-11 items-center justify-center rounded-xl ${c.indigoPillBg}`}>
								<Ionicons color="#4f46e5" name="document-attach" size={22} />
							</View>
							<View className="mx-3 flex-1">
								<Text className={`font-semibold ${c.text}`}>{t.downloadPdf}</Text>
								<Text className={`mt-0.5 text-xs ${c.textMuted}`}>
									{t.downloadPdfDesc}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</Screen>
		);
	}

	// ──────────────────────────── Camera mode ────────────────────────────
	if (mode === 'camera') {
		if (!permission) {
			return <View className="flex-1 bg-slate-950" />;
		}

		if (!permission.granted) {
			return (
				<View className="flex-1 items-center justify-center bg-slate-950 px-5">
					<View className="items-center rounded-4xl border border-white/10 bg-white/95 px-6 py-8">
						<View className="h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
							<Ionicons color="#4f46e5" name="camera-outline" size={36} />
						</View>
						<Text className="mt-5 text-center text-2xl font-extrabold text-slate-950">{t.cameraAccessNeeded}</Text>
						<Text className="mt-2 max-w-md text-center text-sm leading-6 text-slate-500">
							{t.cameraAccessDesc}
						</Text>
						<Pressable
							className="mt-6 w-full max-w-sm rounded-2xl bg-indigo-600 px-5 py-4 active:opacity-90"
							onPress={requestPermission}
						>
							<Text className="text-center text-base font-bold text-white">{t.startCamera}</Text>
						</Pressable>
					</View>
				</View>
			);
		}

		return (
			<View className="flex-1 bg-slate-950">
				{/* Camera */}
				<View className="flex-1">
					<CameraView
						ref={cameraRef}
						active
						facing="back"
						mode="picture"
						onCameraReady={handleCameraReady}
						style={StyleSheet.absoluteFill}
					/>

					{/* Overlay UI */}
					<View pointerEvents="box-none" className="absolute inset-0">
						{/* Top bar */}
						<View className="flex-row items-center justify-between px-4 pt-14">
							<Pressable
								accessibilityRole="button"
								accessibilityLabel="Back"
								className="h-10 w-10 items-center justify-center rounded-full bg-slate-950/55 active:opacity-70"
								onPress={handleBackToIdle}
							>
								<Ionicons color="white" name="chevron-down" size={20} />
							</Pressable>
							<View className="items-center">
								<Text className="text-base font-extrabold text-white">{t.pdfScannerTitle}</Text>
								<Text className="text-[11px] font-medium text-white/70">
									{gpsState === 'locked' ? 'GPS locked' : gpsState === 'searching' ? 'Locating…' : 'GPS off'}
								</Text>
							</View>
							{pages.length > 0 ? (
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="Review pages"
									className="flex-row items-center gap-1.5 rounded-full bg-[#006767] px-3 py-2 active:opacity-80"
									onPress={handleReviewPages}
								>
									<Text className="text-sm font-bold text-white">{pages.length}</Text>
									<Ionicons color="white" name="documents-outline" size={16} />
								</Pressable>
							) : (
								<View className="w-10" />
							)}
						</View>

						{/* Document frame guide */}
						<View pointerEvents="none" className="absolute inset-0 items-center justify-center">
							<View className="h-[55%] w-[85%] items-center justify-center">
								{/* Corner brackets */}
								<View className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-[3px] border-t-[3px] border-white/80" />
								<View className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-[3px] border-t-[3px] border-white/80" />
								<View className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-[3px] border-l-[3px] border-white/80" />
								<View className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-[3px] border-r-[3px] border-white/80" />

								<View className="rounded-full bg-slate-950/55 px-4 py-2">
									<Text className="text-sm font-semibold text-white">
										{pages.length === 0 ? t.alignDoc : `Page ${pages.length + 1}`}
									</Text>
								</View>
							</View>
						</View>

						{/* Bottom controls */}
						<View className="absolute bottom-0 left-0 right-0 px-4 pb-10 pt-4">
							{/* Page count */}
							{pages.length > 0 ? (
								<View className="mb-4 items-center">
									<View className="flex-row items-center gap-2 rounded-full bg-slate-950/70 px-4 py-2">
										<Ionicons color="#a7f3d0" name="documents" size={16} />
										<Text className="text-sm font-bold text-white">
											{pages.length} {pages.length === 1 ? t.pageCaptured : t.pagesCaptured}
										</Text>
									</View>
								</View>
							) : null}

							{/* Capture button */}
							<View className="items-center">
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="Capture page"
									className="items-center justify-center rounded-full border-[3px] border-white p-1.5 active:opacity-80"
									disabled={!isCameraReady || isCapturing}
									onPress={handleCapturePage}
								>
									{isCapturing ? (
										<View className="h-18 w-18 items-center justify-center rounded-full bg-white">
											<ActivityIndicator color="#0f172a" />
										</View>
									) : (
										<View className="h-18 w-18 items-center justify-center rounded-full border border-white/70 bg-white shadow-sm">
											<Ionicons color="#0f172a" name="document-text" size={26} />
										</View>
									)}
								</Pressable>
								<Text className="mt-2 text-sm font-bold text-white">
									{isCapturing ? t.loading : t.crop}
								</Text>
								<Text className="mt-0.5 text-[11px] text-white/70">
									Tap to scan page {pages.length + 1}
								</Text>
							</View>

							{/* Review button (when pages exist) */}
							{pages.length > 0 ? (
								<Pressable
									accessibilityRole="button"
									className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-[#006767] py-3.5 active:opacity-90"
									onPress={handleReviewPages}
								>
									<Ionicons color="white" name="eye-outline" size={18} />
									<Text className="text-base font-bold text-white">
										{t.reviewAndSave} ({pages.length} {pages.length === 1 ? t.pageCaptured : t.pagesCaptured})
									</Text>
								</Pressable>
							) : null}
						</View>
					</View>

					{/* Camera loading overlay */}
					{!isCameraReady ? (
						<View className="absolute inset-0 items-center justify-center bg-slate-950/55">
							<View className="items-center rounded-2xl bg-white px-5 py-4 shadow-lg">
								<ActivityIndicator color="#4f46e5" />
								<Text className="mt-2 text-sm font-semibold text-slate-900">Preparing camera</Text>
							</View>
						</View>
					) : null}
				</View>
			</View>
		);
	}

	// ──────────────────────────── Review mode ────────────────────────────
	return (
		<PdfPageReview
			pages={pages}
			currentIndex={currentPageIndex}
			isSaving={isSaving}
			pageRefs={pageRefs}
			onPageChange={setCurrentPageIndex}
			onRemovePage={handleRemovePage}
			onAddMore={handleAddMore}
			onSavePdf={handleSavePdf}
			onBack={handleBackToIdle}
			isCropVisible={isCropVisible}
			setIsCropVisible={setIsCropVisible}
			isCropping={isCropping}
			onApplyCrop={handleApplyCrop}
		/>
	);
}
