import { View, Text, Pressable, TextInput, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../validation/register.validation';

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

  const onSubmit = (data: RegisterFormValues) => {
    // Basic form handling – wire up real registration logic here
    console.log('Register data:', data);
    router.push('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
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
                    <TextInput
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
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
                    <TextInput
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
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
                    <TextInput
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
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
                    <TextInput
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
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
              >
                <Text className="text-base font-semibold text-white">Sign Up</Text>
              </Pressable>

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
    </SafeAreaView>
  );
};

export default RegisterForm;
