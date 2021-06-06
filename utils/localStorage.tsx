import { User} from '../model/user';
import * as SecureStore from 'expo-secure-store';

export const KEY = 'spcn';

export async function saveUserInLocalStorage(user: User) {
  save(KEY, JSON.stringify(user))
}

export function getUserFromLocalStorage() {
  return getValueByKey(KEY);
}

export async function deleteAll() {
  await SecureStore.deleteItemAsync(KEY);
}

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueByKey(key: string) {
  const result = await SecureStore.getItemAsync(key);
  return !!result ? JSON.parse(result) : undefined;
}