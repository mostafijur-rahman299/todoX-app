import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inbox from '@/screens/Tasks/Inbox';
import Upcoming from '@/screens/Tasks/Upcoming';
import Browse from '@/screens/Tasks/Browse';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import TimelineCalendarScreen from '@/screens/Tasks/Timeline';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

/**
 * Main task navigation component with bottom tabs
 * Includes Inbox, Upcoming, and Browse screens
 */
export default function Tasks() {
    return (
        <Tab.Navigator
            initialRouteName='Inbox'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    backgroundColor: colors.background,
                    height: 80,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 5,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarIconStyle: {
                    marginTop: 5,
                },
            }}
        >
            <Tab.Screen
                name="Inbox"
                component={Inbox}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'mail' : 'mail-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Upcoming"
                component={Upcoming}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Timeline"
                component={TimelineCalendarScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'timeline-text' : 'timeline-text-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Browse"
                component={Browse}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'menu' : 'menu-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    // Add any custom styling here if needed
});
