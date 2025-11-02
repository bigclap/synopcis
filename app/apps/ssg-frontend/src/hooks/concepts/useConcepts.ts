import { useState, useEffect } from 'react';
import { getConcepts } from '@/services/concepts/conceptsService';
import { mockConcepts } from '@/app/mock-data';

type Concept = {
  key: string;
  label: string;
  type: string;
};

export const useConcepts = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (process.env.NODE_ENV === 'development') {
        setConcepts(mockConcepts);
      } else {
        try {
          const data = await getConcepts();
          setConcepts(data);
        } catch (error) {
          console.error('Failed to fetch concepts:', error);
          setConcepts([]);
        }
      }
    };

    fetchData();
  }, []);

  return { concepts };
};
