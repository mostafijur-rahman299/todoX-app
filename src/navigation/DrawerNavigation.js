import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens here
import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      {/* Header/Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profilePicContainer}>
          <Icon name="account-circle" size={70} color="#666" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@example.com</Text>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        )}
        label="Home"
        onPress={() => props.navigation.navigate('Home')}
        style={styles.drawerItem}
      />
      {/* <DrawerItem
        icon={({ color, size }) => (
          <Icon name="account" color={color} size={size} />
        )}
        label="Profile"
        onPress={() => props.navigation.navigate('Profile')}
        style={styles.drawerItem}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Icon name="cog" color={color} size={size} />
        )}
        label="Settings"
        onPress={() => props.navigation.navigate('Settings')}
        style={styles.drawerItem}
      /> */}
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: styles.drawer,
        headerStyle: styles.header,
        headerTintColor: '#fff',
        drawerActiveTintColor: '#6200ee',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#fff',
    width: 280,
  },
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  header: {
    backgroundColor: '#6200ee',
  },
});

export default DrawerNavigation;
