import { Stack } from "expo-router";
import "../../global.css";
import { AppProvider } from "../store/provider";

export default function RootLayout() {
  return <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
  </AppProvider>
}
