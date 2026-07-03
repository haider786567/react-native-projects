import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginForm from '../../components/LoginForm';

const Login = () => {
  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <LoginForm />
    </View>
  );
};

export default Login;
