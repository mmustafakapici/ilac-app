import { Medicine } from '@/models/medicine';
import { Reminder } from '@/models/reminder';
import { User } from '@/models/user';
import { SAMPLE_USER } from '@/constants/user';
import { getItem, setItem, removeItem } from '@/storage/storage';
import { generateId } from '@/utils/idUtils';

const MEDICINES_KEY = 'MEDICINES';
const REMINDERS_KEY = 'REMINDERS';
const USER_KEY = 'USER';

// --- Medicines CRUD ---
export async function getAllMedicines(): Promise<Medicine[]> {
  return (await getItem<Medicine[]>(MEDICINES_KEY)) || [];
}

export async function getMedicineById(id: string): Promise<Medicine | undefined> {
  const all = await getAllMedicines();
  return all.find(m => m.id === id);
}

export async function addMedicine(med: Medicine): Promise<void> {
  const all = await getAllMedicines();
  await setItem<Medicine[]>(MEDICINES_KEY, [...all, med]);
}

export async function updateMedicine(med: Medicine): Promise<void> {
  const allMedicines = await getAllMedicines();
  const updated = allMedicines.map(m => (m.id === med.id ? med : m));
  await setItem<Medicine[]>(MEDICINES_KEY, updated);

  const allReminders = await getAllReminders();
  const medicineReminders = allReminders.filter(r => r.medicineId === med.id);
  for (const reminder of medicineReminders) {
    await deleteReminder(reminder.id);
  }

  const start = med.schedule?.startDate;
  const end = med.schedule?.endDate || start;
  const times = med.usage?.time || [];

  if (start && end && times.length > 0) {
    const days = getDateRange(start, end);
    for (const day of days) {
      for (const time of times) {
        const reminder: Reminder = {
          id: generateId(),
          medicineId: med.id,
          medicine: med,
          date: day,
          time: time,
          title: med.name,
          description: `${med.dosage?.amount || ""} ${med.dosage?.unit || ""} ${med.usage?.condition || ""}`,
          isTaken: false,
          scheduledTime: new Date(`${day}T${time}`).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await addReminder(reminder);
      }
    }
  }
}

export async function deleteMedicine(id: string): Promise<void> {
  const allMedicines = await getAllMedicines();
  await setItem<Medicine[]>(MEDICINES_KEY, allMedicines.filter(m => m.id !== id));

  const allReminders = await getAllReminders();
  const medicineReminders = allReminders.filter(r => r.medicineId === id);
  for (const reminder of medicineReminders) {
    await deleteReminder(reminder.id);
  }
}

// --- Reminders CRUD ---
export async function getAllReminders(): Promise<Reminder[]> {
  return (await getItem<Reminder[]>(REMINDERS_KEY)) || [];
}

export async function getRemindersByDate(date: string): Promise<Reminder[]> {
  const all = await getAllReminders();
  return all.filter(r => r.date === date);
}

export async function addReminder(rem: Reminder): Promise<void> {
  const all = await getAllReminders();
  await setItem<Reminder[]>(REMINDERS_KEY, [...all, rem]);
}

export async function updateReminder(rem: Reminder): Promise<void> {
  const all = await getAllReminders();
  const updated = all.map(r => (r.id === rem.id ? rem : r));
  await setItem<Reminder[]>(REMINDERS_KEY, updated);
}

export async function deleteReminder(id: string): Promise<void> {
  const all = await getAllReminders();
  await setItem<Reminder[]>(REMINDERS_KEY, all.filter(r => r.id !== id));
}

// --- User CRUD ---
export async function getUser(): Promise<User> {
  const stored = await getItem<User>(USER_KEY);
  return stored ?? SAMPLE_USER;
}

export async function updateUser(user: User): Promise<void> {
  await setItem<User>(USER_KEY, user);
}

export async function deleteUser(): Promise<void> {
  await removeItem(USER_KEY);
}

function getDateRange(start: string, end: string): string[] {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
