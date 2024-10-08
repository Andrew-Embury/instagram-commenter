import { fetchInstagramPosts } from '@/lib/instagram';
import { Post } from '@/types/instagram';
import ErrorBoundary from '@/components/ErrorBoundary';
import PostCard from '@/components/PostCard';

export default async function PostsPage() {
  let posts: Post[] = [];

  try {
    posts = await fetchInstagramPosts();
  } catch (error) {
    console.error('Failed to fetch Instagram posts:', error);
    // You might want to add some error UI here
  }

  return (
    <ErrorBoundary>
      <h2 className='mb-4 text-2xl font-bold'>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available. Please try again later.</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </ErrorBoundary>
  );
}
