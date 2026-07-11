import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Image,
	Pressable,
	Text,
	View,
} from 'react-native';

import type { ScannedPage } from '../types/pdf.type';
import { PdfWatermark } from './PdfWatermark';
import { useTranslation } from '../../../store/hooks';
import { useTheme } from '../../../constants/theme';
import { CropOverlay } from '../../geo_camera/components/CropOverlay';

type PdfPageReviewProps = {
	pages: ScannedPage[];
	currentIndex: number;
	isSaving: boolean;
	pageRefs: React.RefObject<(View | null)[]>;
	onPageChange: (index: number) => void;
	onRemovePage: (index: number) => void;
	onAddMore: () => void;
	onSavePdf: () => void;
	onBack: () => void;
	isCropVisible: boolean;
	setIsCropVisible: (visible: boolean) => void;
	isCropping: boolean;
	onApplyCrop: (index: number, region: any) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function PdfPageReview({
	pages,
	currentIndex,
	isSaving,
	pageRefs,
	onPageChange,
	onRemovePage,
	onAddMore,
	onSavePdf,
	onBack,
	isCropVisible,
	setIsCropVisible,
	isCropping,
	onApplyCrop,
}: PdfPageReviewProps) {
	const flatListRef = useRef<FlatList>(null);
	const { t } = useTranslation();
	const { isDark, colors: c } = useTheme();

	return (
		<View style={{ flex: 1, backgroundColor: c.bg }}>
			
			{/* Header */}
			<View style={{ backgroundColor: c.headerBg, borderBottomColor: c.divider }} className="flex-row items-center justify-between border-b px-4 pb-4 pt-14">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Go back"
					style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
					className="h-10 w-10 items-center justify-center rounded-full border active:bg-slate-50"
					onPress={onBack}
				>
					<Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="arrow-back" size={20} />
				</Pressable>
				<View className="items-center">
					<Text style={{ color: c.tealText }} className="text-[10px] font-bold uppercase tracking-widest">{t.reviewPages}</Text>
					<Text style={{ color: c.text }} className="mt-0.5 text-base font-extrabold">
						{currentIndex + 1} of {pages.length} {pages.length === 1 ? t.pageCaptured : t.pagesCaptured}
					</Text>
				</View>
				
				{/* Top Right Action Group */}
				<View className="flex-row items-center gap-2">
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Crop current page"
						style={{ backgroundColor: isDark ? 'rgba(45, 212, 191, 0.08)' : '#f0fdfa', borderColor: isDark ? 'rgba(45, 212, 191, 0.15)' : '#ccfbf1' }}
						className="h-10 w-10 items-center justify-center rounded-full border active:opacity-80"
						onPress={() => setIsCropVisible(true)}
					>
						<Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="crop" size={18} />
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Remove current page"
						style={{ backgroundColor: '#fef2f2', borderColor: '#fee2e2' }}
						className="h-10 w-10 items-center justify-center rounded-full border active:opacity-80"
						disabled={pages.length <= 1}
						onPress={() => onRemovePage(currentIndex)}
					>
						<Ionicons color="#ef4444" name="trash-outline" size={18} />
					</Pressable>
				</View>
			</View>

			{/* Page carousel */}
			<View className="flex-1 justify-center py-6">
				<FlatList
					ref={flatListRef}
					data={pages}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					keyExtractor={(_, index) => `page-${index}`}
					onMomentumScrollEnd={(event) => {
						const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
						onPageChange(index);
					}}
					renderItem={({ item, index }) => (
						<View style={{ width: SCREEN_WIDTH }} className="px-5 justify-center">
							<View
								ref={(el) => {
									if (pageRefs.current) {
										pageRefs.current[index] = el;
									}
								}}
								collapsable={false}
								style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
								className="aspect-[3/4] overflow-hidden rounded-2xl border shadow-sm"
							>
								<Image
									className="h-full w-full"
									resizeMode="cover"
									source={{ uri: item.uri }}
								/>
								<PdfWatermark
									coords={item.coords}
									placeName={item.placeName}
									accuracy={item.accuracy}
									capturedAt={item.capturedAt}
								/>
							</View>
						</View>
					)}
				/>
			</View>

			{/* Thumbnail strip */}
			{pages.length > 1 ? (
				<View className="px-5 py-3">
					<FlatList
						data={pages}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ gap: 8 }}
						keyExtractor={(_, index) => `thumb-${index}`}
						renderItem={({ item, index }) => (
							<Pressable
								onPress={() => {
									onPageChange(index);
									flatListRef.current?.scrollToIndex({ index, animated: true });
								}}
								style={{
									borderColor: index === currentIndex ? (isDark ? '#2dd4bf' : '#006767') : c.cardBorder,
								}}
								className="h-16 w-12 overflow-hidden rounded-lg border-2"
							>
								<Image className="h-full w-full" resizeMode="cover" source={{ uri: item.uri }} />
								<View className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5">
									<Text className="text-center text-[9px] font-bold text-white">{index + 1}</Text>
								</View>
							</Pressable>
						)}
					/>
				</View>
			) : null}

			{/* Action buttons */}
			<View style={{ backgroundColor: c.headerBg, borderTopColor: c.divider }} className="flex-row items-center gap-3 border-t px-5 pb-8 pt-4">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Add more pages"
					style={{ backgroundColor: c.btnSec, borderColor: c.cardBorder }}
					className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border active:opacity-90"
					onPress={onAddMore}
				>
					<Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="add-outline" size={20} />
					<Text style={{ color: c.btnSecText }} className="text-base font-bold">{t.addPage}</Text>
				</Pressable>
				
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Save as PDF"
					className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#006767] active:opacity-90"
					disabled={isSaving}
					onPress={onSavePdf}
				>
					{isSaving ? (
						<ActivityIndicator color="white" />
					) : (
						<>
							<Ionicons color="white" name="download-outline" size={20} />
							<Text className="text-base font-bold text-white">{t.savePdf}</Text>
						</>
					)}
				</Pressable>
			</View>

			{/* Crop Overlay */}
			{isCropVisible && (
				<CropOverlay
					uri={pages[currentIndex].uri}
					isCropping={isCropping}
					onApply={(region) => onApplyCrop(currentIndex, region)}
					onCancel={() => setIsCropVisible(false)}
				/>
			)}
		</View>
	);
}
