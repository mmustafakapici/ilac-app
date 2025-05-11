import { getItem, setItem, removeItem } from '../../../src/storage/storage';
import { SAMPLE_USER } from '../../../src/constants/user';
import {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllReminders,
  getRemindersByDate,
  addReminder,
  updateReminder,
  deleteReminder,
  getUser,
  updateUser,
  deleteUser
} from '../../../src/services/dataService';

// Mock storage
jest.mock('../../../src/storage/storage');

describe('dataService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Medicine CRUD', () => {
    const mockMedicine = {
      id: '1',
      name: 'Test Medicine',
      dosage: { amount: 1, unit: 'tablet' },
      usage: { 
        frequency: 'daily',
        time: ['08:00', '20:00'], 
        condition: 'after meal' 
      },
      schedule: { startDate: '2024-03-20', endDate: '2024-03-25' }
    };

    const mockMedicines = [mockMedicine];

    beforeEach(() => {
      (getItem as jest.Mock).mockResolvedValue(mockMedicines);
    });

    it('should get all medicines', async () => {
      const result = await getAllMedicines();
      expect(result).toEqual(mockMedicines);
      expect(getItem).toHaveBeenCalledWith('MEDICINES');
    });

    it('should get medicine by id', async () => {
      const result = await getMedicineById('1');
      expect(result).toEqual(mockMedicine);
    });

    it('should add new medicine', async () => {
      const newMedicine = { ...mockMedicine, id: '2' };
      await addMedicine(newMedicine);
      expect(setItem).toHaveBeenCalledWith('MEDICINES', [...mockMedicines, newMedicine]);
    });

    it('should update existing medicine', async () => {
      const updatedMedicine = { ...mockMedicine, name: 'Updated Medicine' };
      await updateMedicine(updatedMedicine);
      expect(setItem).toHaveBeenCalledWith('MEDICINES', [updatedMedicine]);
    });

    it('should delete medicine', async () => {
      await deleteMedicine('1');
      expect(setItem).toHaveBeenCalledWith('MEDICINES', []);
    });
  });

  describe('Reminder CRUD', () => {
    const mockMedicine = {
      id: '1',
      name: 'Test Medicine',
      dosage: { amount: 1, unit: 'tablet' },
      usage: { 
        frequency: 'daily',
        time: ['08:00', '20:00'], 
        condition: 'after meal' 
      },
      schedule: { startDate: '2024-03-20', endDate: '2024-03-25' }
    };

    const mockReminder = {
      id: '1',
      medicineId: '1',
      medicine: mockMedicine,
      date: '2024-03-20',
      time: '08:00',
      title: 'Test Reminder',
      description: 'Test Description',
      isTaken: false,
      scheduledTime: '2024-03-20T08:00:00.000Z'
    };

    const mockReminders = [mockReminder];

    beforeEach(() => {
      (getItem as jest.Mock).mockResolvedValue(mockReminders);
    });

    it('should get all reminders', async () => {
      const result = await getAllReminders();
      expect(result).toEqual(mockReminders);
      expect(getItem).toHaveBeenCalledWith('REMINDERS');
    });

    it('should get reminders by date', async () => {
      const result = await getRemindersByDate('2024-03-20');
      expect(result).toEqual(mockReminders);
    });

    it('should add new reminder', async () => {
      const newReminder = { ...mockReminder, id: '2' };
      await addReminder(newReminder);
      expect(setItem).toHaveBeenCalledWith('REMINDERS', [...mockReminders, newReminder]);
    });

    it('should update existing reminder', async () => {
      const updatedReminder = { ...mockReminder, isTaken: true };
      await updateReminder(updatedReminder);
      expect(setItem).toHaveBeenCalledWith('REMINDERS', [updatedReminder]);
    });

    it('should delete reminder', async () => {
      await deleteReminder('1');
      expect(setItem).toHaveBeenCalledWith('REMINDERS', []);
    });
  });

  describe('User CRUD', () => {
    beforeEach(() => {
      (getItem as jest.Mock).mockResolvedValue(null);
    });

    it('should get user (return sample user if none exists)', async () => {
      const result = await getUser();
      expect(result).toEqual(SAMPLE_USER);
      expect(getItem).toHaveBeenCalledWith('USER');
    });

    it('should update user', async () => {
      const updatedUser = { ...SAMPLE_USER, name: 'Updated User' };
      await updateUser(updatedUser);
      expect(setItem).toHaveBeenCalledWith('USER', updatedUser);
    });

    it('should delete user', async () => {
      await deleteUser();
      expect(removeItem).toHaveBeenCalledWith('USER');
    });
  });
}); 