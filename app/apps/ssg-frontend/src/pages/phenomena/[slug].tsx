import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import PhenomenonView from '@/components/organisms/PhenomenonView';
import { mockPhenomena, Phenomenon } from '@/app/mock-data';

type PhenomenonPageProps = {
  phenomenon: Phenomenon | null;
};

const PhenomenonPage: NextPage<PhenomenonPageProps> = ({ phenomenon }) => {
  if (!phenomenon) {
    // This can be a custom 404 page or a simple message
    return <div>Phenomenon not found.</div>;
  }

  return <PhenomenonView phenomenon={phenomenon} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // We can pre-render some paths at build time if we want,
  // but for a purely ISR/on-demand approach, we can return an empty array.
  const paths = mockPhenomena.map((p) => ({
    params: { slug: p.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // or true, if you want to show a fallback UI
  };
};

export const getStaticProps: GetStaticProps<PhenomenonPageProps> = async (context) => {
  const { slug } = context.params as { slug: string };

  // In a real app, you'd fetch this from an API.
  // Here, we're finding it in our mock data.
  const phenomenon = mockPhenomena.find((p) => p.slug === slug) || null;

  if (!phenomenon) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      phenomenon,
    },
    // revalidate: 60, // Optional: re-generate the page every 60 seconds
  };
};

export default PhenomenonPage;
