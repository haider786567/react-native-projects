import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { useTranslation } from '../../../store/hooks';
import { LocalGalleryService, LocalGalleryItem, GalleryStats } from '../../../services/localGallery.service';

function getGreetingKey(h: number) {
  if (h < 12) return 'goodMorning';
  if (h < 17) return 'goodAfternoon';
  return 'goodEvening';
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GalleryStats>({
    totalScans: 0,
    pdfCount: 0,
    geoCount: 0,
    thisWeekCount: 0,
    storageSize: '0.0 MB',
    syncedCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<LocalGalleryItem[]>([]);

  // Fetch stats and scans whenever the home screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadData = async () => {
        try {
          const [fetchedStats, fetchedScans] = await Promise.all([
            LocalGalleryService.getStats(),
            LocalGalleryService.getItems(),
          ]);
          if (active) {
            setStats(fetchedStats);
            // Show only the 3 most recent scans on dashboard
            setRecentActivity(fetchedScans.slice(0, 3));
          }
        } catch (error) {
          // Fallback gracefully on local read error
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadData();
      return () => {
        active = false;
      };
    }, [])
  );

  const greetingKey = getGreetingKey(new Date().getHours());
  const greetingText = t[greetingKey as 'goodMorning' | 'goodAfternoon' | 'goodEvening'] || t.goodMorning;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ── Header ── */}
        <View className="px-5 pb-6 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-widest text-[#006767]">Buildrigs</Text>
              <Text className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                {greetingText} 👋
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                {t.whatToCapture}
              </Text>
            </View>
            <Pressable
              className="h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white active:bg-slate-100"
              onPress={() => Alert.alert('Notifications', 'You are all caught up.')}
            >
              <Ionicons color="#006767" name="notifications-outline" size={22} />
              <View className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-red-500" />
            </Pressable>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View className="flex-row gap-3 px-5">
          <Pressable
            className="flex-1 overflow-hidden rounded-2xl bg-[#006767] active:opacity-95"
            onPress={() => router.push('/pdfScanner')}
          >
            <View className="h-40 justify-between p-5">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <Ionicons color="white" name="document-text-outline" size={22} />
              </View>
              <View>
                <Text className="text-lg font-bold text-white">{t.scanPdf}</Text>
                <Text className="mt-0.5 text-xs text-white/80">
                  {t.scanPdfDesc}
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white active:bg-slate-50"
            onPress={() => router.push('/GeoScanner')}
          >
            <View className="h-40 justify-between p-5">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Ionicons color="#006767" name="location-outline" size={22} />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900">{t.geoScan}</Text>
                <Text className="mt-0.5 text-xs text-slate-500">
                  {t.geoScanDesc}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* ── Stats Strip (Quiet Authority card style) ── */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white p-4 justify-around">
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-slate-900">
                {loading ? '—' : stats.totalScans}
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.totalScans}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-[#006767]">
                {loading ? '—' : stats.syncedCount}
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.cloudSynced}</Text>
            </View>
            <View className="h-8 w-px bg-slate-200" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-slate-900">
                {loading ? '—' : stats.thisWeekCount}
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.thisWeek}</Text>
            </View>
          </View>
        </View>

        {/* ── Feature Highlight Card ── */}
        <View className="mt-6 px-5">
          <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                <Ionicons color="#006767" name="sparkles-outline" size={24} />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-base font-bold text-slate-900">{t.smartCrop}</Text>
                <Text className="mt-0.5 text-xs text-slate-500 leading-4">
                  {t.smartCropDesc}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Recent Activity ── */}
        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">{t.recentActivity}</Text>
            <Pressable onPress={() => router.push('/gallery')}>
              <Text className="text-sm font-semibold text-[#006767]">{t.viewAll}</Text>
            </Pressable>
          </View>

          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color="#006767" />
            </View>
          ) : recentActivity.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-8 items-center justify-center">
              <Text className="text-sm text-slate-400 font-semibold text-center">No scans recorded yet.</Text>
            </View>
          ) : (
            recentActivity.map((item) => (
              <Pressable
                key={item.id}
                className="mb-2.5 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-50"
                onPress={async () => {
                  try {
                    await Sharing.shareAsync(item.uri, {
                      mimeType: item.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
                      dialogTitle: item.title,
                    });
                  } catch {
                    // Cancelled
                  }
                }}
              >
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Ionicons
                    color="#006767"
                    name={item.type === 'pdf' ? 'document-text-outline' : 'location-outline'}
                    size={20}
                  />
                </View>
                <View className="mx-3 flex-1">
                  <Text className="font-semibold text-slate-900" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-400">
                    {item.placeName ?? 'Local'} · {new Date(item.capturedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View className="rounded-full bg-teal-50 px-2.5 py-1">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-[#006767]">
                    {t.synced}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
