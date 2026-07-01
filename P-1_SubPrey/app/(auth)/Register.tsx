import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Register = () => {
  return (
    <View>
      <Text>Register page</Text>
      <Link href="/Login" className="mt-4 rounded bg-white px-4 py-2">
        Get Started
      </Link>

    </View>
  )
}

export default Register