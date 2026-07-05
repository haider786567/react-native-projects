import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import { useAuth } from "../../features/auth/hooks/auth.hooks";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const { handleResetPassword } = useAuth();
  const [token, setToken] = useState(params.token ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (token.length < 32) return setError("Enter a valid reset token.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    setError(null);
    try {
      await handleResetPassword(token.trim(), password, confirmPassword);
      router.replace("/login");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 justify-center px-5">
        <View className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/10">
          <Text className="text-3xl font-extrabold text-slate-900">Reset password</Text>
          <Text className="mb-5 mt-2 text-sm text-slate-500">Choose a new password for your account.</Text>
          <Text className="mb-2 text-sm font-semibold text-slate-700">Reset token</Text>
          <Input autoCapitalize="none" onChangeText={setToken} placeholder="Paste reset token" value={token} />
          <Text className="mb-2 mt-4 text-sm font-semibold text-slate-700">New password</Text>
          <Input onChangeText={setPassword} placeholder="New password" secureTextEntry value={password} />
          <Text className="mb-2 mt-4 text-sm font-semibold text-slate-700">Confirm password</Text>
          <Input onChangeText={setConfirmPassword} placeholder="Confirm password" secureTextEntry value={confirmPassword} />
          {error ? <Text className="mt-2 text-sm text-rose-600">{error}</Text> : null}
          <Pressable
            className="mt-5 items-center rounded-xl bg-indigo-600 py-3"
            disabled={loading}
            onPress={() => void submit()}
          >
            <Text className="font-semibold text-white">{loading ? "Updating…" : "Reset password"}</Text>
          </Pressable>
          <Link href="/login" asChild>
            <Pressable className="mt-4 items-center"><Text className="font-semibold text-indigo-600">Back to login</Text></Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
