type PhenomenonProperty = {
  property: string;
  value: string;
};

type PhenomenonCardProps = {
  properties: PhenomenonProperty[];
};

const PhenomenonCard = ({ properties }: PhenomenonCardProps) => {
  return (
    <aside className="w-64 border rounded-lg p-4 bg-gray-50 ml-4 mb-4 float-right">
      <div className="space-y-2">
        {properties.map(({ property, value }) => (
          <div key={property} className="flex justify-between border-b pb-1">
            <span className="text-sm font-semibold text-gray-600">{property}</span>
            <a href="#" className="text-sm text-gray-800 hover:underline text-right">
              {value}
            </a>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default PhenomenonCard;
