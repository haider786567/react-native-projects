import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../features/auth/hooks/auth.hooks';
import { useTranslation } from '../../../store/hooks';
import { LANGUAGES } from '../../../utils/localization';
import { LocalGalleryService, GalleryStats } from '../../../services/localGallery.service';

export default function ProfileScreen() {
  const { user, handleLogout, isLoading } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GalleryStats>({
    totalScans: 0,
    pdfCount: 0,
    geoCount: 0,
    thisWeekCount: 0,
    storageSize: '0.0 MB',
    syncedCount: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadStats = async () => {
        try {
          const fetchedStats = await LocalGalleryService.getStats();
          if (active) {
            setStats(fetchedStats);
          }
        } catch (error) {
          // Fallback gracefully
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadStats();
      return () => {
        active = false;
      };
    }, [])
  );
  
  const initials = user?.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const signOut = async () => {
    await handleLogout();
    router.replace('/login');
  };

  const settings = [
    { icon: 'cloud-outline' as const, label: t.cloudSync, value: t.ready, color: '#10b981' },
    { icon: 'shield-checkmark-outline' as const, label: t.privacySecurity, value: '', color: '#3b82f6' },
    { icon: 'color-palette-outline' as const, label: t.appearance, value: 'Light', color: '#818cf8' },
    { icon: 'help-circle-outline' as const, label: t.helpSupport, value: '', color: '#f59e0b' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        
        {/* ── Header ── */}
        <View className="px-5 pb-6 pt-4">
          <Text className="text-xs font-bold uppercase tracking-widest text-[#006767]">{t.settings}</Text>
          <Text className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{t.profile}</Text>
        </View>

        {/* ── User Card ── */}
        <View className="mx-5 mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
          <View className="items-center">
            <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-teal-500/20 bg-teal-50">
              <Text className="text-3xl font-black text-[#006767]">{initials}</Text>
            </View>
            <Text className="mt-4 text-2xl font-bold text-slate-900">{user?.name}</Text>
            <Text className="mt-1 text-sm text-slate-500">{user?.email}</Text>
            
            <Pressable
              className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 active:bg-slate-100"
              onPress={() => Alert.alert(t.editProfile, 'Connect your profile editor here.')}
            >
              <Text className="font-bold text-slate-700 text-xs">{t.editProfile}</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View className="flex-row gap-3 px-5 mb-6">
          <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-xl font-bold text-slate-900">
              {loading ? '—' : stats.pdfCount}
            </Text>
            <Text className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.documents}</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-xl font-bold text-slate-900">
              {loading ? '—' : stats.geoCount}
            </Text>
            <Text className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.locations}</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-xl font-bold text-[#006767]">
              {loading ? '—' : stats.storageSize}
            </Text>
            <Text className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.storage}</Text>
          </View>
        </View>

        {/* ── Language Selector Section ── */}
        <View className="mx-5 mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
          <View className="flex-row items-center mb-3">
            <Ionicons color="#006767" name="globe-outline" size={18} />
            <Text className="ml-2 font-bold text-slate-900 text-sm uppercase tracking-wider">{t.changeLanguage}</Text>
          </View>
          <View className="flex-row gap-2">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  className={`flex-1 rounded-xl py-2.5 items-center justify-center border ${
                    isActive ? 'bg-[#006767] border-[#006767]' : 'bg-slate-50 border-slate-200 active:bg-slate-100'
                  }`}
                  onPress={() => setLanguage(lang.code)}
                >
                  <Text className={`font-bold text-xs ${isActive ? 'text-white' : 'text-slate-600'}`}>
                    {lang.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Settings List ── */}
        <View className="mx-5 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4">
          {settings.map((item, index) => (
            <Pressable
              className={`flex-row items-center py-4 active:opacity-60 ${index ? 'border-t border-slate-100' : ''}`}
              key={item.label}
              onPress={() => Alert.alert(item.label, `Configure ${item.label} setting.`)}
            >
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                <Ionicons color="#006767" name={item.icon} size={18} />
              </View>
              <Text className="ml-3 flex-1 font-semibold text-slate-900">{item.label}</Text>
              {item.value ? <Text className="mr-2 text-sm text-slate-400">{item.value}</Text> : null}
              <Ionicons color="#94a3b8" name="chevron-forward" size={16} />
            </Pressable>
          ))}
        </View>

        {/* ── Log Out Button ── */}
        <View className="px-5 mt-6">
          <Pressable
            className="items-center justify-center rounded-2xl bg-rose-600/90 py-4 active:opacity-80"
            disabled={isLoading}
            onPress={() => void signOut()}
          >
            <Text className="font-bold text-white text-base">
              {isLoading ? t.signingOut : t.signOut}
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
