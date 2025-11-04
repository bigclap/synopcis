type Concept = {
  key: string;
  label: string;
  type: string;
};

export const getConcepts = async (): Promise<Concept[]> => {
  const res = await fetch('http://localhost:3000/concept');
  if (!res.ok) {
    throw new Error('Failed to fetch concepts');
  }
  return res.json();
};
