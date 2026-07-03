import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View className="mb-3 mt-7 flex-row items-center justify-between">
      <Text className="text-lg font-bold text-slate-950">{title}</Text>
      {action ? <Text className="text-sm font-semibold text-indigo-600">{action}</Text> : null}
    </View>
  );
}

type ActionCardProps = {
  icon: IconName;
  title: string;
  description: string;
  onPress?: () => void;
  tone?: 'indigo' | 'emerald';
};

export function ActionCard({ icon, title, description, onPress, tone = 'indigo' }: ActionCardProps) {
  const isEmerald = tone === 'emerald';

  return (
    <Pressable
      className={`min-h-44 flex-1 justify-between rounded-3xl p-5 active:opacity-90 ${
        isEmerald ? 'bg-emerald-500' : 'bg-indigo-600'
      }`}
      onPress={onPress}
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
        <Ionicons color="white" name={icon} size={25} />
      </View>
      <View className="mt-5">
        <Text className="text-xl font-bold text-white">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-white/80">{description}</Text>
      </View>
    </Pressable>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <View className="min-w-36 flex-1 rounded-2xl border border-slate-200 bg-white p-4">
      <Ionicons color="#4f46e5" name={icon} size={20} />
      <Text className="mt-4 text-2xl font-extrabold text-slate-950">{value}</Text>
      <Text className="mt-1 text-xs font-medium text-slate-500">{label}</Text>
    </View>
  );
}

type ActivityRowProps = {
  icon: IconName;
  title: string;
  meta: string;
  badge?: string;
  onPress?: () => void;
};

export function ActivityRow({ icon, title, meta, badge, onPress }: ActivityRowProps) {
  return (
    <Pressable
      className="mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-100"
      onPress={onPress}
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
        <Ionicons color="#4f46e5" name={icon} size={22} />
      </View>
      <View className="mx-3 flex-1">
        <Text className="font-semibold text-slate-900" numberOfLines={1}>{title}</Text>
        <Text className="mt-1 text-xs text-slate-500">{meta}</Text>
      </View>
      {badge ? (
        <Text className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {badge}
        </Text>
      ) : (
        <Ionicons color="#94a3b8" name="chevron-forward" size={18} />
      )}
    </Pressable>
  );
}

export function InfoCard({ children }: { children: ReactNode }) {
  return <View className="rounded-3xl border border-slate-200 bg-white p-5">{children}</View>;
}
