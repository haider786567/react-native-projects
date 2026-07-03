import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
};

export function ScreenHeader({ title, subtitle, actionIcon, onAction }: ScreenHeaderProps) {
  return (
    <View className="mb-6 flex-row items-start justify-between">
      <View className="mr-4 flex-1">
        <Text className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500">{subtitle}</Text>
      </View>
      {actionIcon ? (
        <Pressable
          accessibilityLabel={`${title} options`}
          className="h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white active:bg-slate-100"
          onPress={onAction}
        >
          <Ionicons color="#0f172a" name={actionIcon} size={21} />
        </Pressable>
      ) : null}
    </View>
  );
}
