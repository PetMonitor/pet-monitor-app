import * as SecureStore from 'expo-secure-store';

export async function secureStoreSave(key, value) {
    await SecureStore.setItemAsync(key, value);
}
  
export async function getSecureStoreValueFor(key) {
    const value = await SecureStore.getItemAsync(key);
    console.log(`Retrieved value from store ${key} ${value}`)
    return value;
}


export async function clearStore() {
    await SecureStore.deleteItemAsync('sessionToken');
    await SecureStore.deleteItemAsync('facebookToken');
    console.log(`Cleared store`)
    return value;
}
