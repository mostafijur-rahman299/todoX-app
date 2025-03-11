import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, TextInput, Modal, ScrollView } from 'react-native';
import { colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const TodoList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium', 
    category: '',
    timestamp: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]); // Add tasks state

  const priorities = ['low', 'medium', 'high'];
  const categories = ['work', 'personal', 'shopping', 'health', 'other'];

  const handleAddTask = () => {
    if (!newTask.title) return; // Validate required fields
    
    setTasks([...tasks, {...newTask, id: Date.now()}]); // Add new task with unique ID
    setIsModalVisible(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      timestamp: new Date(),
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
      </View>
      {item.description && (
        <View style={styles.itemBody}>
          <Text>{item.description}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add-circle" size={24} color={colors.primary} />
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>

      <FlatList 
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add New Task</Text>
              
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={newTask.title}
                onChangeText={(text) => setNewTask({...newTask, title: text})}
                placeholder="Enter task title"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newTask.description}
                onChangeText={(text) => setNewTask({...newTask, description: text})}
                placeholder="Enter task description"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newTask.priority === priority && styles.selectedPriority,
                      { backgroundColor: priority === 'high' ? colors.red : priority === 'medium' ? colors.orange : colors.green }
                    ]}
                    onPress={() => setNewTask({...newTask, priority})}
                  >
                    <Text style={styles.priorityText}>{priority}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      newTask.category === category && styles.selectedCategory
                    ]}
                    onPress={() => setNewTask({...newTask, category})}
                  >
                    <Text style={[
                      styles.categoryText,
                      newTask.category === category && styles.selectedCategoryText
                    ]}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={24} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {newTask.timestamp.toLocaleString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={newTask.timestamp}
                  mode="datetime"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setNewTask({...newTask, timestamp: date});
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addTaskButton]}
                  onPress={handleAddTask}
                >
                  <Text style={styles.buttonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.background,
  },
  item: {
    padding: 15,
    backgroundColor: "#F4F4F4", 
    margin: 10,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 10,
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
    marginTop: 10,
    overflow: 'hidden'
  },
  subItem: {
    marginLeft: 34,
    marginTop: 10,
    padding: 15,
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  subItemText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  subTaskCount: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 5,
  },
  addSubTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 34,
    marginTop: 10,
    padding: 10,
  },
  addSubTaskText: {
    color: colors.primary,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 5,
    marginLeft: 34,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.darkGray,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.primary,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedPriority: {
    opacity: 1,
  },
  priorityText: {
    color: 'white',
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.primary,
  },
  selectedCategoryText: {
    color: 'white',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateButtonText: {
    marginLeft: 10,
    color: colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.darkGray,
  },
  addTaskButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
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
      Animated.timing(animatedHeight, {
        toValue: newValue ? 1 : 0,
        duration: 300,
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

    const truncateText = (text, maxLength = 30) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    return (
        <View style={styles.item}>
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
                        <Text numberOfLines={1} style={[styles.itemTitle, isCompleted && styles.completedText]}>
                            {truncateText(item.title)}
                        </Text>
                        {subTaskCount > 0 && (
                            <Text style={styles.subTaskCount}>({subTaskCount} subtasks)</Text>
                        )}
                    </View>
                    <Ionicons 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color={colors.darkGray} 
                    />
                </View>
            </TouchableOpacity>
            
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>

            <Animated.View style={[
              styles.itemBody,
              {
                maxHeight: animatedHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000]
                }),
                opacity: animatedHeight
              }
            ]}>
                {item.sub_tasks && item.sub_tasks.map((subTask, index) => (
                    <View key={subTask.id} style={styles.subItem}>
                        <View style={styles.itemHeader}>
                            <View style={styles.itemHeaderLeft}>
                                <TouchableOpacity onPress={() => toggleSubTaskComplete(index)}>
                                    <Ionicons 
                                        name={subTasksCompleted[index] ? "checkmark-circle" : "radio-button-off"} 
                                        size={24} 
                                        color={
                                            subTasksCompleted[index] ? colors.primary :
                                            subTask.priority === "high" ? colors.red : 
                                            subTask.priority === "medium" ? colors.orange : 
                                            colors.green
                                        } 
                                    />
                                </TouchableOpacity>
                                <Text numberOfLines={1} style={[
                                    styles.subItemText, 
                                    subTasksCompleted[index] && styles.completedText
                                ]}>
                                    {truncateText(subTask.title)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.dateText}>{formatDate(subTask.timestamp)}</Text>
                    </View>
                ))}
                <TouchableOpacity style={styles.addSubTaskButton}>
                    <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
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
