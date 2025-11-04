import { Phenomenon } from '@/types/phenomenon';

export const getPhenomena = async (): Promise<Phenomenon[]> => {
  const res = await fetch('http://localhost:3000/phenomenon');
  if (!res.ok) {
    throw new Error('Failed to fetch phenomena');
  }
  return res.json();
};
