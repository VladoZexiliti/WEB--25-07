import PostForm from '../components/PostForm.jsx';
import { IconBack } from '../components/icons.jsx';

export default function NewPostPage() {
  return (
    <div className="form-page">
      <a className="back-link" href="#/"><IconBack /> В ленту</a>
      <div className="form-card">
        <header className="form-head">
          <h1>Новый пост</h1>
          <p>Пара тёплых слов — и запись появится в ленте.</p>
        </header>
        <PostForm />
      </div>
    </div>
  );
}