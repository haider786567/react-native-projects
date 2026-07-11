import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../../../constants/theme';
import { useTranslation } from '../../../store/hooks';
import { Haptics } from '../../../utils/haptics';
import { useAppDispatch } from '../../../store/hooks';
import { changeTheme } from '../../../store/preferences.slice';

type AppearanceModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const AppearanceModal = ({ visible, onClose }: AppearanceModalProps) => {
  const { t } = useTranslation();
  const { isDark, colors: c } = useTheme();
  const dispatch = useAppDispatch();

  const toggleAppTheme = (selectedTheme: 'light' | 'dark') => {
    Haptics.impactAsync();
    dispatch(changeTheme(selectedTheme));
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View style={{ backgroundColor: isDark ? '#081212' : '#ffffff' }} className="rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text style={{ color: c.text }} className="text-xl font-bold">Choose Theme</Text>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons color={c.text} name="close" size={24} />
            </Pressable>
          </View>

          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={() => toggleAppTheme('light')}
              style={{
                borderColor: !isDark ? '#2dd4bf' : 'transparent',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
              }}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4 border-2"
            >
              <Ionicons color={!isDark ? '#14b8a6' : '#94a3b8'} name="sunny-outline" size={20} />
              <Text style={{ color: !isDark ? '#006767' : c.text }} className="font-bold text-sm">Light Mode</Text>
            </Pressable>

            <Pressable
              onPress={() => toggleAppTheme('dark')}
              style={{
                borderColor: isDark ? '#2dd4bf' : 'transparent',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
              }}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4 border-2"
            >
              <Ionicons color={isDark ? '#2dd4bf' : '#94a3b8'} name="moon-outline" size={20} />
              <Text style={{ color: isDark ? '#2dd4bf' : c.text }} className="font-bold text-sm">Dark Mode</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppearanceModal;
