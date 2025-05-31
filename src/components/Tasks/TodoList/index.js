import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { 
    View,
    // Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    Platform,
    RefreshControl,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Animated,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { colors } from '@/constants/Colors';
import CustomText from '@/components/UI/CustomText';
import { Ionicons } from '@expo/vector-icons';
import AddTodoModal from '../AddTodoModal';
import Filter from './Filter';
import { useDispatch, useSelector } from 'react-redux';
// Import specific actions
import { addTask, setTasks, toggleCompleteTask as toggleCompleteTaskAction } from '@/store/Task/task';
import UpdateTaskModal from '../UpdateTaskModal';
import { generateId } from '@/utils/gnFunc';
import { priorities, defaultCategories } from '@/constants/GeneralData';
import { storeData, getData } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const TodoList = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [quickAddText, setQuickAddText] = useState('');
    const [quickAddCategory, setQuickAddCategory] = useState("");
    const [quickAddPriority, setQuickAddPriority] = useState(priorities[0].name);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const displayTasks = useSelector((state) => state.task.display_tasks); // Renamed for clarity
    const masterTasks = useSelector((state) => state.task.task_list); // Get the master list

    // Effect to persist masterTasks to AsyncStorage whenever it changes
    useEffect(() => {
        // Prevent initial empty save if masterTasks isn't hydrated yet,
        // though loadTasks effect below should run first.
        // Consider if masterTasks starts empty and gets populated, this will save the empty then populated state.
        if (masterTasks && masterTasks.length > 0) { // Or some other condition to prevent saving initial empty state from Redux if not desired
            storeData('task_list', masterTasks);
        } else if (masterTasks && masterTasks.length === 0) { // Allow saving an empty list if all tasks are deleted
            storeData('task_list', []);
        }
    }, [masterTasks]);

    // Load tasks from storage on initial mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const storedTasks = await getData('task_list') || [];
                if (storedTasks) {
                    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
                        UIManager.setLayoutAnimationEnabledExperimental(true);
                    }
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    dispatch(setTasks(storedTasks));
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
                Alert.alert('Error', 'Failed to load tasks. Please try restarting the app.');
            }
        };
        loadTasks();
    }, [dispatch]);

    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;

        const newTask = {
            id: generateId(),
            title: quickAddText,
            timestamp: new Date().toISOString(),
            description: "",
            category: quickAddCategory || "other",
            priority: quickAddPriority,
            is_completed: false,
            completed_timestamp: null,
            sub_tasks: []
        };

        try {
            if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            dispatch(addTask(newTask));
            // storeData is now handled by useEffect listening to masterTasks
            setQuickAddText('');

            // Provide haptic feedback if available
            if (Platform.OS === 'ios' && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'hapticFeedback', style: 'light' }));
            }
        } catch (error) {
            console.error('Error saving task:', error);
            Alert.alert('Error', 'Failed to save the new task. Please try again.');
        }
    };

    const incompleteTasks = useMemo(() => {
        // Derived from displayTasks now, which is what this component is supposed to render
        return displayTasks
            ?.filter(task => !task.is_completed)
            .sort((a, b) => {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                }
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
    }, [tasks]);

    const completedTasks = useMemo(() => {
        // Derived from displayTasks
        return displayTasks
            ?.filter(task => task.is_completed)
            .sort((a, b) => new Date(b.completed_timestamp) - new Date(a.completed_timestamp));
    }, [displayTasks]);

    const handleClearCompleted = () => {
        try {
            // This action should ideally update masterTasks, and displayTasks would reflect that.
            // The current setTasks action updates both master and display lists.
            const tasksToKeep = masterTasks?.filter(task => !task.is_completed);
            dispatch(setTasks(tasksToKeep || []));
            // storeData is now handled by useEffect listening to masterTasks
        } catch (error) {
            console.error('Error clearing completed tasks:', error);
            Alert.alert('Error', 'Failed to clear completed tasks. Please try again.');
        }
    };

    const handleClearAlert = () => {
        Alert.alert('Clear All Tasks', 'Are you sure you want to clear all completed tasks?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', onPress: handleClearCompleted },
        ]);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    // Memoize the render item function to improve performance
    const renderItem = useCallback(({ item }) => {
        if (item.type === 'header') {
            return (
                <View style={styles.sectionHeader} key={item.id}>
                    <View style={styles.sectionHeaderLeft}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
                        <CustomText style={styles.sectionHeaderText}>{item.title}</CustomText>
                    </View>
                    {completedTasks.length > 0 && (
                        <TouchableOpacity style={styles.clearButton} onPress={handleClearAlert}>
                            <Ionicons name="trash-outline" size={16} color={colors.textMediumGray} />
                            <CustomText style={styles.clearButtonText}>Clear</CustomText>
                        </TouchableOpacity>
                    )}
                </View>
            );
        }
        return (
            <TodoItem
                key={item.id}
                item={item}
                setSelectedTask={setSelectedTask}
                setIsUpdateModalVisible={setIsUpdateModalVisible}
            />
        );
    }, [completedTasks.length]);

    // Memoize the keyExtractor function to improve performance
    const keyExtractor = useCallback((item) => item.id?.toString(), []);

    const handleOutsidePress = () => {
        if (isInputFocused) {
            Keyboard.dismiss();
            setIsInputFocused(false);
        }
        if (showCategoryTooltip) {
            setShowCategoryTooltip(false);
        }
    };

    // Prepare data for FlatList with getItemLayout for better performance
    const listData = useMemo(() => {
        const data = [...(incompleteTasks || [])];
        if (completedTasks && completedTasks.length > 0) {
            data.push({ id: 'completed_header', type: 'header', title: 'Completed Tasks' });
            data.push(...completedTasks.map(task => ({ ...task, id: `${task.id}` })));
        }
        return data;
    }, [incompleteTasks, completedTasks]);

    // Optimize FlatList with getItemLayout
    const getItemLayout = useCallback((data, index) => ({
        length: 80, // Approximate height of each item
        offset: 80 * index,
        index,
    }), []);

    return (
        <>
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.mainContainer}>
                    <LinearGradient
                        colors={[colors.backgroundUltraLight, colors.white]}
                        style={styles.gradientContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.contentContainer}>
                            <View style={styles.headerContainer}>
                                <View>
                                    <CustomText style={styles.headerTitle}>Task Manager</CustomText>
                                    <View style={styles.taskCounterContainer}>
                                        <View style={styles.taskCountBadge}>
                                            <Ionicons name="rocket-outline" size={16} color={colors.accentBlue} />
                                            <CustomText style={styles.taskCounter}>
                                                {incompleteTasks.length} pending
                                            </CustomText>
                                        </View>
                                        <View style={[styles.taskCountBadge, styles.completedBadge]}>
                                            <Ionicons name="checkmark-circle-outline" size={16} color={colors.accentGreen} />
                                            <CustomText style={[styles.taskCounter, styles.completedCounter]}>
                                                {completedTasks.length} done
                                            </CustomText>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.headerActions}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.activeActionButton]}
                                        onPress={() => setShowFilterModal(true)}
                                    >
                                        <Ionicons
                                            name='options'
                                            size={24}
                                            color={colors.white}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.addButton]}
                                        onPress={() => setIsModalVisible(true)}
                                    >
                                        <Ionicons name="add" size={24} color={colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.listContainer}>
                                {displayTasks.length === 0 ? ( // Check displayTasks for empty state
                                    <View style={styles.emptyState}>
                                        <LottieView
                                            source={require('@/assets/animations/empty-tasks.json')}
                                            autoPlay
                                            loop
                                            style={styles.emptyStateAnimation}
                                        />
                                        <CustomText style={styles.emptyStateTitle}>No tasks yet</CustomText>
                                        <CustomText style={styles.emptyStateText}>
                                            Add your first task using the quick add bar below or the + button
                                        </CustomText>
                                    </View>
                                ) : (
                                    <FlatList
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                                tintColor={colors.accentBlue}
                                                colors={[colors.accentBlue]}
                                                progressViewOffset={20}
                                            />
                                        }
                                        data={listData}
                                        renderItem={renderItem}
                                        keyExtractor={keyExtractor}
                                        contentContainerStyle={styles.listContent}
                                        showsVerticalScrollIndicator={false}
                                        getItemLayout={getItemLayout}
                                        removeClippedSubviews={Platform.OS === 'android'}
                                        initialNumToRender={10}
                                        maxToRenderPerBatch={5}
                                        windowSize={3}
                                        keyboardDismissMode="on-drag"
                                        keyboardShouldPersistTaps="handled"
                                    />
                                )}
                            </View>
                        </View>

                        <View style={styles.quickAddContainer}>
                            <View style={styles.quickAddGradient}>
                                <View style={styles.quickAddInputContainer}>
                                    <View style={[
                                        styles.quickAddInputWrapper,
                                        isInputFocused && styles.quickAddInputWrapperFocused
                                    ]}>
                                        <Ionicons name="add-circle-outline" size={18} color={colors.accentBlue} style={styles.quickAddIcon} />
                                        <TextInput
                                            style={styles.quickAddInput}
                                            placeholder="Add a new task..."
                                            placeholderTextColor={colors.textPlaceholder}
                                            value={quickAddText}
                                            onChangeText={setQuickAddText}
                                            onSubmitEditing={handleQuickAdd}
                                            onFocus={() => {
                                                setIsInputFocused(true);
                                            }}
                                            onBlur={() => {
                                                setIsInputFocused(false);
                                            }}
                                            returnKeyType="done"
                                            multiline
                                            numberOfLines={2}
                                        />
                                    </View>

                                    <View style={styles.quickAddActions}>
                                        <View style={styles.actionButtonsContainer}>
                                            {/* <TouchableOpacity
                                                style={[
                                                    styles.quickAddOption,
                                                    showCategoryTooltip && styles.quickAddOptionActive
                                                ]}
                                                onPress={() => setShowCategoryTooltip(!showCategoryTooltip)}
                                            >
                                                <Ionicons name="bookmark" size={14} color="#6366f1" />
                                            </TouchableOpacity> */}

                                            <TouchableOpacity
                                                style={[
                                                    styles.quickAddOption,
                                                    {
                                                        backgroundColor: quickAddPriority === "high" ? colors.priorityHighBackground :
                                                            quickAddPriority === "medium" ? colors.priorityMediumBackground : colors.priorityLowBackground
                                                    }
                                                ]}
                                                onPress={() => {
                                                    const nextIndex = priorities.findIndex(p => p.name === quickAddPriority);
                                                    setQuickAddPriority(priorities[(nextIndex + 1) % priorities.length].name);
                                                }}
                                            >
                                                <Ionicons
                                                    name="flag"
                                                    size={14}
                                                    color={
                                                        quickAddPriority === "high" ? colors.priorityHigh :
                                                            quickAddPriority === "medium" ? colors.priorityMedium : colors.priorityLow
                                                    }
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.quickAddButton,
                                                    !!quickAddText && styles.activeQuickAddButton
                                                ]}
                                                onPress={handleQuickAdd}
                                                disabled={!quickAddText}
                                            >
                                                <Ionicons
                                                    name="arrow-up"
                                                    size={18}
                                                    color={!!quickAddText ? colors.white : colors.textPlaceholder}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        {showCategoryTooltip && (
                                                <ScrollView
                                                    style={[styles.categoryTooltip, { bottom: 48 }]}
                                                    contentContainerStyle={styles.categoryScrollContent} // Use contentContainerStyle
                                                    showsVerticalScrollIndicator={false}
                                                    bounces={false}
                                                >
                                                    {/* Removed View with inline padding: 8 here */}
                                                    {defaultCategories.map((category) => (
                                                        <TouchableOpacity
                                                            key={category.name}
                                                            style={[
                                                                styles.categoryTooltipItem,
                                                                category.name === quickAddCategory && styles.categoryTooltipItemActive
                                                            ]}
                                                            onPress={() => {
                                                                setQuickAddCategory(category.name);
                                                                setShowCategoryTooltip(false);
                                                            }}
                                                        >
                                                            <Ionicons
                                                                name="bookmark"
                                                                size={14}
                                                                color={category.name === quickAddCategory ? colors.accentBlue : colors.textLightGray}
                                                            />
                                                            <CustomText style={[
                                                                styles.categoryTooltipText,
                                                                category.name === quickAddCategory && styles.categoryTooltipTextActive
                                                            ]}>
                                                                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                                            </CustomText>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <AddTodoModal
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                        />

                        <UpdateTaskModal
                            isModalVisible={isUpdateModalVisible}
                            setIsModalVisible={setIsUpdateModalVisible}
                            selectedTask={selectedTask}
                            tasks={tasks}
                        />
                    </LinearGradient>
                </View>
            </TouchableWithoutFeedback>


            <Filter
                openModal={showFilterModal}
                closeModal={() => setShowFilterModal(false)}
            />

        </>
    );
};

export default memo(TodoList);

const TodoItem = memo(({ item, setSelectedTask, setIsUpdateModalVisible }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    // TodoItem should use masterTasks for consistency if it's going to calculate updates for dispatching setTasks
    // However, it receives 'item' which comes from 'displayTasks' via listData.
    // For 'toggleComplete', if it dispatches an ID-based action, Redux handles updating the master list.
    // If it calculates new state locally and dispatches setTasks, it needs the correct base list.
    const allTasksFromStore = useSelector(state => state.task.task_list); // Used for sub-task updates for now.
    const [animationValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: item.is_completed ? 1 : 0,
            duration: 300,
            useNativeDriver: false, // backgroundColor is not supported by native driver
        }).start();
    }, [item.is_completed, animationValue]);

    const toggleExpand = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const toggleComplete = useCallback((item, isSubTask = false, subItem = null) => {
        // Configure LayoutAnimation for the list update
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const updatedTasks = tasks?.map(task => {
            if (task.id === item.id) {
                if (isSubTask) {
                    return {
                        ...task,
                        sub_tasks: task.sub_tasks.map(subTask => 
                            subTask.id === subItem.id
                                ? {
                                    ...subTask,
                                    is_completed: !subTask.is_completed,
                                    completed_timestamp: new Date().toISOString()
                                }
                                : subTask
                        )
                    };
                } else {
                    return {
                        ...task,
                        is_completed: !task.is_completed,
                        completed_timestamp: new Date().toISOString()
                    };
                }
            }
            return task;
        });

        // console.log('updatedTasks', updatedTasks); // Removed for cleanliness
        try {
            if (isSubTask) {
                // For sub-tasks, the logic needs to use the master list (allTasksFromStore) to correctly build the updated state.
                const parentTask = allTasksFromStore.find(t => t.id === item.id);
                if (!parentTask) return;

                const updatedSubTasks = parentTask.sub_tasks.map(st =>
                    st.id === subItem.id
                    ? { ...st, is_completed: !st.is_completed, completed_timestamp: !st.is_completed ? new Date().toISOString() : null }
                    : st
                );
                const taskWithUpdatedSubtasks = { ...parentTask, sub_tasks: updatedSubTasks };
                const finalUpdatedTasks = allTasksFromStore.map(t => t.id === item.id ? taskWithUpdatedSubtasks : t);

                dispatch(setTasks(finalUpdatedTasks));
                // storeData will be handled by the useEffect in TodoList listening to masterTasks changes.
            } else {
                // For parent tasks, dispatch the specific action
                dispatch(toggleCompleteTaskAction(item.id));
                // storeData will be handled by the useEffect in TodoList.
            }
        } catch (error) {
            console.error('Error updating task completion status:', error);
            Alert.alert('Error', 'Failed to update task status. Please try again.');
        }
    }, [allTasksFromStore, dispatch, item.id, subItem?.id]); // Added item.id and subItem?.id to dependencies

    const truncateText = (text, maxLength = 40) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleTaskPress = () => {
        setSelectedTask(item);
        setIsUpdateModalVisible(true);
    };

    const handleTaskPress = useCallback(() => {
        setSelectedTask(item);
        setIsUpdateModalVisible(true);
    }, [item, setSelectedTask, setIsUpdateModalVisible]);

    const animatedBackgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.white, colors.backgroundUltraLight], // Use centralized colors
    });

    return (
        <Animated.View style={{ backgroundColor: animatedBackgroundColor }}>
            <TouchableOpacity
                style={[styles.taskItem /* removed item.is_completed && styles.completedTask here */]}
                onPress={handleTaskPress}
                activeOpacity={0.7}
            >
                <View style={[styles.priorityIndicator, {
                    backgroundColor: item.priority === "high" ? colors.priorityHigh :
                        item.priority === "medium" ? colors.priorityMedium : colors.priorityLow
                }]} />

                <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                        <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleComplete(item, false, null)}
                    >
                        <View
                            style={[
                                styles.checkboxInner,
                                item.is_completed && styles.checkedBox
                            ]}
                        >
                            {item.is_completed && (
                                <Ionicons name="checkmark" size={12} color={colors.white} />
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.taskTitleContainer}>
                        <CustomText style={[styles.taskTitle, item.is_completed && styles.completedText]}>
                            {truncateText(item.title)}
                        </CustomText>
                        {item.category !== 'other' && (
                            <View style={styles.taskTags}>
                                <View style={styles.categoryTag}>
                                    <Ionicons name="bookmark-outline" size={9} color={colors.textLightGray} />
                                    <CustomText style={styles.categoryTagText}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</CustomText>
                                </View>
                            </View>
                        )}
                    </View>

                    {item?.sub_tasks?.length > 0 && (
                        <TouchableOpacity
                            style={styles.expandButton}
                            onPress={toggleExpand}
                        >
                            <View style={styles.subTaskCountContainer}>
                                <CustomText style={styles.subTaskCount}>
                                    {item.sub_tasks.filter(t => t.is_completed).length}/{item.sub_tasks.length}
                                </CustomText>
                            </View>
                            <Ionicons
                                name={isExpanded ? "chevron-up" : "chevron-down"}
                                size={14}
                                color={colors.textLightGray}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {isExpanded && (
                    <View style={styles.subTasksContainer}>
                        {item.sub_tasks?.map(subTask => (
                            <View key={subTask.id} style={styles.subTaskItem}>
                                <TouchableOpacity
                                    style={styles.subTaskCheckbox}
                                    onPress={() => toggleComplete(item, true, subTask)}
                                >
                                    <View style={[styles.checkboxInner, subTask.is_completed && styles.checkedBox]}>
                                        {subTask.is_completed && (
                                            <Ionicons name="checkmark" size={10} color={colors.white} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <CustomText style={[styles.subTaskText, subTask.is_completed && styles.completedText]}>
                                    {subTask.title}
                                </CustomText>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    gradientContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16, // Added margin for separation
    },
    headerTitle: {
        fontSize: 22,
        fontSize: 22, // Kept as CustomText default is 16
        fontWeight: '800', // React Native will use a bold variant if available, CustomText handles 'bold'
        color: colors.textDarkBlue,
        letterSpacing: -0.5,
    },
    taskCounterContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    taskCountBadge: {
        backgroundColor: `${colors.accentBlue}1A`, // Using 1A for approx 10% opacity
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    completedBadge: {
        backgroundColor: `${colors.accentGreen}1A`, // Using 1A for approx 10% opacity
    },
    taskCounter: { // Uses CustomText, specific color and weight
        fontSize: 14,
        color: colors.accentBlue,
        fontWeight: '600',
    },
    completedCounter: { // Uses CustomText, specific color
        color: colors.accentGreen,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionButton: {
        backgroundColor: colors.backgroundLight,
        padding: 12,
        borderRadius: 12,
    },
    addButton: {
        backgroundColor: colors.accentBlue,
    },
    activeActionButton: {
        backgroundColor: colors.accentBlue,
    },
    filterContainer: { // Assuming this filter component exists elsewhere
        marginTop: 16,
        marginBottom: 8,
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderColorUltraLight,
    },
    listContainer: {
        flex: 1,
        marginTop: 16, // Increased margin for better separation
    },
    quickAddContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'visible',
        backgroundColor: colors.transparentWhite,
    },
    quickAddGradient: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    quickAddInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    quickAddInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.borderColorLight,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    quickAddInputWrapperFocused: {
        borderColor: colors.accentBlue,
        shadowColor: colors.accentBlue,
        shadowOpacity: 0.1,
    },
    quickAddIcon: {
        marginRight: 4, // Adjusted for tighter spacing
    },
    quickAddInput: { // This is a TextInput, not a Text component, so no CustomText here.
        flex: 1,
        fontSize: 15,
        color: colors.textDarkBlue,
        fontWeight: '500',
        height: '100%',
        paddingVertical: 12,
        // fontFamily: 'System', // Example if you want to ensure system font for inputs
    },
    quickAddActions: {
        position: 'relative',
        zIndex: 999,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        zIndex: 998,
    },
    quickAddOption: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderColorLight,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quickAddOptionActive: {
        backgroundColor: colors.accentLightBlue,
        borderColor: colors.accentBlue,
    },
    categoryTooltip: {
        position: 'absolute',
        right: 82,
        backgroundColor: colors.white,
        borderRadius: 12,
        width: 160,
        height: 300,
        borderWidth: 1,
        borderColor: colors.borderColorLight,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 99999,
    },
    // categoryScrollView style was here, removed as it was unused.
    // categoryTooltip directly styles the ScrollView component.
    categoryScrollContent: { // Used for ScrollView's contentContainerStyle
        padding: 8,
    },
    categoryTooltipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 8,
        borderRadius: 8,
    },
    categoryTooltipItemActive: {
        backgroundColor: colors.accentLightBlue,
    },
    categoryTooltipText: { // Uses CustomText, specific color and weight
        fontSize: 13,
        color: colors.textLightGray,
        fontWeight: '500',
    },
    categoryTooltipTextActive: { // Uses CustomText, specific color and weight
        color: colors.accentBlue,
        fontWeight: '600',
    },
    quickAddButton: {
        backgroundColor: colors.backgroundLight,
        borderRadius: 10,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderColorLight,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    activeQuickAddButton: {
        backgroundColor: colors.accentBlue,
        borderColor: colors.accentBlue,
    },
    taskItem: {
        // backgroundColor is now handled by Animated.View
        borderRadius: 16,
        marginBottom: 12,
        padding: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.borderColorUltraLight,
    },
    completedTask: { // This style might still be used for other things if needed, or removed if only bg color changed
        backgroundColor: colors.backgroundUltraLight, // Kept for reference, but animated view controls actual BG
    },
    priorityIndicator: {
        width: 3,
        borderRadius: 2,
        marginRight: 8,
    },
    taskContent: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxInner: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.borderColorLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBox: {
        backgroundColor: colors.accentBlue,
        borderColor: colors.accentBlue,
    },
    taskTitleContainer: {
        flex: 1,
    },
    taskTitle: { // Uses CustomText, specific color and weight
        fontSize: 14,
        fontWeight: '600', // CustomText can take fontWeight='bold' or use inline style for '600'
        color: colors.textDarkBlue,
        marginBottom: 6, // Increased margin for breathing room
    },
    taskTags: {
        flexDirection: 'row',
        gap: 6,
    },
    categoryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: colors.backgroundLight,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
    },
    categoryTagText: { // Uses CustomText, specific color, size and weight
        fontSize: 10,
        color: colors.textLightGray,
        fontWeight: '500',
    },
    subTasksContainer: {
        marginTop: 8, // Increased margin
        marginLeft: 24, // Adjusted to be a multiple of 8 (or 4)
    },
    subTaskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    subTaskCheckbox: {
        marginRight: 6,
    },
    subTaskText: { // Uses CustomText, specific color and size
        fontSize: 12,
        color: colors.textMediumGray,
        flex: 1,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingLeft: 6,
    },
    subTaskCountContainer: {
        backgroundColor: colors.backgroundLight,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 8,
    },
    subTaskCount: { // Uses CustomText, specific color, size and weight
        fontSize: 10,
        color: colors.textMediumGray,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderColor: colors.borderColorUltraLight,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionHeaderText: { // Uses CustomText, specific color, size and weight
        fontSize: 18,
        fontWeight: '700', // CustomText can take fontWeight='bold'
        color: colors.textMediumGray,
    },
    clearButton: {
        backgroundColor: colors.backgroundLight,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    clearButtonText: { // Uses CustomText, specific color, size and weight
        color: colors.textMediumGray,
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateAnimation: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    emptyStateTitle: { // Uses CustomText, specific color, size and weight
        fontSize: 24,
        fontWeight: '700', // CustomText can take fontWeight='bold'
        color: colors.textDarkBlue,
        marginBottom: 8,
    },
    emptyStateText: { // Uses CustomText, specific color, size and text align
        fontSize: 16, // Matches CustomText default size
        color: colors.textLightGray,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 40,
    },
    completedText: { // This is a style modifier, not a full text component style
        textDecorationLine: 'line-through',
        color: colors.textCompleted,
    },
    listContent: {
        paddingBottom: Platform.OS === 'ios' ? 90 : 80,
    },
});
