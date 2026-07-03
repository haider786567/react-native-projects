import { Link } from "expo-router";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import  homeImg from "../../assets/images/home.jpg";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-[2] items-center justify-center rounded-b-[32px] bg-slate-950 px-6">
        <Image
          source={homeImg}
          style={{ width: 600, height: 330 }}
          contentFit="contain"
        />
      </View>

      <View className="flex-[2] justify-center px-6 pt-8">
        <Text className="text-[30px] font-bold text-slate-950">Welcome to R_basics</Text>
        <Text className="mt-2 text-[15px] leading-6 text-slate-500">
          A beautiful starter for your next React Native app. Sign in to continue or get
          started in seconds.
        </Text>

        <View className="mt-6 gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-2 w-2 rounded-full bg-slate-950" />
            <Text className="text-[15px] text-slate-950">Fast & modern stack</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-2 w-2 rounded-full bg-slate-950" />
            <Text className="text-[15px] text-slate-950">Type-safe with TypeScript</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-2 w-2 rounded-full bg-slate-950" />
            <Text className="text-[15px] text-slate-950">Powered by Expo Router</Text>
          </View>
        </View>
      </View>

      <View className="gap-3 px-6 pb-6 pt-2">
        <Link href="/login" asChild>
          <TouchableOpacity className="items-center rounded-xl border border-slate-950 bg-transparent py-4">
            <Text className="text-base font-semibold text-slate-950">Sign in</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/register" asChild>
          <TouchableOpacity className="items-center rounded-xl bg-slate-950 py-4">
            <Text className="text-base font-semibold text-white">Get started</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
