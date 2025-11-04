type Block = {
  content: string;
  type: string;
  sort: number;
};

const Block = ({ block }: { block: Block }) => {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-2xl font-bold">{block.content}</h2>;
    case 'paragraph':
      return <p className="mb-4">{block.content}</p>;
    default:
      return null;
  }
};

export default Block;
