import { Alert, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityRow, InfoCard, SectionHeader } from '../../../components/ui/Dashboard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { ScannerPanel } from '../../../components/ui/ScannerPanel';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';

const locations = [
  { icon: 'location-outline' as const, title: 'Warehouse inspection', meta: '19.0760° N, 72.8777° E', badge: '12 pts' },
  { icon: 'location-outline' as const, title: 'Site survey A', meta: '18.5204° N, 73.8567° E', badge: '8 pts' },
];

export default function GeoScannerScreen() {
  return (
    <AppScreen>
      <ScreenHeader title="Geo Scanner" subtitle="Capture accurate location data in the field." />
      <ScannerPanel
        accent="emerald"
        buttonLabel="Start geo scan"
        description="Save coordinates, timestamp, accuracy, and field notes together in one reliable record."
        icon="navigate-outline"
        onPress={() => Alert.alert('Location access', 'Connect the device-location flow here.')}
        title="Record this location"
      />

      <SectionHeader title="Current signal" />
      <InfoCard>
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <Ionicons color="#10b981" name="radio-outline" size={24} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-bold text-slate-900">High accuracy</Text>
            <Text className="mt-1 text-sm text-slate-500">Estimated precision within 4 metres</Text>
          </View>
          <View className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </View>
      </InfoCard>

      <SectionHeader action="Open map" title="Saved locations" />
      {locations.map((item) => <ActivityRow key={item.title} {...item} />)}
    </AppScreen>
  );
}
