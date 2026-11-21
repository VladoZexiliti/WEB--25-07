import { useEffect, useRef, useState } from 'react';
import { formatDate } from '../utils/format.js';
import { IconTrash, IconArrow } from './icons.jsx';

export default function PostCard({ post, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!confirming) return undefined;
    const t = setTimeout(() => setConfirming(false), 3200);
    return () => clearTimeout(t);
  }, [confirming]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rotateX = (e.clientY - rect.top - rect.height / 2) / 30;
    const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 30;
    cardRef.current.style.transform =
      `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      'perspective(2000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(post.id), 220);
  };

  const plainText = post.text.replace(/[#*>\-|]/g, '').replace(/\n/g, ' ');
  const moodClass = `mood-${post.moodBase || 'coral'}-${post.moodMod || 'none'}`;

  return (
    <li
      ref={cardRef}
      className={`post-card ${moodClass}${removing ? ' removing' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="post-card-top">
        <time className="date-pill" dateTime={post.date}>{formatDate(post.date)}</time>
        <div className="post-card-tools">
          {confirming ? (
            <>
              <button type="button" className="icon-btn danger" onClick={handleDelete}>
                <IconTrash /> Удалить?
              </button>
              <button type="button" className="icon-btn" onClick={() => setConfirming(false)}>
                Отмена
              </button>
            </>
          ) : (
            <button type="button" className="icon-btn" onClick={() => setConfirming(true)}>
              <IconTrash />
            </button>
          )}
        </div>
      </div>
      <a className="post-card-link" href={`#/post/${post.id}`}>
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{plainText}</p>
        <span className="read-more">Читать целиком <IconArrow /></span>
      </a>
    </li>
  );
}