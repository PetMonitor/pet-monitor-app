import * as SecureStore from 'expo-secure-store';

export async function secureStoreSave(key, value) {
    await SecureStore.setItemAsync(key, value);
}
  
export async function getSecureStoreValueFor(key) {
    const value = await SecureStore.getItemAsync(key);
    return value;
}

