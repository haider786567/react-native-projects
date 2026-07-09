import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { LocalGalleryService, LocalGalleryItem } from '../../services/localGallery.service';
import { useTranslation } from '../../store/hooks';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function GalleryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LocalGalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'geo' | 'pdf'>('all');
  
  // Preview Modal States
  const [selectedItem, setSelectedItem] = useState<LocalGalleryItem | null>(null);
  const [fileSize, setFileSize] = useState<string>('');

  const loadGallery = useCallback(async () => {
    try {
      const galleryItems = await LocalGalleryService.getItems();
      setItems(galleryItems);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Load file size when an item is selected for preview
  useEffect(() => {
    if (!selectedItem) {
      setFileSize('');
      return;
    }
    const getDetails = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(selectedItem.uri);
        if (fileInfo.exists) {
          const sizeMb = ((fileInfo.size ?? 0) / (1024 * 1024)).toFixed(2);
          setFileSize(`${sizeMb} MB`);
        }
      } catch {
        setFileSize('Unknown size');
      }
    };
    getDetails();
  }, [selectedItem]);

  const handleShare = async (item: LocalGalleryItem) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(item.uri, {
          mimeType: item.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
          dialogTitle: item.title,
        });
      } else {
        Alert.alert('Sharing Unavailable', 'Cannot open the share menu.');
      }
    } catch {
      // Ignore
    }
  };

  const handleDelete = (item: LocalGalleryItem) => {
    Alert.alert(
      'Delete item?',
      'Are you sure you want to permanently delete this scan from your mobile device? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await LocalGalleryService.deleteItem(item.id);
            setSelectedItem(null);
            loadGallery();
          },
        },
      ]
    );
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white active:bg-slate-50"
          onPress={() => router.back()}
        >
          <Ionicons color="#006767" name="arrow-back" size={20} />
        </Pressable>
        <Text className="text-lg font-bold text-slate-900">Local Gallery</Text>
        <View className="w-10" />
      </View>

      {/* Segment Filter */}
      <View className="flex-row border-b border-slate-200 bg-white p-3 gap-2">
        {(['all', 'geo', 'pdf'] as const).map((type) => {
          const active = filter === type;
          const label = type === 'all' ? 'All' : type === 'geo' ? 'Photos' : 'PDFs';
          return (
            <Pressable
              key={type}
              className={`flex-1 rounded-xl py-2.5 items-center justify-center border ${
                active ? 'bg-[#006767] border-[#006767]' : 'bg-slate-50 border-slate-200 active:bg-slate-100'
              }`}
              onPress={() => setFilter(type)}
            >
              <Text className={`font-bold text-xs ${active ? 'text-white' : 'text-slate-600'}`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Gallery Items Grid */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#006767" />
        </View>
      ) : filteredItems.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
            <Ionicons color="#94a3b8" name="images-outline" size={32} />
          </View>
          <Text className="text-slate-900 font-bold text-base">No items found</Text>
          <Text className="text-slate-400 text-xs text-center mt-1">
            Capture a photo or save a scanned document to see it in your local gallery.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          columnWrapperStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <View
              style={{ width: COLUMN_WIDTH }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Media Preview Thumbnail */}
              <Pressable onPress={() => setSelectedItem(item)}>
                <View className="aspect-[4/3] w-full bg-slate-100 justify-center items-center">
                  {item.type === 'pdf' ? (
                    <View className="items-center justify-center p-4">
                      <Ionicons color="#006767" name="document-text-outline" size={40} />
                      <Text className="text-[10px] font-bold text-slate-400 mt-2 uppercase">PDF Document</Text>
                    </View>
                  ) : (
                    <Image className="h-full w-full" source={{ uri: item.uri }} resizeMode="cover" />
                  )}
                </View>
              </Pressable>

              {/* Card Footer Details */}
              <View className="p-3">
                <Text className="font-bold text-slate-950 text-xs" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-[9px] text-slate-400 font-semibold mt-0.5" numberOfLines={1}>
                  {item.placeName ?? 'Local'}
                </Text>
                <Text className="text-[9px] text-slate-400 mt-0.5">
                  {new Date(item.capturedAt).toLocaleDateString()}
                </Text>
                
                {/* Action buttons (Preview and Delete) */}
                <View className="flex-row items-center justify-between border-t border-slate-100 mt-2.5 pt-2.5">
                  <Pressable
                    className="flex-row items-center gap-1 active:opacity-60"
                    onPress={() => setSelectedItem(item)}
                  >
                    <Ionicons color="#006767" name="eye-outline" size={14} />
                    <Text className="text-[10px] font-bold text-[#006767]">View</Text>
                  </Pressable>
                  <Pressable
                    className="h-6 w-6 items-center justify-center rounded-full bg-rose-50 border border-rose-100 active:bg-rose-100"
                    onPress={() => handleDelete(item)}
                  >
                    <Ionicons color="#ef4444" name="trash-outline" size={12} />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* ── Dynamic Media Previewer Modal ── */}
      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedItem(null)}
      >
        {selectedItem?.type === 'geo' ? (
          /* PHOTO PREVIEWER */
          <View className="flex-1 bg-black justify-between">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                onPress={() => setSelectedItem(null)}
              >
                <Ionicons color="white" name="close" size={24} />
              </Pressable>
              <Text className="text-white font-bold text-base" numberOfLines={1} style={{ maxWidth: '60%' }}>
                {selectedItem.title}
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                  onPress={() => handleShare(selectedItem)}
                >
                  <Ionicons color="white" name="share-outline" size={20} />
                </Pressable>
                <Pressable
                  className="h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 active:bg-rose-500/40"
                  onPress={() => handleDelete(selectedItem)}
                >
                  <Ionicons color="#f87171" name="trash-outline" size={20} />
                </Pressable>
              </View>
            </View>

            {/* Photo Canvas */}
            <View className="flex-1 justify-center items-center">
              <Image
                source={{ uri: selectedItem.uri }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            {/* Details Panel Overlay */}
            <View className="bg-slate-900/90 border-t border-white/5 p-5 pb-10">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons color="#10b981" name="location" size={16} />
                <Text className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest">Geotag Stamp</Text>
              </View>
              <Text className="text-white font-extrabold text-lg leading-6">{selectedItem.placeName ?? 'Saved photo'}</Text>
              
              {selectedItem.coords ? (
                <View className="mt-2.5 gap-1.5 border-t border-white/5 pt-2.5">
                  <Text className="text-xs text-white/70">
                    Latitude: {selectedItem.coords.latitude?.toFixed(6)}
                  </Text>
                  <Text className="text-xs text-white/70">
                    Longitude: {selectedItem.coords.longitude?.toFixed(6)}
                  </Text>
                  <Text className="text-xs text-white/70">
                    Accuracy: ±{selectedItem.coords.accuracy?.toFixed(0)} m
                  </Text>
                </View>
              ) : null}

              <Text className="text-[11px] text-white/40 mt-3">
                Captured: {new Date(selectedItem.capturedAt).toLocaleString()} · Size: {fileSize}
              </Text>
            </View>
          </View>
        ) : selectedItem?.type === 'pdf' ? (
          /* PDF PREVIEWER & INFO CARD */
          <SafeAreaView className="flex-1 bg-slate-50 justify-between" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white active:bg-slate-50"
                onPress={() => setSelectedItem(null)}
              >
                <Ionicons color="#006767" name="close" size={24} />
              </Pressable>
              <Text className="text-slate-900 font-extrabold text-base">Document Info</Text>
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full bg-rose-50 border border-rose-100 active:bg-rose-100"
                onPress={() => handleDelete(selectedItem)}
              >
                <Ionicons color="#ef4444" name="trash-outline" size={20} />
              </Pressable>
            </View>

            {/* Content Details */}
            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
              <View className="h-32 w-32 items-center justify-center rounded-3xl bg-teal-50 shadow-sm border border-teal-100 mb-6">
                <Ionicons color="#006767" name="document-text" size={64} />
              </View>

              <Text className="text-2xl font-black text-slate-900 text-center">{selectedItem.title}</Text>
              <Text className="text-xs text-slate-400 mt-1 font-semibold">Local PDF File</Text>

              {/* Stats Grid */}
              <View className="flex-row gap-3 mt-6 w-full">
                <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Text className="text-lg font-bold text-slate-900">{fileSize || '—'}</Text>
                  <Text className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">File Size</Text>
                </View>
                <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Text className="text-lg font-bold text-slate-900">PDF</Text>
                  <Text className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Format</Text>
                </View>
              </View>

              {/* Watermark GPS info */}
              <View className="w-full rounded-2xl border border-slate-200 bg-white p-5 mt-6 shadow-sm">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons color="#006767" name="location-outline" size={18} />
                  <Text className="font-bold text-slate-900 text-sm">Geotag Metadata</Text>
                </View>
                
                <View className="gap-2">
                  <View className="flex-row justify-between border-b border-slate-100 pb-2">
                    <Text className="text-xs text-slate-400">Captured Location</Text>
                    <Text className="text-xs font-bold text-slate-800" style={{ maxWidth: '60%' }} numberOfLines={1}>
                      {selectedItem.placeName ?? 'Local scan'}
                    </Text>
                  </View>
                  
                  {selectedItem.coords ? (
                    <>
                      <View className="flex-row justify-between border-b border-slate-100 pb-2">
                        <Text className="text-xs text-slate-400">Latitude</Text>
                        <Text className="text-xs font-bold text-slate-800">{selectedItem.coords.latitude?.toFixed(6)}</Text>
                      </View>
                      <View className="flex-row justify-between border-b border-slate-100 pb-2">
                        <Text className="text-xs text-slate-400">Longitude</Text>
                        <Text className="text-xs font-bold text-slate-800">{selectedItem.coords.longitude?.toFixed(6)}</Text>
                      </View>
                    </>
                  ) : null}

                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-400">Created Time</Text>
                    <Text className="text-xs font-bold text-slate-800">
                      {new Date(selectedItem.capturedAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Local File Path Description */}
              <View className="w-full rounded-2xl bg-slate-100 p-4 mt-6">
                <Text className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Device Path</Text>
                <Text className="text-[10px] text-slate-500 font-semibold mt-1" numberOfLines={2}>
                  {selectedItem.uri}
                </Text>
              </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View className="border-t border-slate-200 bg-white p-5 gap-3">
              <Pressable
                className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-[#006767] active:opacity-90 shadow-sm"
                onPress={() => handleShare(selectedItem)}
              >
                <Ionicons color="white" name="open-outline" size={20} />
                <Text className="text-base font-bold text-white">Open & View PDF</Text>
              </Pressable>
              
              <Pressable
                className="h-14 flex-row items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 active:bg-slate-100"
                onPress={() => setSelectedItem(null)}
              >
                <Text className="text-base font-bold text-slate-700">Close</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        ) : null}
      </Modal>
    </SafeAreaView>
  );
}
