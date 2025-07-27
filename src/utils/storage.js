import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store data in AsyncStorage with proper error handling
 */
export const storeDataLocalStorage = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error(`Error storing data for key ${key}:`, error);
        return false;
    }
};

/**
 * Get data from AsyncStorage with proper error handling
 */
export const getDataLocalStorage = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(`Error reading data for key ${key}:`, error);
        return null;
    }
};

/**
 * Remove data from AsyncStorage
 */
export const removeDataLocalStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing data for key ${key}:`, error);
        return false;
    }
};

/**
 * Clear all AsyncStorage data
 */
export const clearAllLocalStorage = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing all storage:', error);
        return false;
    }
};
