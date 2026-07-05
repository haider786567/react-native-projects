import { Redirect, Stack } from "expo-router";
import { useAppSelector } from "../../store/hooks";

export default function PublicLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) return <Redirect href="/home" />;
  return <Stack screenOptions={{headerShown:false}} />;
}
