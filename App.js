import { StyleSheet, StatusBar, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AuthNavigation from './src/navigation/AuthNavigation';
import { colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getDataLocalStorage, storeDataLocalStorage } from './src/utils/storage';
import StartScreen from './src/screens/StartScreen';
import ErrorBoundary from './src/components/UI/ErrorBoundary';
import Task from './src/navigation/Tasks'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Main application component that sets up the app environment
 * including fonts, state providers, and navigation with dark theme
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <AuthProvider>
            <View style={styles.container}>
              <StatusBar 
                barStyle="dark-content" 
                backgroundColor={colors.primary} 
                translucent={false}
              />
              {fontsLoaded ? (
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
            </View>
          </AuthProvider>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
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
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        // initialRouteName={isFirstLaunch ? "Start" : (isAuthenticated ? "Task" : "Auth")}
      >
        {/* {!isFirstLaunch && (
          <Stack.Screen name="Start" component={StartScreen} />
        )} */}
          <Stack.Screen name="Task" component={Task} />
      
          <Stack.Screen name="Auth" component={AuthNavigation} />
      
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
