import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { tripData } from './mockdeta';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


