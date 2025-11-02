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

export const getPhenomena = async (): Promise<Phenomenon[]> => {
  const res = await fetch('http://localhost:3000/phenomenon');
  if (!res.ok) {
    throw new Error('Failed to fetch phenomena');
  }
  return res.json();
};
