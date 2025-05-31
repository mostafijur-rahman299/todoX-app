import { StyleSheet, Platform, StatusBar, View, SafeAreaView, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// ErrorUtils is usually a global variable in React Native, no direct import needed typically.
// If not available, specific import might be needed for Expo, but start by trying global.
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '@/store';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import { colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

// --- Global Error Handler Setup ---
const globalErrorHandler = (error, isFatal) => {
  console.error('Global Error Handler Caught:', error);
  Alert.alert(
    'Unexpected Error',
    'An unexpected error occurred. Please try restarting the app. If the problem persists, contact support.',
    [{ text: 'OK' }]
  );
  // You might want to report the error to an error tracking service here
  // For example: Sentry.captureException(error);
  // If the error is fatal, you might want to perform additional actions,
  // but usually, RN will attempt to shut down or show a red screen for fatal errors.
};

// Check if ErrorUtils is available and set the handler
if (global.ErrorUtils) {
  global.ErrorUtils.setGlobalHandler(globalErrorHandler);
} else {
  console.warn('ErrorUtils not available globally. Global error handler not set.');
  // Fallback or alternative for Expo if ErrorUtils is not on global
  // For Expo, you might explore 'expo-error-recovery' for more comprehensive handling
  // or rely on its default uncaught exception reporting.
  // However, for a simple alert, directly using ErrorUtils if available is common.
}
// --- End Global Error Handler Setup ---

export default function App() {
  const [loaded, error] = useFonts({
    'NicoMoji-Regular': require('./src/assets/fonts/NicoMoji-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={colors.primary}
          translucent={Platform.OS === 'android'}
        />
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <DrawerNavigation />
          </SafeAreaView>
        </NavigationContainer>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
