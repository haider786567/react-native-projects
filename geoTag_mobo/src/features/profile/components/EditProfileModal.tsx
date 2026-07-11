import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, TextInput, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { useTheme } from '../../../constants/theme';
import { useTranslation } from '../../../store/hooks';
import { useAuth } from '../../auth/hooks/auth.hooks';
import { Haptics } from '../../../utils/haptics';
import { AI_AVATARS } from './AvatarRenderer';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const EditProfileModal = ({ visible, onClose }: EditProfileModalProps) => {
  const { t } = useTranslation();
  const { isDark, colors: c } = useTheme();
  const { user, handleUpdateProfile, isLoading } = useAuth();

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar_boy');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [pickingImage, setPickingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setSelectedAvatar(user.avatar || 'avatar_boy');
      if (user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('file:') || user.avatar.startsWith('/') || user.avatar.startsWith('data:'))) {
        setCustomAvatarUrl(user.avatar);
      } else {
        setCustomAvatarUrl('');
      }
    }
  }, [user, visible]);

  const saveProfileChanges = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Validation Error', 'Name and Email fields cannot be empty.');
      return;
    }
    
    let avatarValue = selectedAvatar;
    if (customAvatarUrl.trim() !== '') {
      avatarValue = customAvatarUrl.trim();
    }

    try {
      await handleUpdateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        avatar: avatarValue,
      });
      Haptics.notificationAsync();
      onClose();
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Sync Failed', error instanceof Error ? error.message : 'Could not save profile changes.');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to select photos.');
        return;
      }

      setPickingImage(true);
      const result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64 = result.assets[0].base64;
        if (!base64) {
          throw new Error('Could not read image data');
        }
        Haptics.notificationAsync();
        const avatarDataUri = `data:image/jpeg;base64,${base64}`;
        
        setCustomAvatarUrl(avatarDataUri);
        setSelectedAvatar(avatarDataUri);
      }
    } catch {
      Alert.alert('Upload Error', 'Could not load gallery image.');
    } finally {
      setPickingImage(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View style={{ backgroundColor: isDark ? '#081212' : '#ffffff' }} className="rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: c.text }} className="text-xl font-bold">{t.editProfile}</Text>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons color={c.text} name="close" size={24} />
            </Pressable>
          </View>

          {/* Custom Photo Uploader (Gallery) */}
          <View className="items-center mb-5">
            <Pressable
              onPress={pickImageFromGallery}
              disabled={pickingImage}
              style={{ borderColor: c.cardBorder }}
              className="h-28 w-28 items-center justify-center rounded-full border-2 border-dashed bg-teal-500/5 active:opacity-80 overflow-hidden"
            >
              {pickingImage ? (
                <ActivityIndicator color={isDark ? '#2dd4bf' : '#006767'} />
              ) : customAvatarUrl ? (
                <Image source={{ uri: customAvatarUrl }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <View className="items-center justify-center p-2">
                  <Ionicons color={isDark ? '#2dd4bf' : '#006767'} name="camera" size={28} />
                  <Text style={{ color: c.tealText }} className="mt-1 text-[9px] font-bold text-center">Choose Photo</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Person Avatar Presets */}
          <Text style={{ color: c.textMuted }} className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-center">Or Select Avatar Preset</Text>
          <View className="flex-row gap-3 justify-center mb-6">
            {AI_AVATARS.map((avatar) => {
              const isSelected = selectedAvatar === avatar.id && customAvatarUrl.trim() === '';
              return (
                <Pressable
                  key={avatar.id}
                  onPress={() => {
                    setSelectedAvatar(avatar.id);
                    setCustomAvatarUrl('');
                  }}
                  style={{
                    borderColor: isSelected ? '#2dd4bf' : 'transparent',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                  }}
                  className="h-14 w-14 items-center justify-center rounded-xl border-2"
                >
                  <Image source={avatar.image} className="h-12 w-12 rounded-lg" resizeMode="cover" />
                </Pressable>
              );
            })}
          </View>

          {/* Profile Inputs */}
          <View className="gap-3.5 mb-6">
            <View>
              <Text style={{ color: c.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1">Full Name</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }}
                className="h-11 rounded-xl px-4 text-xs font-semibold border"
                placeholder="Enter name"
                placeholderTextColor="#64748b"
              />
            </View>
            <View>
              <Text style={{ color: c.textMuted }} className="text-[10px] font-bold uppercase tracking-wider mb-1">Email Address</Text>
              <TextInput
                value={editEmail}
                onChangeText={setEditEmail}
                style={{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }}
                className="h-11 rounded-xl px-4 text-xs font-semibold border"
                placeholder="Enter email"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Pressable
            onPress={saveProfileChanges}
            disabled={isLoading}
            className="h-14 rounded-2xl bg-teal-500 items-center justify-center active:opacity-90 shadow-sm"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-extrabold uppercase tracking-wider">Save Changes</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;
