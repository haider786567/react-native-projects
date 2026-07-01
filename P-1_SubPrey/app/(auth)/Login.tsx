import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Login = () => {
  return (
    <View>
      <Text>Login page</Text>
      <Link href="/onboarding" className="mt-4 rounded bg-white px-4 py-2">
        Login
      </Link>
    </View>
  )
}

export default Login