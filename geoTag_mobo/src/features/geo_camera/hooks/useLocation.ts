import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

import type { LocationObjectCoords } from 'expo-location';

export type GpsState = 'searching' | 'locked' | 'denied';

export type UseLocationResult = {
	coords: LocationObjectCoords | null;
	state: GpsState;
	accuracy: number | null;
	placeName: string | null;
	request: () => Promise<void>;
	refresh: () => Promise<void>;
};

function formatPlaceName(place: Location.LocationGeocodedAddress) {
	return [
		place.name,
		place.street,
		place.district,
		place.city,
		place.region,
		place.country,
	]
		.filter(Boolean)
		.filter((value, index, values) => values.indexOf(value) === index)
		.join(', ');
}

export function useLocation(autoRequest = true): UseLocationResult {
	const [coords, setCoords] = useState<LocationObjectCoords | null>(null);
	const [state, setState] = useState<GpsState>('searching');
	const [accuracy, setAccuracy] = useState<number | null>(null);
	const [placeName, setPlaceName] = useState<string | null>(null);

	const refresh = async () => {
		try {
			const next = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
			});
			setCoords(next.coords);
			setAccuracy(next.coords.accuracy ?? null);
			setState('locked');
		} catch {
			setState((current) => (current === 'denied' ? 'denied' : current));
		}
	};

	const request = useCallback(async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setState('denied');
			setPlaceName(null);
			return;
		}
		setState('searching');
		await refresh();
	}, []);

	useEffect(() => {
		if (!autoRequest) return;
		void request();
		const subscription = Location.watchPositionAsync(
			{ accuracy: Location.Accuracy.Balanced, distanceInterval: 5 },
			(location) => {
				setCoords(location.coords);
				setAccuracy(location.coords.accuracy ?? null);
				setState('locked');
			},
		);
		return () => {
			void subscription.then((s) => s.remove()).catch(() => undefined);
		};
	}, [autoRequest, request]);

	useEffect(() => {
		if (!coords || state !== 'locked') return;
		let cancelled = false;

		const resolvePlaceName = async () => {
			try {
				const [place] = await Location.reverseGeocodeAsync({
					latitude: coords.latitude,
					longitude: coords.longitude,
				});
				if (!cancelled) {
					setPlaceName(place ? formatPlaceName(place) || null : null);
				}
			} catch {
				if (!cancelled) {
					setPlaceName(null);
				}
			}
		};

		void resolvePlaceName();
		return () => {
			cancelled = true;
		};
	}, [coords?.latitude, coords?.longitude, state]);

	return { coords, state, accuracy, placeName, request, refresh };
}
