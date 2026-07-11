import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../features/auth/hooks/auth.hooks';
import { useTranslation } from '../../../store/hooks';
import { useTheme } from '../../../constants/theme';
import { LANGUAGES } from '../../../utils/localization';
import { LocalGalleryService, GalleryStats } from '../../../services/localGallery.service';
import { Haptics } from '../../../utils/haptics';

// Subcomponents
import AvatarRenderer from '../../../features/profile/components/AvatarRenderer';
import EditProfileModal from '../../../features/profile/components/EditProfileModal';
import PrivacyModal from '../../../features/profile/components/PrivacyModal';
import SupportModal from '../../../features/profile/components/SupportModal';
import AppearanceModal from '../../../features/profile/components/AppearanceModal';

export default function ProfileScreen() {
  const { user, handleLogout, isLoading } = useAuth();
  const { t, language, setLanguage } = useTranslation();
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

  const [activeModal, setActiveModal] = useState<'edit_profile' | 'privacy' | 'support' | 'appearance' | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadStats = async () => {
        try {
          const fetchedStats = await LocalGalleryService.getStats();
          if (active) {
            setStats(fetchedStats);
          }
        } catch {
          // Fallback
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

  const signOut = async () => {
    Haptics.notificationAsync();
    await handleLogout();
    router.replace('/login');
  };

  const handleOpenModal = (modal: typeof activeModal) => {
    Haptics.impactAsync();
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    Haptics.impactAsync();
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        
        {/* ── Header ── */}
        <View className="px-5 pb-6 pt-4">
          <Text style={{ color: c.tealText }} className="text-xs font-bold uppercase tracking-widest">{t.settings}</Text>
          <Text style={{ color: c.text }} className="mt-1 text-3xl font-extrabold tracking-tight">{t.profile}</Text>
        </View>

        {/* ── User Card ── */}
        <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="mx-5 mb-6 overflow-hidden rounded-3xl border p-6">
          <View className="items-center">
            <View style={{ borderColor: isDark ? 'rgba(45, 212, 191, 0.2)' : 'rgba(0, 103, 103, 0.1)' }} className="h-24 w-24 items-center justify-center rounded-full border-4 bg-teal-50/10">
              <AvatarRenderer avatarValue={user?.avatar || 'avatar_boy'} />
            </View>
            <Text style={{ color: c.text }} className="mt-4 text-2xl font-bold">{user?.name}</Text>
            <Text style={{ color: c.textMuted }} className="mt-1 text-sm">{user?.email}</Text>
            
            <Pressable
              style={{ borderColor: isDark ? 'rgba(45, 212, 191, 0.3)' : '#cbd5e1', backgroundColor: isDark ? 'rgba(45, 212, 191, 0.08)' : '#f0fdfa' }}
              className="mt-5 rounded-xl border px-6 py-2.5 active:opacity-80"
              onPress={() => handleOpenModal('edit_profile')}
            >
              <Text style={{ color: c.tealText }} className="font-bold text-xs">{t.editProfile}</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View className="flex-row gap-3 px-5 mb-6">
          <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="flex-1 items-center rounded-2xl border p-4">
            <Text style={{ color: c.text }} className="text-xl font-bold">
              {loading ? '—' : stats.pdfCount}
            </Text>
            <Text className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.documents}</Text>
          </View>
          <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="flex-1 items-center rounded-2xl border p-4">
            <Text style={{ color: c.text }} className="text-xl font-bold">
              {loading ? '—' : stats.geoCount}
            </Text>
            <Text className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.locations}</Text>
          </View>
          <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="flex-1 items-center rounded-2xl border p-4">
            <Text style={{ color: c.tealText }} className="text-xl font-bold">
              {loading ? '—' : stats.storageSize}
            </Text>
            <Text className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.storage}</Text>
          </View>
        </View>

        {/* ── Language Selector Section ── */}
        <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="mx-5 mb-6 overflow-hidden rounded-2xl border p-5">
          <View className="flex-row items-center mb-3">
            <Ionicons color={c.tealText} name="globe-outline" size={18} />
            <Text style={{ color: c.text }} className="ml-2 font-bold text-sm uppercase tracking-wider">{t.changeLanguage}</Text>
          </View>
          <View className="flex-row gap-2">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={{
                    backgroundColor: isActive ? '#006767' : 'transparent',
                    borderColor: isActive ? '#006767' : c.cardBorder,
                  }}
                  className="flex-1 rounded-xl py-2.5 items-center justify-center border active:opacity-90"
                  onPress={() => {
                    Haptics.impactAsync();
                    setLanguage(lang.code);
                  }}
                >
                  <Text className={`font-bold text-xs ${isActive ? 'text-white' : ''}`} style={{ color: isActive ? '#ffffff' : c.text }}>
                    {lang.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Settings List ── */}
        <View style={{ backgroundColor: c.card, borderColor: c.cardBorder }} className="mx-5 overflow-hidden rounded-2xl border px-4">
          
          <Pressable
            className="flex-row items-center py-4 active:opacity-60"
            onPress={() => handleOpenModal('appearance')}
          >
            <View style={{ backgroundColor: c.iconBg }} className="h-9 w-9 items-center justify-center rounded-lg">
              <Ionicons color={c.tealText} name="color-palette-outline" size={18} />
            </View>
            <Text style={{ color: c.text }} className="ml-3 flex-1 font-semibold">{t.appearance}</Text>
            <Text className="mr-2 text-sm text-slate-400">{isDark ? 'Dark' : 'Light'}</Text>
            <Ionicons color="#94a3b8" name="chevron-forward" size={16} />
          </Pressable>

          <Pressable
            style={{ borderTopColor: c.divider }}
            className="flex-row items-center py-4 active:opacity-60 border-t"
            onPress={() => handleOpenModal('privacy')}
          >
            <View style={{ backgroundColor: c.iconBg }} className="h-9 w-9 items-center justify-center rounded-lg">
              <Ionicons color={c.tealText} name="shield-checkmark-outline" size={18} />
            </View>
            <Text style={{ color: c.text }} className="ml-3 flex-1 font-semibold">{t.privacySecurity}</Text>
            <Ionicons color="#94a3b8" name="chevron-forward" size={16} />
          </Pressable>

          <Pressable
            style={{ borderTopColor: c.divider }}
            className="flex-row items-center py-4 active:opacity-60 border-t"
            onPress={() => handleOpenModal('support')}
          >
            <View style={{ backgroundColor: c.iconBg }} className="h-9 w-9 items-center justify-center rounded-lg">
              <Ionicons color={c.tealText} name="help-circle-outline" size={18} />
            </View>
            <Text style={{ color: c.text }} className="ml-3 flex-1 font-semibold">{t.helpSupport}</Text>
            <Ionicons color="#94a3b8" name="chevron-forward" size={16} />
          </Pressable>
        </View>

        {/* ── Log Out Button ── */}
        <View className="px-5 mt-6">
          <Pressable
            className="items-center justify-center rounded-2xl bg-rose-600 py-4 active:opacity-85"
            disabled={isLoading}
            onPress={() => void signOut()}
          >
            <Text className="font-bold text-white text-base">
              {isLoading ? t.signingOut : t.signOut}
            </Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Modals Composition */}
      <EditProfileModal visible={activeModal === 'edit_profile'} onClose={handleCloseModal} />
      <PrivacyModal visible={activeModal === 'privacy'} onClose={handleCloseModal} />
      <SupportModal visible={activeModal === 'support'} onClose={handleCloseModal} />
      <AppearanceModal visible={activeModal === 'appearance'} onClose={handleCloseModal} />

    </SafeAreaView>
  );
}
