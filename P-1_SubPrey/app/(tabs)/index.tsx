import "@/global.css"
import { Link } from "expo-router";
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-white px-4 py-2"> 
        Get Started
      </Link>
      <Link href="/Register" className="mt-4 rounded bg-white px-4 py-2"> 
        Register
      </Link>
      <Link href="/Login" className="mt-4 rounded bg-white px-4 py-2"> 
        Login
      </Link>

    </View>
  );
}