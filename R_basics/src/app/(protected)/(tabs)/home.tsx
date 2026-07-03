import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { ActionCard, ActivityRow, SectionHeader, StatCard } from '../../../components/ui/Dashboard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';

const recentActivity = [
  { icon: 'document-text-outline' as const, title: 'Project proposal.pdf', meta: 'PDF scan · Today, 10:42 AM', badge: 'Ready' },
  { icon: 'location-outline' as const, title: 'Warehouse inspection', meta: 'Geo scan · Yesterday', badge: 'Synced' },
  { icon: 'document-text-outline' as const, title: 'Expense receipts.pdf', meta: 'PDF scan · Jun 28', badge: 'Ready' },
];

export default function HomeScreen() {
  return (
    <AppScreen>
      <ScreenHeader
        title="Good morning"
        subtitle="What would you like to capture today?"
        actionIcon="notifications-outline"
        onAction={() => Alert.alert('Notifications', 'You are all caught up.')}
      />

      <View className="flex-row gap-3">
        <ActionCard
          description="Turn pages into a clean PDF"
          icon="document-text-outline"
          onPress={() => router.push('/pdfScanner')}
          title="Scan PDF"
        />
        <ActionCard
          description="Capture a place with coordinates"
          icon="location-outline"
          onPress={() => router.push('/GeoScanner')}
          title="Geo Scan"
          tone="emerald"
        />
      </View>

      <SectionHeader title="Overview" />
      <View className="flex-row flex-wrap gap-3">
        <StatCard icon="documents-outline" label="Total scans" value="48" />
        <StatCard icon="cloud-done-outline" label="Cloud synced" value="42" />
        <StatCard icon="time-outline" label="This week" value="12" />
      </View>

      <SectionHeader action="View all" title="Recent activity" />
      {recentActivity.map((item) => <ActivityRow key={item.title} {...item} />)}
    </AppScreen>
  );
}
