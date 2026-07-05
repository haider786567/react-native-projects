import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAppSelector } from "../../store/hooks";

export default function ProtectedLayout() {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  if (!isInitialized) {
    return <View className="flex-1 items-center justify-center"><ActivityIndicator /></View>;
  }
  if (!isAuthenticated) return <Redirect href="/login" />;
  return <Stack screenOptions={{headerShown:false}} />;
}
