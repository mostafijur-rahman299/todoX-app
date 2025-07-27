import { StyleSheet, StatusBar, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '@/store';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import AuthNavigation from './src/navigation/AuthNavigation';
import { colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getDataLocalStorage, storeDataLocalStorage } from './src/utils/storage';

const Stack = createNativeStackNavigator();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Main application component that sets up the app environment
 * including fonts, state providers, and navigation
 */
export default function App() {
  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'NicoMoji-Regular': require('./src/assets/fonts/NicoMoji-Regular.ttf'),
  });

  // Hide splash screen once fonts are loaded or if there's an error
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}

/**
 * AppNavigator component that handles conditional rendering
 * based on authentication state and first launch status
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // Check if this is the first app launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await getDataLocalStorage('hasLaunched');
        if (hasLaunched === null) {
          await storeDataLocalStorage('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false); // Default to false on error
      }
    };

    checkFirstLaunch();
  }, []);
  
  // Show loading indicator while checking auth state
  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  // Determine initial route based on auth state and first launch
  const initialRouteName = isAuthenticated ? 'Task' : (isFirstLaunch ? 'Auth' : 'Auth');
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator 
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={AuthNavigation} />
        <Stack.Screen name="Task" component={DrawerNavigation} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: StatusBar.currentHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
