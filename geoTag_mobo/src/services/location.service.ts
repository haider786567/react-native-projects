import * as Location from 'expo-location';

export const LocationService = {
  async getCurrentLocation(): Promise<string> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return 'Location: Permission Denied';
    }
    const loc = await Location.getCurrentPositionAsync({});
    return `Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)}`;
  }
};
