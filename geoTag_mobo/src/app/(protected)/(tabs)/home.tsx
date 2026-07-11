import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { useTranslation } from '../../../store/hooks';
import { useTheme } from '../../../constants/theme';
import { LocalGalleryService, LocalGalleryItem, GalleryStats } from '../../../services/localGallery.service';

function getGreetingKey(h: number) {
  if (h < 12) return 'goodMorning';
  if (h < 17) return 'goodAfternoon';
  return 'goodEvening';
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDark, colors: c } = useTheme();
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
            setRecentActivity(fetchedScans.slice(0, 3));
          }
        } catch {
          // Fallback
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
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        
        {/* ── Header ── */}
        <View className="px-5 pb-6 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text style={{ color: c.tealText }} className="text-xs font-bold uppercase tracking-widest">Buildrigs</Text>
              <Text style={{ color: c.text }} className="mt-1 text-3xl font-extrabold tracking-tight">
                {greetingText} 👋
              </Text>
              <Text style={{ color: c.textMuted }} className="mt-1 text-sm">
                {t.whatToCapture}
              </Text>
            </View>
            <Pressable
              style={{ backgroundColor: c.notifBtnBg, borderColor: c.cardBorder }}
              className="h-12 w-12 items-center justify-center rounded-full border active:opacity-85"
              onPress={() => Alert.alert('Notifications', 'You are all caught up.')}
            >
              <Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="notifications-outline" size={22} />
              <View className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-red-500" />
            </Pressable>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View className="flex-row gap-3 px-5">
          <Pressable
            className="flex-1 overflow-hidden rounded-3xl bg-[#006767] active:opacity-95"
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
            style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
            className="flex-1 overflow-hidden rounded-3xl border active:opacity-90"
            onPress={() => router.push('/GeoScanner')}
          >
            <View className="h-40 justify-between p-5">
              <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }} className="h-11 w-11 items-center justify-center rounded-xl">
                <Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="location-outline" size={22} />
              </View>
              <View>
                <Text style={{ color: c.text }} className="text-lg font-bold">{t.geoScan}</Text>
                <Text style={{ color: c.textMuted }} className="mt-0.5 text-xs">
                  {t.geoScanDesc}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* ── Stats Strip ── */}
        <View className="mt-6 px-5">
          <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="flex-row items-center rounded-2xl border p-4 justify-around">
            <View className="items-center flex-1">
              <Text style={{ color: c.text }} className="text-2xl font-black">
                {loading ? '—' : stats.totalScans}
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.totalScans}</Text>
            </View>
            <View style={{ backgroundColor: c.divider }} className="h-8 w-px" />
            <View className="items-center flex-1">
              <Text style={{ color: c.tealText }} className="text-2xl font-black">
                {loading ? '—' : stats.syncedCount}
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.cloudSynced}</Text>
            </View>
            <View style={{ backgroundColor: c.divider }} className="h-8 w-px" />
            <View className="items-center flex-1">
              <Text style={{ color: c.text }} className="text-2xl font-black">
                {loading ? '—' : stats.thisWeekCount}
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.thisWeek}</Text>
            </View>
          </View>
        </View>

        {/* ── Feature Highlight Card ── */}
        <View className="mt-6 px-5">
          <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="overflow-hidden rounded-2xl border p-5">
            <View className="flex-row items-center">
              <View style={{ backgroundColor: c.iconBg }} className="h-12 w-12 items-center justify-center rounded-xl">
                <Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="sparkles-outline" size={24} />
              </View>
              <View className="ml-4 flex-1">
                <Text style={{ color: c.text }} className="text-base font-bold">{t.smartCrop}</Text>
                <Text style={{ color: c.textMuted }} className="mt-0.5 text-xs leading-4">
                  {t.smartCropDesc}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Recent Activity ── */}
        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text style={{ color: c.text }} className="text-lg font-bold">{t.recentActivity}</Text>
            <Pressable onPress={() => router.push('/gallery')}>
              <Text style={{ color: c.tealText }} className="text-sm font-bold">{t.viewAll}</Text>
            </Pressable>
          </View>

          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color={isDark ? '#2dd4bf' : '#006767'} />
            </View>
          ) : recentActivity.length === 0 ? (
            <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: c.cardBorder }} className="rounded-2xl border border-dashed p-8 items-center justify-center">
              <Text className="text-sm text-slate-400 font-semibold text-center">No scans recorded yet.</Text>
            </View>
          ) : (
            recentActivity.map((item) => (
              <Pressable
                key={item.id}
                style={{ backgroundColor: c.card, borderColor: c.cardBorder }}
                className="mb-2.5 flex-row items-center rounded-2xl border p-4 active:opacity-90"
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
                <View style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9' }} className="h-11 w-11 items-center justify-center rounded-xl">
                  <Ionicons
                    color={isDark ? '#2dd4bf' : '#006767'}
                    name={item.type === 'pdf' ? 'document-text-outline' : 'location-outline'}
                    size={20}
                  />
                </View>
                <View className="mx-3 flex-1">
                  <Text style={{ color: c.text }} className="font-semibold text-xs" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="mt-0.5 text-[10px] text-slate-400 font-medium">
                    {item.placeName ?? 'Local'} · {new Date(item.capturedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ backgroundColor: c.pillBg }} className="rounded-full px-2.5 py-1">
                  <Text style={{ color: c.tealText }} className="text-[10px] font-extrabold uppercase tracking-wider">
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
