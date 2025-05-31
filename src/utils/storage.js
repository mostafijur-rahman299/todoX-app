import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error("Error storing data with key '"+ key +"':", e);
      throw e; // Re-throw the error so caller can handle if needed
    }
};

export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Error getting data with key '"+ key +"':", e);
      throw e; // Re-throw the error so caller can handle if needed
    }
};
