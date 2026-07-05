import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import { useAuth } from "../../features/auth/hooks/auth.hooks";

export default function ForgotPasswordScreen() {
  const { handleForgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await handleForgotPassword(email.trim().toLowerCase());
      setMessage(result.message);
      if (result.resetToken) {
        router.push({ pathname: "/reset-password", params: { token: result.resetToken } });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 justify-center px-5">
        <View className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/10">
          <Text className="text-3xl font-extrabold text-slate-900">Forgot password</Text>
          <Text className="mb-6 mt-2 text-sm leading-5 text-slate-500">
            Enter your account email to generate password reset instructions.
          </Text>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Email</Text>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Enter your email"
            value={email}
          />
          {error ? <Text className="mt-2 text-sm text-rose-600">{error}</Text> : null}
          {message ? <Text className="mt-2 text-sm text-emerald-700">{message}</Text> : null}
          <Pressable
            className="mt-5 items-center rounded-xl bg-indigo-600 py-3"
            disabled={loading}
            onPress={() => void submit()}
          >
            <Text className="font-semibold text-white">{loading ? "Sending…" : "Continue"}</Text>
          </Pressable>
          <Link href="/login" asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-semibold text-indigo-600">Back to login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
