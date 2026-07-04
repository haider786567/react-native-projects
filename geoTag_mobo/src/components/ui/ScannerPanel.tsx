import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type ScannerPanelProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  buttonLabel: string;
  onPress?: () => void;
  accent?: 'indigo' | 'emerald';
};

export function ScannerPanel({
  icon,
  title,
  description,
  buttonLabel,
  onPress,
  accent = 'indigo',
}: ScannerPanelProps) {
  const emerald = accent === 'emerald';

  return (
    <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-8">
      <View className={`h-24 w-24 items-center justify-center rounded-full ${emerald ? 'bg-emerald-50' : 'bg-indigo-50'}`}>
        <View className={`h-16 w-16 items-center justify-center rounded-2xl ${emerald ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
          <Ionicons color="white" name={icon} size={32} />
        </View>
      </View>
      <Text className="mt-6 text-center text-2xl font-extrabold text-slate-950">{title}</Text>
      <Text className="mt-2 max-w-md text-center text-sm leading-6 text-slate-500">{description}</Text>
      <Pressable
        className={`mt-6 w-full max-w-sm flex-row items-center justify-center rounded-2xl py-4 active:opacity-80 ${
          emerald ? 'bg-emerald-500' : 'bg-indigo-600'
        }`}
        onPress={onPress}
      >
        <Ionicons color="white" name="scan" size={20} />
        <Text className="ml-2 font-bold text-white">{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}
