import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReactNode } from 'react'
type ScreenProps = {
  children: ReactNode
  classname?: string
}

const Screen = ({ children, classname="" }: ScreenProps) => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
        {children}
    </SafeAreaView>

  )
}

export default Screen