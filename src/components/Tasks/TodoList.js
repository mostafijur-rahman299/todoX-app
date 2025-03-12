import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, TextInput } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from './AddTodoModal';

const TodoList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState(TodoData);
  const [quickAddText, setQuickAddText] = useState('');

  const handleQuickAdd = () => {
    if (!quickAddText.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: quickAddText,
      timestamp: new Date(),
      description: '',
      category: 'other',
      priority: 'medium',
      is_completed: false
    };

    setTasks([...tasks, newTask]);
    setQuickAddText('');
  };

  // Sort tasks by completion status and date
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }
    // Then sort by priority (high -> medium -> low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Finally sort by date (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {tasks.filter(t => !t.is_completed).length} remaining{tasks.length > 0 && ` of ${tasks.length}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={18} color="white" />
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <FlatList
        data={sortedTasks}
        renderItem={({ item }) => <TodoItem item={item} />}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>
          Hi there! You don't have any tasks yet. Start task and take control of your day.
        </Text>}
      />
      
      {/* Quick Add Input */}
      <View style={styles.quickAddWrapper}>
        <View style={styles.quickAddContainer}>
          <TextInput
            style={styles.quickAddInput}
            value={quickAddText}
            onChangeText={setQuickAddText}
            placeholder="Quick add task..."
            placeholderTextColor={colors.darkGray}
            onSubmitEditing={handleQuickAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[
              styles.quickAddButton,
              quickAddText.trim() && styles.activeQuickAddButton
            ]}
            onPress={handleQuickAdd}
            disabled={!quickAddText.trim()}
          >
            <Ionicons 
              name="add" 
              size={20} 
              color={quickAddText.trim() ? 'white' : colors.darkGray} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Task Modal */}
      <AddTodoModal 
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        tasks={tasks}
        setTasks={setTasks}
      />
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
  },
  quickAddWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  quickAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  quickAddInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
  },
  quickAddButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  activeQuickAddButton: {
    backgroundColor: colors.primary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 100,
  },
  item: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemBody: {
    marginTop: 12,
    overflow: 'hidden'
  },
  subItem: {
    marginLeft: 36,
    marginTop: 10,
    padding: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  subItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  subTaskCount: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: '600',
  },
  addSubTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  addSubTaskText: {
    color: colors.primary,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 6,
    marginLeft: 36,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.darkGray,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 100,
  },
});

const TodoItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(item.is_completed);
  const [subTasksCompleted, setSubTasksCompleted] = useState(
    item.sub_tasks?.map(task => task.is_completed) || []
  );
  const animatedHeight = new Animated.Value(isExpanded ? 1 : 0);
  const subTaskCount = item.sub_tasks?.length || 0;

  const toggleExpand = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
    Animated.spring(animatedHeight, {
      toValue: newValue ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const toggleComplete = () => {
    setIsCompleted(!isCompleted);
  };

  const toggleSubTaskComplete = (index) => {
    const newSubTasksCompleted = [...subTasksCompleted];
    newSubTasksCompleted[index] = !newSubTasksCompleted[index];
    setSubTasksCompleted(newSubTasksCompleted);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  const truncateText = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <View style={[
      styles.item, 
      isCompleted && { opacity: 0.7, backgroundColor: '#fafafa' }
    ]}>
      <TouchableOpacity onPress={toggleExpand}>
        <View style={styles.itemHeader}>
          <View style={styles.itemHeaderLeft}>
            <TouchableOpacity onPress={toggleComplete}>
              <Ionicons
                name={isCompleted ? "checkmark-circle" : "radio-button-off"}
                size={24}
                color={
                  isCompleted ? colors.primary :
                  item.priority === "high" ? colors.red :
                  item.priority === "medium" ? colors.orange :
                  colors.green
                }
              />
            </TouchableOpacity>
            <Text 
              numberOfLines={1} 
              style={[styles.itemTitle, isCompleted && styles.completedText]}
            >
              {truncateText(item.title)}
            </Text>
            {subTaskCount > 0 && (
              <Text style={styles.subTaskCount}>
                {subTasksCompleted.filter(Boolean).length}/{subTaskCount}
              </Text>
            )}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.darkGray}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>

      <Animated.View 
        style={[
          styles.itemBody,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000]
            }),
            opacity: animatedHeight
          }
        ]}
      >
        {item.sub_tasks && item.sub_tasks.map((subTask, index) => (
          <View key={subTask.id} style={styles.subItem}>
            <View style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <TouchableOpacity onPress={() => toggleSubTaskComplete(index)}>
                  <Ionicons
                    name={subTasksCompleted[index] ? "checkmark-circle" : "radio-button-off"}
                    size={20}
                    color={
                      subTasksCompleted[index] ? colors.primary :
                      subTask.priority === "high" ? colors.red :
                      subTask.priority === "medium" ? colors.orange :
                      colors.green
                    }
                  />
                </TouchableOpacity>
                <Text 
                  numberOfLines={1} 
                  style={[
                    styles.subItemText,
                    subTasksCompleted[index] && styles.completedText
                  ]}
                >
                  {truncateText(subTask.title)}
                </Text>
              </View>
            </View>
            <Text style={styles.dateText}>{formatDate(subTask.timestamp)}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addSubTaskButton}>
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.addSubTaskText}>Add Subtask</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};


