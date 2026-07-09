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
}: PdfPageReviewProps) {
	const flatListRef = useRef<FlatList>(null);
	const { t } = useTranslation();

	return (
		<View className="absolute inset-0 bg-slate-50">
			{/* Header */}
			<View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 pb-4 pt-14">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Go back"
					className="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white active:bg-slate-50"
					onPress={onBack}
				>
					<Ionicons color="#006767" name="arrow-back" size={20} />
				</Pressable>
				<View className="items-center">
					<Text className="text-[10px] font-bold uppercase tracking-widest text-[#006767]">{t.reviewPages}</Text>
					<Text className="mt-0.5 text-base font-extrabold text-slate-800">
						{currentIndex + 1} of {pages.length} {pages.length === 1 ? t.pageCaptured : t.pagesCaptured}
					</Text>
				</View>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Remove current page"
					className="h-10 w-10 items-center justify-center rounded-full bg-rose-50 border border-rose-100 active:bg-rose-100"
					disabled={pages.length <= 1}
					onPress={() => onRemovePage(currentIndex)}
				>
					<Ionicons color="#ef4444" name="trash-outline" size={18} />
				</Pressable>
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
								className="aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
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
								className={`h-16 w-12 overflow-hidden rounded-lg border-2 ${
									index === currentIndex ? 'border-[#006767]' : 'border-slate-200'
								}`}
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
			<View className="flex-row items-center gap-3 border-t border-slate-200 bg-white px-5 pb-8 pt-4">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Add more pages"
					className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 active:bg-slate-100"
					onPress={onAddMore}
				>
					<Ionicons color="#006767" name="add-outline" size={20} />
					<Text className="text-base font-bold text-slate-700">{t.addPage}</Text>
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
		</View>
	);
}
