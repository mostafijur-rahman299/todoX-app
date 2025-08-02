import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory cache for frequently accessed data
const cache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Enhanced storage utility with caching and error recovery
 */
class StorageManager {
    /**
     * Store data in AsyncStorage with caching
     */
    static async storeData(key, value, useCache = true) {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            
            if (useCache) {
                cache.set(key, {
                    data: value,
                    timestamp: Date.now()
                });
            }
            
            return true;
        } catch (error) {
            if (__DEV__) {
                console.error(`Error storing data for key ${key}:`, error);
            }
            return false;
        }
    }

    /**
     * Get data from cache first, then AsyncStorage
     */
    static async getData(key, useCache = true) {
        try {
            // Check cache first
            if (useCache && cache.has(key)) {
                const cached = cache.get(key);
                if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
                    return cached.data;
                } else {
                    cache.delete(key); // Remove expired cache
                }
            }

            const jsonValue = await AsyncStorage.getItem(key);
            const data = jsonValue != null ? JSON.parse(jsonValue) : null;
            
            // Update cache
            if (useCache && data !== null) {
                cache.set(key, {
                    data,
                    timestamp: Date.now()
                });
            }
            
            return data;
        } catch (error) {
            if (__DEV__) {
                console.error(`Error reading data for key ${key}:`, error);
            }
            return null;
        }
    }

    /**
     * Remove data from both storage and cache
     */
    static async removeData(key) {
        try {
            await AsyncStorage.removeItem(key);
            cache.delete(key);
            return true;
        } catch (error) {
            if (__DEV__) {
                console.error(`Error removing data for key ${key}:`, error);
            }
            return false;
        }
    }

    /**
     * Clear all storage and cache
     */
    static async clearAll() {
        try {
            await AsyncStorage.clear();
            cache.clear();
            return true;
        } catch (error) {
            if (__DEV__) {
                console.error('Error clearing all storage:', error);
            }
            return false;
        }
    }

    /**
     * Get multiple keys at once for better performance
     */
    static async getMultiple(keys) {
        try {
            const results = await AsyncStorage.multiGet(keys);
            return results.reduce((acc, [key, value]) => {
                acc[key] = value ? JSON.parse(value) : null;
                return acc;
            }, {});
        } catch (error) {
            if (__DEV__) {
                console.error('Error getting multiple keys:', error);
            }
            return {};
        }
    }

    /**
     * Set multiple key-value pairs at once
     */
    static async setMultiple(keyValuePairs) {
        try {
            const pairs = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
            await AsyncStorage.multiSet(pairs);
            return true;
        } catch (error) {
            if (__DEV__) {
                console.error('Error setting multiple keys:', error);
            }
            return false;
        }
    }

    /**
     * Clear cache manually
     */
    static clearCache() {
        cache.clear();
    }
}

// Export both new and legacy functions for backward compatibility
export const storeDataLocalStorage = StorageManager.storeData;
export const getDataLocalStorage = StorageManager.getData;
export const removeDataLocalStorage = StorageManager.removeData;
export const clearAllLocalStorage = StorageManager.clearAll;

export default StorageManager;
