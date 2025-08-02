import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/Colors';

/**
 * Enhanced Error Boundary component with better error reporting
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null,
            retryCount: 0 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error for debugging (remove in production)
        if (__DEV__) {
            console.error('Error caught by boundary:', error, errorInfo);
        }
        
        this.setState({ errorInfo });
        
        // Here you could send error to crash reporting service
        // crashlytics().recordError(error);
    }

    /**
     * Handle retry action with exponential backoff
     */
    handleRetry = () => {
        const maxRetries = 3;
        if (this.state.retryCount < maxRetries) {
            this.setState({ 
                hasError: false, 
                error: null, 
                errorInfo: null,
                retryCount: this.state.retryCount + 1 
            });
        }
    };

    /**
     * Reset error state completely
     */
    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null,
            retryCount: 0 
        });
    };

    render() {
        if (this.state.hasError) {
            const canRetry = this.state.retryCount < 3;
            
            return (
                <View style={styles.container}>
                    <Ionicons name="warning-outline" size={64} color={colors.error} />
                    <Text style={styles.title}>Oops! Something went wrong</Text>
                    <Text style={styles.message}>
                        {this.state.retryCount > 0 
                            ? `Attempt ${this.state.retryCount + 1} failed. Please try again or restart the app.`
                            : 'An unexpected error occurred. Please try again.'
                        }
                    </Text>
                    
                    {__DEV__ && this.state.error && (
                        <Text style={styles.errorDetails}>
                            {this.state.error.toString()}
                        </Text>
                    )}
                    
                    <View style={styles.buttonContainer}>
                        {canRetry && (
                            <TouchableOpacity 
                                style={[styles.button, styles.retryButton]} 
                                onPress={this.handleRetry}
                            >
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.resetButton]} 
                            onPress={this.handleReset}
                        >
                            <Text style={styles.resetButtonText}>Reset App</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
        paddingHorizontal: spacing.md,
    },
    errorDetails: {
        fontSize: typography.fontSize.sm,
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.lg,
        fontFamily: 'monospace',
        backgroundColor: colors.surface,
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    button: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        minWidth: 100,
        alignItems: 'center',
    },
    retryButton: {
        backgroundColor: colors.primary,
    },
    resetButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
    },
    resetButtonText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
    },
});

export default ErrorBoundary;