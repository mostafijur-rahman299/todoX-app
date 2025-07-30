import { StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '@/constants/Colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HelpAndFeedback from '../Browse/HelpAndFeedback';
import BrowseMenu from '../Browse/Menu';
import Settings from '../Browse/Settings';
import CompletedTask from '../Browse/CompletedTask';

const Stack = createNativeStackNavigator();

/**
 * Browse navigation component with stack navigator
 * Handles navigation between browse-related screens
 */
export default function Browse() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BrowseMenu" component={BrowseMenu} />
        <Stack.Screen name="HelpAndFeedback" component={HelpAndFeedback} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="CompletedTask" component={CompletedTask} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
