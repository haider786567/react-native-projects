import { View, Text, Pressable, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../validations/register.validation';
import Screen from '@/src/components/Screen';
import Input from '@/src/components/Input';
import {useAuth} from '../hooks/auth.hooks';
type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { handleRegister, isLoading, error } = useAuth();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await handleRegister(data);
      router.replace('/home');
    } catch {
      // The hook exposes a user-friendly error below the form.
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-lg self-center px-5 py-6">
            <View className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/10">
              <View className="mb-6">
                <Text className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">Create Account</Text>
                <Text className="text-sm text-slate-500">Sign up to get started</Text>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your full name"
                      placeholderTextColor="#9CA3AF"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && <Text className="mt-1 text-xs text-rose-600">{errors.name.message}</Text>}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && <Text className="mt-1 text-xs text-rose-600">{errors.email.message}</Text>}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Create a password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && <Text className="mt-1 text-xs text-rose-600">{errors.password.message}</Text>}
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Re-enter your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.confirmPassword && <Text className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</Text>}
              </View>

              <Pressable
                className="mt-2 items-center rounded-xl bg-indigo-600 py-3"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Text className="text-base font-semibold text-white">{isLoading ? 'Creating account…' : 'Sign Up'}</Text>
              </Pressable>
              {error ? <Text className="mt-3 text-center text-sm text-rose-600">{error}</Text> : null}

              <View className="mt-5 flex-row items-center justify-center">
                <Text className="text-sm text-slate-500">Already have an account? </Text>
                <Link href="/login" asChild>
                  <Pressable>
                    <Text className="text-sm font-semibold text-indigo-600">Sign In</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default RegisterForm;
