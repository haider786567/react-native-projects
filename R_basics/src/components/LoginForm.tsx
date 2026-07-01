import { View, Text, Pressable, TextInput } from 'react-native'
import React from 'react'

const LoginForm = () => {
  return (
    <View>
  <Text style={{ margin: 10, fontSize: 24, fontWeight: 'bold' }}>Welcome Back</Text>

  <Text style={{ margin: 10 }}>Sign in to continue</Text>

  <Text style={{ margin: 10, fontSize: 16, fontWeight: 'bold' }}>Email</Text>

  <TextInput />

  <Text style={{ margin: 10, fontSize: 16, fontWeight: 'bold' }}>Password</Text>

  <TextInput secureTextEntry />

  <Pressable>
    <Text style={{ margin: 10, fontSize: 16, fontWeight: 'bold' }}>Login</Text>
  </Pressable>

  <Pressable>
    <Text style={{ margin: 10, fontSize: 16, fontWeight: 'bold' }}>Forgot Password?</Text>
  </Pressable>
</View>
  )
}

export default LoginForm