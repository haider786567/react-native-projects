import { Link } from "expo-router";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import  homeImg from "../../assets/images/home.jpg";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={homeImg}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.title}>Welcome to R_basics</Text>
        <Text style={styles.subtitle}>
          A beautiful starter for your next React Native app. Sign in to continue or get
          started in seconds.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Fast & modern stack</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Type-safe with TypeScript</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>Powered by Expo Router</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get started</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  topSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#11181C",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    width: 600,
    height: 330,
  },
  middleSection: {
    flex: 2,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#11181C",
  },
  subtitle: {
    fontSize: 15,
    color: "#687076",
    lineHeight: 22,
    marginTop: 8,
  },
  featureList: {
    marginTop: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#11181C",
  },
  featureText: {
    fontSize: 15,
    color: "#11181C",
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#11181C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#11181C",
  },
  secondaryButtonText: {
    color: "#11181C",
    fontSize: 16,
    fontWeight: "600",
  },
});
