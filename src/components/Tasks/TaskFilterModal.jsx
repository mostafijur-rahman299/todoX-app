import React, { useState } from 'react';
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
	TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/Colors';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Professional Task Filter Modal Component
 * Clean and minimal design for pro users
 */
const TaskFilterModal = ({ visible, onClose, onApplyFilters }) => {
	// State for filter options
	const [selectedView, setSelectedView] = useState('agenda');
	const [selectedSorting, setSelectedSorting] = useState('smart');
	const [selectedAssignee, setSelectedAssignee] = useState('default');
	const [selectedPriority, setSelectedPriority] = useState('all');
	const [selectedLabel, setSelectedLabel] = useState('any');

	/**
	 * Handle filter reset functionality
	 */
	const handleResetAll = () => {
		setSelectedView('agenda');
		setSelectedSorting('smart');
		setSelectedAssignee('default');
		setSelectedPriority('all');
		setSelectedLabel('any');
	};

	/**
	 * Handle save/apply filters
	 */
	const handleSave = () => {
		const filters = {
			view: selectedView,
			sorting: selectedSorting,
			assignee: selectedAssignee,
			priority: selectedPriority,
			label: selectedLabel,
		};
		onApplyFilters?.(filters);
		onClose();
	};

	/**
	 * Handle backdrop press to close modal
	 */
	const handleBackdropPress = () => {
		onClose();
	};

	/**
	 * Render clean view selection section
	 */
	const renderViewSection = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>View</Text>
			<View style={styles.viewContainer}>
				<TouchableOpacity
					style={[styles.viewOption, selectedView === 'agenda' && styles.viewOptionSelected]}
					onPress={() => setSelectedView('agenda')}
					activeOpacity={0.8}>
					<View style={styles.viewContent}>
						<Ionicons 
							name="list-outline" 
							size={20} 
							color={selectedView === 'agenda' ? colors.primary : colors.textSecondary} 
						/>
						<Text style={[
							styles.viewText,
							selectedView === 'agenda' && styles.viewTextSelected
						]}>
							Agenda
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.viewOption, selectedView === '3day' && styles.viewOptionSelected]}
					onPress={() => setSelectedView('3day')}
					activeOpacity={0.8}>
					<View style={styles.viewContent}>
						<Ionicons 
							name="calendar-outline" 
							size={20} 
							color={selectedView === '3day' ? colors.primary : colors.textSecondary} 
						/>
						<Text style={[
							styles.viewText,
							selectedView === '3day' && styles.viewTextSelected
						]}>
							Timeline
						</Text>
						<View style={styles.proBadge}>
							<Text style={styles.proText}>PRO</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);

	/**
	 * Render clean filter option
	 */
	const renderFilterOption = (icon, title, subtitle, onPress) => (
		<TouchableOpacity style={styles.filterOption} onPress={onPress} activeOpacity={0.8}>
			<View style={styles.filterContent}>
				<View style={styles.filterLeft}>
					<View style={styles.iconContainer}>
						{icon}
					</View>
					<View style={styles.textContainer}>
						<Text style={styles.filterTitle}>{title}</Text>
						<Text style={styles.filterSubtitle}>{subtitle}</Text>
					</View>
				</View>
				<Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
			</View>
		</TouchableOpacity>
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}>
			<TouchableWithoutFeedback onPress={handleBackdropPress}>
				<View style={styles.overlay}>
					<TouchableWithoutFeedback>
						<View style={styles.modal}>
							{/* Header */}
							<View style={styles.header}>
								<View style={styles.dragIndicator} />
								<View style={styles.headerContent}>
									<Text style={styles.headerTitle}>Filter & Sort</Text>
									<TouchableOpacity onPress={onClose} style={styles.closeButton}>
										<Ionicons name="close" size={20} color={colors.textSecondary} />
									</TouchableOpacity>
								</View>
							</View>

							{/* Content */}
							<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
								{/* View Section */}
								{renderViewSection()}

								{/* Sort Section */}
								<View style={styles.section}>
									<Text style={styles.sectionTitle}>Sort</Text>
									{renderFilterOption(
										<Ionicons name="swap-vertical" size={18} color={colors.textSecondary} />,
										'Sorting',
										'Smart (default)',
										() => {}
									)}
								</View>

								{/* Filter Section */}
								<View style={styles.section}>
									<Text style={styles.sectionTitle}>Filter</Text>
									
									{renderFilterOption(
										<Ionicons name="person-outline" size={18} color={colors.textSecondary} />,
										'Assignee',
										'Default',
										() => {}
									)}

									{renderFilterOption(
										<MaterialCommunityIcons name="flag-outline" size={18} color={colors.textSecondary} />,
										'Priority',
										'All',
										() => {}
									)}

									{renderFilterOption(
										<MaterialCommunityIcons name="tag-outline" size={18} color={colors.textSecondary} />,
										'Label',
										'Any',
										() => {}
									)}
								</View>
							</ScrollView>

							{/* Footer */}
							<View style={styles.footer}>
								<TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
									<Text style={styles.resetText}>Reset</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
									<Text style={styles.saveText}>Apply</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default TaskFilterModal;

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		justifyContent: 'flex-end',
	},
	modal: {
		height: screenHeight * 0.75,
		backgroundColor: colors.background,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
        marginBottom: 0
	},
	
	// Header Styles
	header: {
		paddingTop: 8,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	dragIndicator: {
		width: 32,
		height: 3,
		backgroundColor: colors.textTertiary,
		borderRadius: 2,
		alignSelf: 'center',
		marginBottom: 16,
		opacity: 0.5,
	},
	headerContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.textPrimary,
	},
	closeButton: {
		padding: 4,
	},
	
	// Content Styles
	content: {
		flex: 1,
	},
	section: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.textPrimary,
		marginBottom: 16,
	},
	
	// View Section Styles
	viewContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	viewOption: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.background,
	},
	viewOptionSelected: {
		borderColor: colors.primary,
		backgroundColor: colors.surface,
	},
	viewContent: {
		alignItems: 'center',
		position: 'relative',
	},
	viewText: {
		fontSize: 14,
		fontWeight: '500',
		color: colors.textSecondary,
		marginTop: 8,
	},
	viewTextSelected: {
		color: colors.primary,
	},
	proBadge: {
		position: 'absolute',
		top: -8,
		right: -8,
		backgroundColor: colors.primary,
		borderRadius: 8,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	proText: {
		fontSize: 10,
		fontWeight: '700',
		color: colors.white,
		letterSpacing: 0.5,
	},
	
	// Filter Option Styles
	filterOption: {
		paddingVertical: 12,
		marginBottom: 8,
	},
	filterContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	filterLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	iconContainer: {
		width: 32,
		height: 32,
		borderRadius: 6,
		backgroundColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	filterTitle: {
		fontSize: 15,
		fontWeight: '500',
		color: colors.textPrimary,
		marginBottom: 2,
	},
	filterSubtitle: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	
	// Footer Styles
	footer: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		gap: 12,
	},
	resetButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: 'center',
	},
	resetText: {
		fontSize: 15,
		fontWeight: '500',
		color: colors.textSecondary,
	},
	saveButton: {
		flex: 2,
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: colors.primary,
		alignItems: 'center',
	},
	saveText: {
		fontSize: 15,
		fontWeight: '600',
		color: colors.white,
	},
});