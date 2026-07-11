import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../constants/theme';
import { useTranslation } from '../../../store/hooks';

type PrivacyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const PrivacyModal = ({ visible, onClose }: PrivacyModalProps) => {
  const { t } = useTranslation();
  const { isDark, colors: c } = useTheme();

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View style={{ backgroundColor: isDark ? '#081212' : '#ffffff' }} className="h-[80%] rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100/10">
            <Text style={{ color: c.text }} className="text-xl font-bold">{t.privacySecurity}</Text>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons color={c.text} name="close" size={24} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pr-1">
            <View className="gap-5 py-2">
              <View className="flex-row items-start gap-3">
                <View style={{ backgroundColor: c.iconBg }} className="h-8 w-8 rounded-lg items-center justify-center mt-0.5">
                  <Ionicons color={c.tealText} name="server" size={16} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: c.text }} className="font-bold text-sm">Local-First Data Storage</Text>
                  <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                    All photo uploads, coordinates databases, and scanned PDF documents are compiled and written directly inside the local application cache directory. No documents are routed through third-party servers.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View style={{ backgroundColor: c.iconBg }} className="h-8 w-8 rounded-lg items-center justify-center mt-0.5">
                  <Ionicons color={c.tealText} name="lock-closed" size={16} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: c.text }} className="font-bold text-sm">Secure Coordinates Logs</Text>
                  <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                    GPS location logs, latitude, longitude, and accuracy ratings are bound directly to your scans. Stored telemetry coordinates cannot be customized post-capture, preserving legal and professional validity.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View style={{ backgroundColor: c.iconBg }} className="h-8 w-8 rounded-lg items-center justify-center mt-0.5">
                  <Ionicons color={c.tealText} name="eye-off" size={16} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: c.text }} className="font-bold text-sm">Zero Analytics Trackers</Text>
                  <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                    Buildrigs features zero third-party software development kits (SDKs), advertising networks, or usage statistics pipelines, establishing absolute privacy and secure data processing.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View style={{ backgroundColor: c.iconBg }} className="h-8 w-8 rounded-lg items-center justify-center mt-0.5">
                  <Ionicons color={c.tealText} name="shield" size={16} />
                </View>
                <View className="flex-1">
                  <Text style={{ color: c.text }} className="font-bold text-sm">App Sandbox Encapsulation</Text>
                  <Text style={{ color: c.textMuted }} className="text-xs mt-1 leading-5">
                    Document exports occur via the operating system's native Share Sheets or Storage Access Framework, guaranteeing secure data transmission during saves or uploads.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyModal;
