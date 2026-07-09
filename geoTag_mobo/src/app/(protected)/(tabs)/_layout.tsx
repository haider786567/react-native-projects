import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from '../../../store/hooks';

const tabIcons = {
  home: ['home', 'home-outline'],
  pdfScanner: ['document-text', 'document-text-outline'],
  GeoScanner: ['location', 'location-outline'],
  profile: ['person', 'person-outline'],
} as const;

export default function ProtectedTabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#006767', // Emerald Green (#006767)
        tabBarInactiveTintColor: '#64748b', // Slate-500
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { 
          height: 68, 
          paddingBottom: 8, 
          paddingTop: 7, 
          borderTopColor: '#e5e7eb', // Light border
          backgroundColor: '#ffffff' // Pure White surface
        },
        tabBarIcon: ({ color, focused, size }) => {
          const icons = tabIcons[route.name as keyof typeof tabIcons];
          return <Ionicons color={color} name={icons?.[focused ? 0 : 1] ?? 'ellipse-outline'} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: t.homeTab }} />
      <Tabs.Screen name="pdfScanner" options={{ title: t.pdfScanTab }} />
      <Tabs.Screen name="GeoScanner" options={{ title: t.geoScanTab }} />
      <Tabs.Screen name="profile" options={{ title: t.profileTab }} />
    </Tabs>
  );
}
