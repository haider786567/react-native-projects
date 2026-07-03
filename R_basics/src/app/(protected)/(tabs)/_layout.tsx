import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const tabIcons = {
  home: ['home', 'home-outline'],
  pdfScanner: ['document-text', 'document-text-outline'],
  GeoScanner: ['location', 'location-outline'],
  profile: ['person', 'person-outline'],
} as const;

export default function ProtectedTabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { height: 68, paddingBottom: 8, paddingTop: 7, borderTopColor: '#e2e8f0' },
        tabBarIcon: ({ color, focused, size }) => {
          const icons = tabIcons[route.name as keyof typeof tabIcons];
          return <Ionicons color={color} name={icons?.[focused ? 0 : 1] ?? 'ellipse-outline'} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="pdfScanner" options={{ title: 'PDF Scan' }} />
      <Tabs.Screen name="GeoScanner" options={{ title: 'Geo Scan' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
