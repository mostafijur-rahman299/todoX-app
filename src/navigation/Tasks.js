import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Today from '@/screens/Tasks/Today';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function Tasks() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            initialRouteName='Today'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    backgroundColor: colors.primary,
                    height: 70,
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: colors.shadow,
                    shadowOffset: {
                        width: 0,
                        height: -4,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 8,
                },
                tabBarActiveTintColor: colors.white,
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
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
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu"
                component={EmptyComponent}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name="menu-outline"
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarButton: (props) => (
                        <Pressable 
                            {...props} 
                            style={[props.style, styles.menuButton]}
                            onPress={() => {
                                if (navigation.openDrawer) {
                                    navigation.openDrawer();
                                }
                            }} 
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Empty component for Menu screen
const EmptyComponent = () => null;

const styles = StyleSheet.create({
    menuButton: {
        // Add any custom styling for the menu button here
    }
});
