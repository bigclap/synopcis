import Layout from '@/components/Layout';

type Post = {
  id: number;
  title: string;
  content: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:3000/api/posts', { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
