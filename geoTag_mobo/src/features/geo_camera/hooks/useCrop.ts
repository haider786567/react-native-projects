import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

import type { CropRegion } from '../types/geoCamers.type';
import { lightTap, success } from './useCamers';

export function useCrop() {
	const [isCropVisible, setIsCropVisible] = useState(false);
	const [isCropping, setIsCropping] = useState(false);

	const showCrop = useCallback(() => {
		setIsCropVisible(true);
		void lightTap();
	}, []);

	const hideCrop = useCallback(() => {
		setIsCropVisible(false);
		void lightTap();
	}, []);

	const applyCrop = useCallback(
		async (uri: string, region: CropRegion): Promise<string | null> => {
			setIsCropping(true);
			try {
				const result = await ImageManipulator.manipulateAsync(
					uri,
					[
						{
							crop: {
								originX: Math.round(region.originX),
								originY: Math.round(region.originY),
								width: Math.round(region.width),
								height: Math.round(region.height),
							},
						},
					],
					{ compress: 0.92, format: ImageManipulator.SaveFormat.JPEG },
				);
				await success();
				setIsCropVisible(false);
				return result.uri;
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Failed to crop image';
				Alert.alert('Crop failed', message);
				return null;
			} finally {
				setIsCropping(false);
			}
		},
		[],
	);

	return {
		isCropVisible,
		isCropping,
		showCrop,
		hideCrop,
		applyCrop,
	};
}
