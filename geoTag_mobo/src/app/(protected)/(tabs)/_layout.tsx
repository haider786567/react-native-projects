import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from '../../../store/hooks';
import { useTheme } from '../../../constants/theme';

const tabIcons = {
  home: ['home', 'home-outline'],
  pdfScanner: ['document-text', 'document-text-outline'],
  GeoScanner: ['location', 'location-outline'],
  profile: ['person', 'person-outline'],
} as const;

export default function ProtectedTabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tealText,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { 
          height: 68, 
          paddingBottom: 8, 
          paddingTop: 7, 
          borderTopColor: colors.divider,
          backgroundColor: colors.headerBg
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
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
