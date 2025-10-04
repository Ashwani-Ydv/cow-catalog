import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CowProvider } from '@/contexts/CowContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CowProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="add-cow" 
            options={{ 
              presentation: 'modal', 
              title: 'Add New Cow',
              headerBackTitle: 'Cancel',
            }} 
          />
          <Stack.Screen 
            name="cow/[id]" 
            options={{ 
              title: 'Cow Details',
              headerBackTitle: 'Back',
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CowProvider>
  );
}
