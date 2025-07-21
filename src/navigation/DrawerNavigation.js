import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/constants/Colors';
import Tasks from '@/navigation/Tasks';
import Categories from '@/screens/Category';
import BuyMeCoffee from '@/screens/ByMeCoffee';
import Feedback from '@/screens/Feedback';
import { useAuth } from '@/context/AuthContext';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { logout } = useAuth();
  
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      {/* App Header */}
      <View style={styles.drawerHeader}>
        <Icon name="checkbox-marked-circle-outline" size={40} color={colors.primary} />
        <Text style={styles.appTitle}>Task Manager</Text>
        <Text style={styles.appSubtitle}>Organize your day</Text>
      </View>
      
      {/* Main Navigation */}
      <View style={styles.section}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="format-list-checks" color={color} size={size} />
          )}
          label="My Tasks"
          onPress={() => props.navigation.navigate('tasks')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="shape" color={color} size={size} />
          )}
          label="Categories"
          onPress={() => props.navigation.navigate('categories')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="coffee" color={color} size={size} />
          )}
          label="Buy me a coffee"
          onPress={() => props.navigation.navigate('buy-me-coffee')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="help-circle" color={color} size={size} />
          )}
          label="Help & Support"
          onPress={() => props.navigation.navigate('feedback')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
      </View>
      
      {/* Logout Section */}
      <View style={styles.section}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="logout" color={colors.error} size={size} />
          )}
          label="Logout"
          onPress={() => logout()}
          style={[styles.drawerItem, styles.logoutItem]}
          labelStyle={[styles.drawerLabel, { color: colors.error }]}
        />
      </View>
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
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: "white",
        },
      }}
    >
      <Drawer.Screen name="tasks" component={Tasks} options={{
        headerShown: false,
      }} />
      <Drawer.Screen name="categories" component={Categories} options={{
        headerTitle: 'Categories',
      }} />
      <Drawer.Screen name="buy-me-coffee" component={BuyMeCoffee} options={{
        headerTitle: 'Buy me a coffee',
      }} />
      <Drawer.Screen name="feedback" component={Feedback} options={{
        headerTitle: 'Help & Support',
      }} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#fff',
    width: 300, // Slightly wider drawer
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    padding: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.lightGray,
    marginTop: 4,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.lightGray,
    marginLeft: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  drawerItem: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#f8f8f8',
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  header: {
    backgroundColor: '#6200ee',
    elevation: 0, // Removes shadow on Android
    shadowOpacity: 0, // Removes shadow on iOS
  },
  logoutItem: {
    marginTop: 'auto',
  },
});

export default DrawerNavigation;
