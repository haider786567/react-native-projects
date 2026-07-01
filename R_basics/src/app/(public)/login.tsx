import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginForm from '../../components/LoginForm';

const Login = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default Login;

