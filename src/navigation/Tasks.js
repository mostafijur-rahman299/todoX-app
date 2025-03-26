import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Today from '@/screens/Tasks/Today';
import Completed from '@/screens/Tasks/Completed';
import Upcomming from '@/screens/Tasks/Upcomming';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function Tasks() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    backgroundColor: colors.primary,
                    height: 80,
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: colors.shadow,
                    shadowOffset: {
                        width: 0,
                        height: -4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 8,
                },
                tabBarActiveTintColor: colors.white,
                tabBarInactiveTintColor: colors.lightGray,
                tabBarIconStyle: {
                    marginTop: 8,
                },
            }}
        >
            <Tab.Screen
                name="Today"
                component={Today}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'today' : 'today-outline'}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Upcomming"
                component={Upcomming}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu"
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="menu-outline"
                            size={28}
                            color={color}
                        />
                    ),
                    tabBarButton: (props) => (
                        <Pressable {...props} onPress={() => {console.log('Menu pressed')}} />
                    ),
                }}
                children={() => null} 
            />
        </Tab.Navigator>
    );
}