import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export const WatermarkService = {
	async captureWatermarkedView(viewRef: RefObject<View | null>): Promise<string> {
		return captureRef(viewRef, {
			format: 'jpg',
			quality: 0.96,
			result: 'tmpfile',
		});
	},
};
