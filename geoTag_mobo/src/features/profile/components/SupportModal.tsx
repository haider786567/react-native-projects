import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../constants/theme';
import { useTranslation } from '../../../store/hooks';
import { useAuth } from '../../auth/hooks/auth.hooks';
import { Haptics } from '../../../utils/haptics';

type SupportModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const SupportModal = ({ visible, onClose }: SupportModalProps) => {
  const { t } = useTranslation();
  const { isDark, colors: c } = useTheme();
  const { user } = useAuth();
  const [supportMessage, setSupportMessage] = useState('');

  const handleSendSupport = () => {
    if (!supportMessage.trim()) {
      Alert.alert('Empty Message', 'Please describe your request.');
      return;
    }
    
    const phone = '918619848786';
    const messageText = `Support query from ${user?.name || 'User'} (${user?.email || 'No email'}):\n\n${supportMessage}`;
    const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(messageText)}`;
    const whatsappWebUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
    
    Linking.canOpenURL(whatsappUrl).then((supported) => {
      Haptics.notificationAsync();
      onClose();
      setSupportMessage('');
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Linking.openURL(whatsappWebUrl);
      }
    }).catch(() => {
      Linking.openURL(whatsappWebUrl);
    });
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View style={{ backgroundColor: isDark ? '#081212' : '#ffffff' }} className="h-[85%] rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100/10">
            <Text style={{ color: c.text }} className="text-xl font-bold">{t.helpSupport}</Text>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons color={c.text} name="close" size={24} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <Text style={{ color: c.textMuted }} className="text-xs font-extrabold uppercase tracking-wider mb-3">Frequently Asked Questions</Text>
            <View className="gap-4.5 mb-6">
              <View style={{ backgroundColor: isDark ? '#0f2020' : '#f1f5f9' }} className="p-4 rounded-xl">
                <Text style={{ color: c.text }} className="font-bold text-xs">Q: How do I export scanned PDF files?</Text>
                <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                  After capturing pages, click the "Review Pages" button. Review the details, and click "Save as PDF" to prompt the system download folder.
                </Text>
              </View>
              <View style={{ backgroundColor: isDark ? '#0f2020' : '#f1f5f9' }} className="p-4 rounded-xl">
                <Text style={{ color: c.text }} className="font-bold text-xs">Q: Why does the GPS lock display 'Locating'?</Text>
                <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                  The application verifies location coordinates locally. Make sure location permissions are active and you are in a location with open sky access.
                </Text>
              </View>
              <View style={{ backgroundColor: isDark ? '#0f2020' : '#f1f5f9' }} className="p-4 rounded-xl">
                <Text style={{ color: c.text }} className="font-bold text-xs">Q: Can I crop page documents after taking photos?</Text>
                <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                  Yes! Click "Review Pages" at the top of the scanner viewport, then click "Crop Page" to open the boundary guides.
                </Text>
              </View>
            </View>

            <Text style={{ color: c.textMuted }} className="text-xs font-extrabold uppercase tracking-wider mb-2.5">Submit Support Ticket (WhatsApp)</Text>
            <View className="gap-3 mb-6">
              <TextInput
                value={supportMessage}
                onChangeText={setSupportMessage}
                style={{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }}
                className="h-24 rounded-xl p-3.5 text-sm font-semibold border"
                placeholder="How can we help you? Describe your issue here..."
                placeholderTextColor="#64748b"
                multiline
                textAlignVertical="top"
              />
              <Pressable
                onPress={handleSendSupport}
                className="h-12 rounded-xl bg-teal-500 items-center justify-center active:opacity-90 shadow-sm"
              >
                <Text className="text-white text-xs font-bold uppercase tracking-wider">Submit to WhatsApp</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SupportModal;
