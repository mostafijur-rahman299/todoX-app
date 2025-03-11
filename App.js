import { StyleSheet, Platform, StatusBar, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import StartScreen from './src/screens/StartScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tasks from '@/navigation/Tasks';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();


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
    <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          options={{
            headerShown: false,
          }}

          name="StartScreen" component={StartScreen} /> */}
        <Stack.Screen
          options={{
            headerShown: false,
          }}

          name="Tasks" component={Tasks} />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : StatusBar.currentHeight + 50,
  },
});
