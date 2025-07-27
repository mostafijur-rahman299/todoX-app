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

/**
 * Custom drawer content component with dark theme
 */
const CustomDrawerContent = (props) => {
  const { logout } = useAuth();
  
  return (
    <DrawerContentScrollView 
      {...props} 
      style={styles.drawerContent}
      contentContainerStyle={styles.drawerContentContainer}
    >
      {/* App Header */}
      <View style={styles.drawerHeader}>
        <Icon name="checkbox-marked-circle-outline" size={48} color={colors.primary} />
        <Text style={styles.appTitle}>TodoX</Text>
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
          activeBackgroundColor={colors.primary + '20'}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="shape" color={color} size={size} />
          )}
          label="Categories"
          onPress={() => props.navigation.navigate('categories')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
          activeBackgroundColor={colors.primary + '20'}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
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
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="help-circle" color={color} size={size} />
          )}
          label="Help & Support"
          onPress={() => props.navigation.navigate('feedback')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
      </View>
      
      {/* Logout Section */}
      <View style={[styles.section, styles.logoutSection]}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="logout" color={colors.error} size={size} />
          )}
          label="Logout"
          onPress={() => logout()}
          style={styles.drawerItem}
          labelStyle={[styles.drawerLabel, { color: colors.error }]}
        />
      </View>
    </DrawerContentScrollView>
  );
};

/**
 * Main drawer navigation component with dark theme
 */
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: styles.drawer,
        headerStyle: styles.header,
        headerTintColor: colors.textPrimary,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: colors.textPrimary,
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
    backgroundColor: colors.background,
    width: 300,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  drawerContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    padding: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    marginLeft: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  drawerItem: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    backgroundColor: colors.surface,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  header: {
    backgroundColor: colors.background,
    elevation: 0,
    shadowOpacity: 0,
  },
  logoutSection: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});

export default DrawerNavigation;
