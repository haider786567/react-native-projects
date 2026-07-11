import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/theme';

type ScreenProps = {
  children: ReactNode;
  classname?: string;
};

const Screen = ({ children, classname = "" }: ScreenProps) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;