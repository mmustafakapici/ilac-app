import { getItem, setItem } from '@/storage/storage';
import { SAMPLE_USER } from '@/constants/user';
import { User } from '@/models/user';

const USER_KEY = 'USER';

/**
 * Initialize local user data and notification preferences.
 * If no user is found in local storage, writes SAMPLE_USER.
 */
export async function initService(): Promise<void> {
  try {
    const existing = await getItem<User>(USER_KEY);
    if (!existing) {
      await setItem<User>(USER_KEY, SAMPLE_USER);
      console.log('INIT: Default user data has been seeded.');
    } else {
      console.log('INIT: User data already exists, skipping seed.');
    }
  } catch (error) {
    console.error('INIT: Error initializing user data:', error);
  }
}
