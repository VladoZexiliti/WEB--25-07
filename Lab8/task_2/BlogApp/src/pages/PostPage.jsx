import { useEffect, useState } from 'react';
import { usePosts } from '../context/PostsContext.jsx';
import { navigate } from '../hooks/useRoute.js';
import { formatDate } from '../utils/format.js';
import { renderMarkdown } from '../utils/markdown.js';
import { IconBack, IconTrash } from '../components/icons.jsx';

export default function PostPage({ id }) {
  const { posts, removePost } = usePosts();
  const post = posts.find((p) => p.id === id);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return undefined;
    const t = setTimeout(() => setConfirming(false), 3200);
    return () => clearTimeout(t);
  }, [confirming]);

  if (!post) {
    return (
      <div className="post-page">
        <a className="back-link" href="#/"><IconBack /> В ленту</a>
        <div className="empty-state">
          <h3 className="empty-title">Пост не найден</h3>
          <p className="empty-text">Возможно, он был удалён.</p>
        </div>
      </div>
    );
  }

  const moodClass = `mood-${post.moodBase || 'coral'}-${post.moodMod || 'none'}`;

  return (
    <div className={`post-page ${moodClass}`}>
      <a className="back-link" href="#/"><IconBack /> В ленту</a>
      <article className="post-article">
        <div className="post-article-head">
          <time className="date-pill" dateTime={post.date}>{formatDate(post.date)}</time>
          <div className="post-card-tools always">
            {confirming ? (
              <>
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => { removePost(post.id); navigate('/'); }}
                >
                  <IconTrash /> Удалить?
                </button>
                <button type="button" className="icon-btn" onClick={() => setConfirming(false)}>
                  Отмена
                </button>
              </>
            ) : (
              <button type="button" className="icon-btn" onClick={() => setConfirming(true)}>
                <IconTrash /> Удалить
              </button>
            )}
          </div>
        </div>
        <h1>{post.title}</h1>
        <svg className="wave-underline" viewBox="0 0 240 14" preserveAspectRatio="none">
          <path
            d="M2 9 C 22 2, 42 2, 62 9 S 102 16, 122 9 S 162 2, 182 9 S 222 16, 238 9"
            fill="none" stroke="var(--mood-color)" strokeWidth="4" strokeLinecap="round"
          />
        </svg>
        <div className="post-body" dangerouslySetInnerHTML={renderMarkdown(post.text)} />
      </article>
    </div>
  );
}