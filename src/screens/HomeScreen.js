import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    // This would normally fetch data from storage or API
    const demoTasks = [
      { id: 1, title: 'Complete project proposal', is_completed: false, category: 'Work' },
      { id: 2, title: 'Buy groceries', is_completed: false, category: 'Personal' },
      { id: 3, title: 'Schedule dentist appointment', is_completed: true, category: 'Health' },
      { id: 4, title: 'Prepare presentation slides', is_completed: false, category: 'Work' },
    ];
    
    setTasks(demoTasks);
    setCompletedTasks(demoTasks.filter(task => task.is_completed));
    setPendingTasks(demoTasks.filter(task => !task.is_completed));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#ffffff']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.headerTitle}>Task Manager</Text>
              <View style={styles.taskCounterContainer}>
                <View style={styles.taskCountBadge}>
                  <Ionicons name="rocket-outline" size={16} color="#6366f1" />
                  <Text style={styles.taskCounter}>
                    {pendingTasks.length} pending
                  </Text>
                </View>
                <View style={[styles.taskCountBadge, styles.completedBadge]}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#22c55e" />
                  <Text style={[styles.taskCounter, styles.completedCounter]}>
                    {completedTasks.length} done
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.addButton]}
              onPress={() => navigation.navigate('Tasks')}
            >
              <Ionicons name="list" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <LottieView
                source={require('../assets/animations/empty-tasks.json')}
                autoPlay
                loop
                style={styles.emptyStateAnimation}
              />
              <Text style={styles.emptyStateTitle}>No tasks yet</Text>
              <Text style={styles.emptyStateText}>
                Go to the Tasks screen to add your first task
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.taskList}>
              <Text style={styles.sectionTitle}>Recent Tasks</Text>
              {pendingTasks.map(task => (
                <TouchableOpacity 
                  key={task.id} 
                  style={styles.taskItem}
                  onPress={() => navigation.navigate('Tasks')}
                >
                  <View style={styles.taskContent}>
                    <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(task.category) }]} />
                    <Text style={styles.taskTitle}>{task.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Helper function to get color based on category
const getCategoryColor = (category) => {
  switch (category) {
    case 'Work': return '#6366f1';
    case 'Personal': return '#f59e0b';
    case 'Health': return '#10b981';
    default: return '#64748b';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradientContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  taskCounterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  taskCountBadge: {
    backgroundColor: '#6366f110',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedBadge: {
    backgroundColor: '#22c55e10',
  },
  taskCounter: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  completedCounter: {
    color: '#22c55e',
  },
  actionButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#6366f1',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyStateAnimation: {
    width: 200,
    height: 200,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  taskList: {
    flex: 1,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
});

export default HomeScreen;
