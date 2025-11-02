import { useState, useEffect } from 'react';
import { getPhenomena } from '@/services/phenomena/phenomenaService';
import { mockPhenomena } from '@/app/mock-data';

type Block = {
  content: string;
  type: string;
  sort: number;
};

type Phenomenon = {
  id: string;
  title: string;
  lang_code: string;
  blocks: Block[];
};

export const usePhenomena = () => {
  const [phenomena, setPhenomena] = useState<Phenomenon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock phenomena');
        setPhenomena(mockPhenomena);
      } else {
        try {
          const data = await getPhenomena();
          setPhenomena(data);
        } catch (error) {
          console.error('Failed to fetch phenomena:', error);
          setPhenomena([]);
        }
      }
    };

    fetchData();
  }, []);

  return { phenomena };
};
