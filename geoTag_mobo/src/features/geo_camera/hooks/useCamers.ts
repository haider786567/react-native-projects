import * as Haptics from 'expo-haptics';

export async function lightTap() {
	try {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	} catch {
		// haptics unsupported (e.g. on web) — ignore
	}
}

export async function mediumTap() {
	try {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	} catch {
		// ignore
	}
}

export async function success() {
	try {
		await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
	} catch {
		// ignore
	}
}