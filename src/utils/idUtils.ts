// src/utils/idUtils.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * Eşsiz ID üretir.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}
