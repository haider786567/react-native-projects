import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RegisterForm from '../../components/RegisterForm';

const Register = () => {
  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <RegisterForm />
    </View>
  );
};

export default Register;
