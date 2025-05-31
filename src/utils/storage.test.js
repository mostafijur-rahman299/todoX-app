import { storeData, getData } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  // removeItem: jest.fn(), // Not used in storage.js but good for a full mock
  // clear: jest.fn(),      // Not used in storage.js
}));

describe('AsyncStorage Utility Functions', () => {
  const testKey = 'testKey';
  const testData = { id: 1, name: 'Test Data' };
  const stringifiedTestData = JSON.stringify(testData);

  beforeEach(() => {
    // Clear all mock function calls before each test
    AsyncStorage.setItem.mockClear();
    AsyncStorage.getItem.mockClear();
  });

  describe('storeData', () => {
    it('should call AsyncStorage.setItem with the correct key and stringified value', async () => {
      await storeData(testKey, testData);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(testKey, stringifiedTestData);
    });

    it('should log an error and re-throw if AsyncStorage.setItem fails', async () => {
      const errorMessage = 'Failed to save data';
      AsyncStorage.setItem.mockRejectedValueOnce(new Error(errorMessage));
      console.error = jest.fn(); // Mock console.error

      await expect(storeData(testKey, testData)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalledWith("Error storing data with key '"+ testKey +"':", expect.any(Error));

      console.error.mockRestore(); // Restore original console.error
    });
  });

  describe('getData', () => {
    it('should call AsyncStorage.getItem with the correct key', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(stringifiedTestData); // Ensure it resolves to avoid error logs from this call
      await getData(testKey);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(testKey);
    });

    it('should return parsed data when AsyncStorage.getItem resolves with a valid JSON string', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(stringifiedTestData);
      const result = await getData(testKey);
      expect(result).toEqual(testData);
    });

    it('should return null if the key does not exist (AsyncStorage.getItem returns null)', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const result = await getData(testKey);
      expect(result).toBeNull();
    });

    it('should log an error and re-throw if AsyncStorage.getItem returns malformed JSON', async () => {
      const malformedJson = 'not a json string';
      AsyncStorage.getItem.mockResolvedValueOnce(malformedJson);
      console.error = jest.fn(); // Mock console.error

      // JSON.parse will throw an error here, which should be caught and re-thrown by getData
      await expect(getData(testKey)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith("Error getting data with key '"+ testKey +"':", expect.any(Error));

      console.error.mockRestore(); // Restore original console.error
    });

    it('should log an error and re-throw if AsyncStorage.getItem itself fails (rejects)', async () => {
      const errorMessage = 'Failed to read data';
      AsyncStorage.getItem.mockRejectedValueOnce(new Error(errorMessage));
      console.error = jest.fn(); // Mock console.error

      await expect(getData(testKey)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalledWith("Error getting data with key '"+ testKey +"':", expect.any(Error));

      console.error.mockRestore(); // Restore original console.error
    });
  });
});
