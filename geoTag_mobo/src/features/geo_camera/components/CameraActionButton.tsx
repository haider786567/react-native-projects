import { Pressable, Text, View } from 'react-native';
import type { CameraActionButtonProps } from '../types/geoCamers.type';

export function CameraActionButton({ icon, label, active = false, disabled = false, onPress }: CameraActionButtonProps) {
	const buttonStateClass = disabled ? 'opacity-40' : 'active:opacity-80';

	return (
		<View className="items-center gap-1.5">
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={label}
				className={`h-12 w-12 items-center justify-center rounded-full ${active ? 'bg-amber-400' : 'border border-white/15 bg-white/12'} ${buttonStateClass}`}
				disabled={disabled}
				onPress={onPress}
			>
				{icon}
			</Pressable>
			{label ? (
				<Text className="text-[10px] font-semibold tracking-wide text-white/80" numberOfLines={1}>
					{label}
				</Text>
			) : null}
		</View>
	);
}
