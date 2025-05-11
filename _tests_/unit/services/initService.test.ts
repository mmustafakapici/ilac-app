import { getItem, setItem } from '../../../src/storage/storage';
import { SAMPLE_USER } from '../../../src/constants/user';
import { initService } from '../../../src/services/initService';

// Mock storage
jest.mock('../../../src/storage/storage');

describe('initService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should seed default user data when no user exists', async () => {
    (getItem as jest.Mock).mockResolvedValue(null);

    await initService();

    expect(setItem).toHaveBeenCalledWith('USER', SAMPLE_USER);
  });

  it('should not seed data when user already exists', async () => {
    const existingUser = { ...SAMPLE_USER, name: 'Existing User' };
    (getItem as jest.Mock).mockResolvedValue(existingUser);

    await initService();

    expect(setItem).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    (getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

    await expect(initService()).resolves.not.toThrow();
  });
}); 