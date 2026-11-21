import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute } from './hooks/useRoute.js';
import { useMouseParallax } from './hooks/useMouseParallax.js';
import { useFallingLeaves } from './hooks/useFallingLeaves.js';
import { useBgRipple } from './hooks/useBgRipple.js';
import { PostsContext } from './context/PostsContext.jsx';
import { loadPosts, savePosts, uid } from './utils/storage.js';
import { seedPosts } from './utils/seedPosts.js';
import TopNav from './components/TopNav.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import HomePage from './pages/HomePage.jsx';
import NewPostPage from './pages/NewPostPage.jsx';
import PostPage from './pages/PostPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const [posts, setPosts] = useState(() => loadPosts(seedPosts));
  const route = useRoute();

  useMouseParallax();
  useFallingLeaves();
  useBgRipple();

  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.path]);

  const addPost = useCallback(({ title, text, moodBase, moodMod }) => {
    const post = {
      id: uid(),
      title: title.trim(),
      text: text.trim(),
      moodBase,
      moodMod,
      date: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
    return post;
  }, []);

  const removePost = useCallback((id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const ctx = useMemo(
    () => ({ posts, addPost, removePost }),
    [posts, addPost, removePost]
  );

  let page;
  if (route.name === 'home') page = <HomePage />;
  else if (route.name === 'new') page = <NewPostPage />;
  else if (route.name === 'post') page = <PostPage id={route.id} />;
  else page = <NotFoundPage />;

  return (
    <PostsContext.Provider value={ctx}>
      <div className="app-shell">
        <TopNav route={route} />
        <main className="page-wrap" key={route.path}>{page}</main>
        <SiteFooter />
      </div>
    </PostsContext.Provider>
  );
}