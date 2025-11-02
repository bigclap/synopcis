import Block from '../atoms/Block';

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

const PhenomenonCard = ({ phenomenon }: { phenomenon: Phenomenon }) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-2xl font-bold mb-2">{phenomenon.title}</h2>
      {phenomenon.blocks.map((block) => (
        <Block key={block.sort} block={block} />
      ))}
    </div>
  );
};

export default PhenomenonCard;
