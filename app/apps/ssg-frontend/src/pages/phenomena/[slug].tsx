import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import PhenomenonView from '@/components/organisms/PhenomenonView';
import PhenomenonCard from '@/components/molecules/PhenomenonCard';
import { mockPhenomenonProperties } from '@/app/mock-data';
import { RenderablePhenomenon, Manifest, RenderableBlock } from '@/types/phenomenon';
import path from 'path';
import { promises as fs } from 'fs';

// Helper to construct the correct path to the public directory
const getPublicDirPath = () => {
  // The npm script `dev:ssg` is run from the `app/` directory,
  // and the Next.js project root is `apps/ssg-frontend`.
  return path.join(process.cwd(), 'apps/ssg-frontend/public');
};


type PhenomenonPageProps = {
  phenomenon: RenderablePhenomenon | null;
};

const PhenomenonPage: NextPage<PhenomenonPageProps> = ({ phenomenon }) => {
  if (!phenomenon) {
    return <div>Phenomenon not found.</div>;
  }

  // The PhenomenonView now needs to be compatible with RenderablePhenomenon
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{phenomenon.title}</h1>
      <PhenomenonCard properties={mockPhenomenonProperties} />
      <PhenomenonView phenomenon={phenomenon} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, you'd scan the public directory for all phenomenon slugs
  // For this task, we'll hardcode it.
  const slugs = ['quantum-mechanics'];
  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: 'blocking', // or 'true' to show a fallback UI
  };
};

export const getStaticProps: GetStaticProps<PhenomenonPageProps> = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const publicDir = getPublicDirPath();
    const manifestPath = path.join(publicDir, slug, 'manifest.json');

    // 1. Read the manifest file from the filesystem
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest: Manifest = JSON.parse(manifestContent);

    // 2. Process the structure to build the list of renderable blocks
    const renderableBlocksPromises = manifest.structure.map(async (structureNode) => {
      const blockData = manifest.blocks[structureNode.block_id];
      if (!blockData) {
        console.warn(`Block data not found for block_id: ${structureNode.block_id}`);
        return null;
      }

      // Find the "winning" alternative based on votes for the default language
      const winningAlternative = blockData.alternatives
        .filter((alt) => alt.lang === manifest.default_lang)
        .sort((a, b) => b.votes - a.votes)[0]; // Get the one with the most votes

      if (!winningAlternative) {
        console.warn(`No suitable alternative found for block_id: ${structureNode.block_id}`);
        return null;
      }

      // Read the markdown content from its file
      const contentPath = path.join(publicDir, slug, winningAlternative.file);
      const content = await fs.readFile(contentPath, 'utf-8');

      const renderableBlock: RenderableBlock = {
        id: structureNode.block_id,
        type: blockData.type,
        level: structureNode.level,
        content,
        source: winningAlternative.source,
        alternativesCount: blockData.alternatives.length,
      };
      return renderableBlock;
    });

    // Wait for all file reads to complete and filter out any nulls
    const renderableBlocks = (await Promise.all(renderableBlocksPromises)).filter(
      (block): block is RenderableBlock => block !== null
    );

    // If no blocks could be rendered, the page is not found
    if (renderableBlocks.length === 0) {
      return { notFound: true };
    }

    const phenomenon: RenderablePhenomenon = {
      slug: manifest.article_slug,
      title: manifest.title,
      cardData: manifest.card || undefined,
      blocks: renderableBlocks,
    };

    return {
      props: {
        phenomenon,
      },
      // Optional: Enable Incremental Static Regeneration (ISR)
      // revalidate: 60, // seconds
    };
  } catch (error) {
    // If the manifest file doesn't exist or there's a parsing error, treat as a 404
    console.error(`Error building page for slug "${slug}":`, error);
    return { notFound: true };
  }
};

export default PhenomenonPage;
