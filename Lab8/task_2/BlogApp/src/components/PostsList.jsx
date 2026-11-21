import { usePosts } from '../context/PostsContext.jsx';
import PostCard from './PostCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function PostsList() {
  const { posts, removePost } = usePosts();

  if (posts.length === 0) return <EmptyState />;

  return (
    <section className="posts-section" id="posts-list">
      <div className="section-head">
        <h2>Все посты</h2>
        <span className="count-pill">{posts.length}</span>
      </div>
      <ul className="posts-list">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onDelete={removePost} />
        ))}
      </ul>
    </section>
  );
}