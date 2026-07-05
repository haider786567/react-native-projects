import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen } from '../../../components/ui/AppScreen';
import { InfoCard, SectionHeader } from '../../../components/ui/Dashboard';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';
import { router } from 'expo-router';
import { useAuth } from '../../../features/auth/hooks/auth.hooks';

const settings = [
  { icon: 'cloud-outline' as const, label: 'Cloud sync', value: 'On' },
  { icon: 'shield-checkmark-outline' as const, label: 'Privacy & security', value: '' },
  { icon: 'color-palette-outline' as const, label: 'Appearance', value: 'System' },
  { icon: 'help-circle-outline' as const, label: 'Help & support', value: '' },
];

export default function ProfileScreen() {
  const { user, handleLogout, isLoading } = useAuth();
  const initials = user?.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const signOut = async () => {
    await handleLogout();
    router.replace('/login');
  };

  return (
    <AppScreen>
      <ScreenHeader title="Profile" subtitle="Manage your account and preferences." />
      <InfoCard>
        <View className="items-center py-2">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
            <Text className="text-3xl font-extrabold text-indigo-700">{initials}</Text>
          </View>
          <Text className="mt-4 text-xl font-extrabold text-slate-950">{user?.name}</Text>
          <Text className="mt-1 text-sm text-slate-500">{user?.email}</Text>
          <Pressable
            className="mt-5 rounded-xl border border-slate-200 px-5 py-2.5 active:bg-slate-100"
            onPress={() => Alert.alert('Edit profile', 'Connect your profile editor here.')}
          >
            <Text className="font-semibold text-slate-900">Edit profile</Text>
          </Pressable>
        </View>
      </InfoCard>

      <SectionHeader title="Your activity" />
      <View className="flex-row gap-3">
        <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-2xl font-extrabold text-slate-950">48</Text>
          <Text className="mt-1 text-xs text-slate-500">Documents</Text>
        </View>
        <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-2xl font-extrabold text-slate-950">20</Text>
          <Text className="mt-1 text-xs text-slate-500">Locations</Text>
        </View>
        <View className="flex-1 items-center rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-2xl font-extrabold text-slate-950">1.2 GB</Text>
          <Text className="mt-1 text-xs text-slate-500">Storage</Text>
        </View>
      </View>

      <SectionHeader title="Settings" />
      <View className="overflow-hidden rounded-3xl border border-slate-200 bg-white px-4">
        {settings.map((item, index) => (
          <Pressable
            className={`flex-row items-center py-4 active:opacity-60 ${index ? 'border-t border-slate-100' : ''}`}
            key={item.label}
          >
            <Ionicons color="#4f46e5" name={item.icon} size={21} />
            <Text className="ml-3 flex-1 font-medium text-slate-900">{item.label}</Text>
            {item.value ? <Text className="mr-2 text-sm text-slate-500">{item.value}</Text> : null}
            <Ionicons color="#94a3b8" name="chevron-forward" size={18} />
          </Pressable>
        ))}
      </View>

      <Pressable
        className="mt-5 items-center rounded-xl bg-rose-600 py-3.5 active:opacity-80"
        disabled={isLoading}
        onPress={() => void signOut()}
      >
        <Text className="font-semibold text-white">{isLoading ? 'Signing out…' : 'Sign out'}</Text>
      </Pressable>
    </AppScreen>
  );
}
