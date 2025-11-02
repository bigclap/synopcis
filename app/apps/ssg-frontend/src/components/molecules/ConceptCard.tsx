type Concept = {
  key: string;
  label: string;
  type: string;
};

const ConceptCard = ({ concept }: { concept: Concept }) => {
  return (
    <div className="border rounded-lg p-2 mb-2 bg-gray-100">
      <h3 className="text-lg font-semibold">{concept.label}</h3>
      <p className="text-sm text-gray-600">{concept.key} ({concept.type})</p>
    </div>
  );
};

export default ConceptCard;
