import { Platform } from 'react-native';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native-css/components';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="mb-6">
              <Text className="text-2xl font-extrabold text-gray-900 mb-1.5">Welcome Back</Text>
              <Text className="text-sm text-gray-500">Login to your account</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-200 bg-gray-50 p-3 rounded-md text-base text-gray-900"
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
              {errors.email && <Text className="text-red-600 text-xs mt-1">{errors.email.message}</Text>}
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-200 bg-gray-50 p-3 rounded-md text-base text-gray-900"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.password && <Text className="text-red-600 text-xs mt-1">{errors.password.message}</Text>}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              className="bg-indigo-600 py-3 rounded-md items-center mt-2"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white text-base font-semibold">Login</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-5">
              <Text className="text-gray-500 text-sm">Don&apos;t have an account? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text className="text-indigo-600 text-sm font-semibold">Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default LoginForm;