const TodoData = [
  {
    id: 1,
    title: "Buy groceries for the week and some fruits and vegetables",
    timestamp: "2025-03-11 10:00:00",
    description: "Buy groceries for the week and some fruits and vegetables",
    category: "shopping",
    priority: "high",
    is_completed: false,
    sub_tasks: [
      {
        id: 1,
        title: "Buy bread",
        is_completed: false,
        description: "Buy bread for the week",
        category: "shopping",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
      },
      {
        id: 2,
        title: "Buy milk",
        is_completed: false,
        description: "Buy milk for the week",
        category: "shopping",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
      },
      {
        id: 3,
        title: "Buy eggs",
        is_completed: false,
        description: "Buy eggs for the week",
        category: "shopping",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
      }
    ]
  },
  {
    id: 2,
    title: "Have a meeting with the team",
    timestamp: "2025-03-11 10:00:00",
    description: "Have a meeting with the team",
    category: "work",
    priority: "medium",
    is_completed: false,
    sub_tasks: [
      {
        id: 1,
        title: "Have a meeting with the team",
        is_completed: false,
        description: "Have a meeting with the team",
        category: "work",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
      },
      {
        id: 2,
        title: "Have a meeting with the team",
        is_completed: false,
        description: "Have a meeting with the team",
        category: "work",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
      }
    ]
  },
  {
    id: 3,
    title: "Meet with the client",
    timestamp: "2025-03-11 10:00:00",
    description: "Meet with the client",
    category: "work",
    priority: "high",
    is_completed: false,
    sub_tasks: [
      {
        id: 1,
        title: "Meet with the client",
        is_completed: false,
        description: "Meet with the client",
        category: "work",
        priority: "high",
        is_deleted: false,
        timestamp: "2025-03-11 10:00:00",
        is_completed: false,
      }
    ]
  },
  {
    id: 4,
    title: "Spend time with family",
    timestamp: "2025-03-11 10:00:00",
    description: "Spend time with family",
    category: "family",
    priority: "medium",
    is_completed: false,
    sub_tasks: [
      {
        id: 1,
        title: "Take a walk with the family",
        is_completed: true,
        description: "Take a walk with the family",
        category: "family",
        priority: "medium",
        timestamp: "2025-03-11 10:00:00",
      },
      {
        id: 2,
        title: "Play board games with the family",
        is_completed: false,
        description: "Play board games with the family",
        category: "family",
        priority: "low",
        timestamp: "2025-03-11 10:00:00",
      }
    ]
  },
  {
    id: 5,
    title: "Go to the gym",
    timestamp: "2025-03-11 10:00:00",
    description: "Go to the gym",
    category: "fitness",
    priority: "low",
    is_completed: false
  },
  {
    id: 6,
    title: "Go with the family to the park",
    timestamp: "2025-03-11 10:00:00",
    description: "Go with the family to the park",
    category: "family",
    priority: "low",
    is_completed: true,
  },
  {
    id: 7,
    title: "Have a meeting with the team",
    timestamp: "2025-03-11 10:00:00",
    description: "Have a meeting with the team",
    category: "work",
    priority: "high",
    is_completed: false,
    sub_tasks: [
      {
        id: 1,
        title: "Have a meeting with the team",
        description: "Have a meeting with the team",
        category: "work",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
        is_completed: true,
      },
      {
        id: 2,
        title: "Have a meeting with the team",
        description: "Have a meeting with the team",
        category: "work",
        priority: "high",
        timestamp: "2025-03-11 10:00:00",
        is_completed: false,
      }
    ]
  }
]
