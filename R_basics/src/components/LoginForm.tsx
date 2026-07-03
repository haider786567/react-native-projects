import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validation/login.validation';
type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    
    // Basic form handling – wire up real login logic here
    console.log('Login data:', data);
    router.push('/home');
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
                <Text className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</Text>
                <Text className="text-sm text-slate-500">Login to your account</Text>
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
                      placeholder="Enter your password"
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

              <TouchableOpacity
                activeOpacity={0.85}
                className="mt-2 items-center rounded-xl bg-indigo-600 py-3"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-base font-semibold text-white">Login</Text>
              </TouchableOpacity>

              <View className="mt-5 flex-row items-center justify-center">
                <Text className="text-sm text-slate-500">Don&apos;t have an account? </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-indigo-600">Create Account</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default LoginForm;
