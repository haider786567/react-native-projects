import * as ExpoHaptics from 'expo-haptics';

export const Haptics = {
  async impactAsync(style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle.Light) {
    try {
      await ExpoHaptics.impactAsync(style);
    } catch {
      // ignore
    }
  },
  async notificationAsync(type: ExpoHaptics.NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType.Success) {
    try {
      await ExpoHaptics.notificationAsync(type);
    } catch {
      // ignore
    }
  },
  async selectionAsync() {
    try {
      await ExpoHaptics.selectionAsync();
    } catch {
      // ignore
    }
  }
};

export async function lightTap() {
  await Haptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
}

export async function mediumTap() {
  await Haptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
}

export async function success() {
  await Haptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
}
