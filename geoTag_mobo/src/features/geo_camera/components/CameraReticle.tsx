import { Text, View } from 'react-native';
import type { CameraReticleProps } from '../types/geoCamers.type';

export function CameraReticle({ active = true, label = 'Center the subject' }: CameraReticleProps) {
	if (!active) return null;

	return (
		<View pointerEvents="none" className="items-center justify-center">
			<View className="h-64 w-64 items-center justify-center">
				<View className="absolute left-0 top-0 h-7 w-7 rounded-tl-2xl border-l-2 border-t-2 border-white/85" />
				<View className="absolute right-0 top-0 h-7 w-7 rounded-tr-2xl border-r-2 border-t-2 border-white/85" />
				<View className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-2xl border-b-2 border-l-2 border-white/85" />
				<View className="absolute bottom-0 right-0 h-7 w-7 rounded-br-2xl border-b-2 border-r-2 border-white/85" />

				<View className="h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10">
					<View className="h-2 w-2 rounded-full bg-white" />
				</View>

				<View className="absolute bottom-[-36px] rounded-full bg-slate-950/55 px-3 py-1.5">
					<Text className="text-[11px] font-semibold text-white">{label}</Text>
				</View>
			</View>
		</View>
	);
}
