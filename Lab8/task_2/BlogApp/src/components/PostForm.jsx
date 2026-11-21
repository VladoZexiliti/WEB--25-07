import { useEffect, useMemo, useRef, useState } from 'react';
import { usePosts } from '../context/PostsContext.jsx';
import { navigate } from '../hooks/useRoute.js';
import { renderMarkdown } from '../utils/markdown.js';
import { fireConfetti } from '../utils/confetti.js';
import {
  IconPlus, IconBold, IconItalic, IconH1, IconH2, IconList, IconQuote, IconTable, IconEye, IconEdit,
} from './icons.jsx';
import TableModal from './TableModal.jsx';

const LIMITS = { titleMin: 3, titleMax: 90, textMin: 10, textMax: 12000 };

const BASE_MOODS = [
  { id: 'coral', label: 'Коралл', color: '#ff7a52' },
  { id: 'mint', label: 'Мята', color: '#4fd1b5' },
  { id: 'lav', label: 'Лаванда', color: '#8b7ff5' },
  { id: 'yellow', label: 'Жёлтый', color: '#facc15' },
];

const MOD_MOODS = [
  { id: 'none', label: 'Обычный' },
  { id: 'joy', label: 'Радостный' },
  { id: 'sad', label: 'Грустный' },
  { id: 'mel', label: 'Меланхоличный' },
];

export default function PostForm() {
  const { addPost } = usePosts();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [moodBase, setMoodBase] = useState('coral');
  const [moodMod, setMoodMod] = useState('none');
  const [touched, setTouched] = useState({ title: false, text: false });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  const [showTableModal, setShowTableModal] = useState(false);

  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  const errors = useMemo(() => {
    const e = {};
    if (title.trim().length < LIMITS.titleMin) {
      e.title = `Название: минимум ${LIMITS.titleMin} символа`;
    } else if (title.trim().length > LIMITS.titleMax) {
      e.title = `Название: максимум ${LIMITS.titleMax}`;
    }
    if (text.trim().length < LIMITS.textMin) {
      e.text = `Текст: минимум ${LIMITS.textMin} символов`;
    } else if (text.trim().length > LIMITS.textMax) {
      e.text = `Текст: максимум ${LIMITS.textMax}`;
    }
    return e;
  }, [title, text]);

  const showError = (field) => (touched[field] || submitted) && errors[field];

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.substring(start, end) || 'текст';
    const newText = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setText(newText);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
  };

  const insertTable = (rows, cols) => {
    let table = '\n\n| ';
    for (let i = 1; i <= cols; i += 1) table += `Заголовок ${i} | `;
    table += '\n|';
    for (let i = 0; i < cols; i += 1) table += '---|';
    table += '\n';
    for (let r = 1; r < rows; r += 1) {
      table += '| ';
      for (let c = 1; c <= cols; c += 1) table += 'Текст | ';
      table += '\n';
    }
    table += '\n';
    insertMarkdown(table);
    setShowTableModal(false);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      if (errors.title && titleRef.current) titleRef.current.focus();
      else if (errors.text && textareaRef.current) textareaRef.current.focus();
      return;
    }

    const post = addPost({ title, text, moodBase, moodMod });

    const btn = ev.target.querySelector('button[type="submit"]');
    const rect = btn.getBoundingClientRect();
    const confettiColor = BASE_MOODS.find((m) => m.id === moodBase).color;
    fireConfetti(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2 - 50,
      confettiColor,
      30
    );

    setTimeout(() => navigate(`/post/${post.id}`), 300);
  };

  return (
    <>
      <form className={`post-form mood-${moodBase}-${moodMod}`} onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="post-title">
            <span>Название</span>
            <span className="counter">{title.trim().length}/{LIMITS.titleMax}</span>
          </label>
          <input
            id="post-title"
            ref={titleRef}
            className={`input${showError('title') ? ' invalid' : ''}`}
            type="text"
            value={title}
            maxLength={LIMITS.titleMax}
            placeholder="О чём эта запись?"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
          />
          {showError('title') && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="post-text">
            <span>Текст (Markdown)</span>
            <span className="counter">{text.trim().length}/{LIMITS.textMax}</span>
          </label>

          <div className="editor-header">
            <div className="editor-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                onClick={() => setActiveTab('write')}
              >
                <IconEdit /> Писать
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <IconEye /> Просмотр
              </button>
            </div>
            {activeTab === 'write' && (
              <div className="editor-toolbar">
                <button type="button" className="tool-btn" title="Заголовок 1" onClick={() => insertMarkdown('# ')}><IconH1 /></button>
                <button type="button" className="tool-btn" title="Заголовок 2" onClick={() => insertMarkdown('## ')}><IconH2 /></button>
                <div className="tool-divider" />
                <button type="button" className="tool-btn" title="Жирный" onClick={() => insertMarkdown('**', '**')}><IconBold /></button>
                <button type="button" className="tool-btn" title="Курсив" onClick={() => insertMarkdown('*', '*')}><IconItalic /></button>
                <div className="tool-divider" />
                <button type="button" className="tool-btn" title="Список" onClick={() => insertMarkdown('- ')}><IconList /></button>
                <button type="button" className="tool-btn" title="Цитата" onClick={() => insertMarkdown('> ')}><IconQuote /></button>
                <button type="button" className="tool-btn" title="Таблица" onClick={() => setShowTableModal(true)}><IconTable /></button>
              </div>
            )}
          </div>

          {activeTab === 'write' ? (
            <textarea
              id="post-text"
              ref={textareaRef}
              className={`textarea${showError('text') ? ' invalid' : ''}`}
              value={text}
              maxLength={LIMITS.textMax}
              placeholder="Спокойно, вдумчиво, по-своему…"
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, text: true }))}
            />
          ) : (
            <div className="textarea-preview post-body">
              {text.trim()
                ? <div dangerouslySetInnerHTML={renderMarkdown(text)} />
                : <p style={{ color: '#a3958e' }}>Здесь появится текст...</p>}
            </div>
          )}
          {showError('text') && <span className="field-error">{errors.text}</span>}
        </div>

        <div className="field mood-field">
          <label className="field-label"><span>Настроение и действие</span></label>
          <div className="mood-container">
            <div className="mood-rows">
              <div className="mood-row">
                <span className="mood-row-label">Цвет:</span>
                {BASE_MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`mood-btn base ${moodBase === m.id ? 'active' : ''}`}
                    style={{ '--m-color': m.color }}
                    onClick={() => setMoodBase(m.id)}
                  >
                    <span className="mood-dot" />{m.label}
                  </button>
                ))}
              </div>
              <div className="mood-row">
                <span className="mood-row-label">Эмоция:</span>
                {MOD_MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`mood-btn mod ${moodMod === m.id ? 'active' : ''}`}
                    onClick={() => setMoodMod(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-actions-inline">
              <a className="btn btn-ghost" href="#/">Отмена</a>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  background: 'var(--mood-color)',
                  boxShadow: '0 10px 24px -12px var(--mood-color)',
                }}
              >
                <IconPlus /> Опубликовать
              </button>
            </div>
          </div>
        </div>
      </form>

      {showTableModal && (
        <TableModal
          onClose={() => setShowTableModal(false)}
          onInsert={insertTable}
        />
      )}
    </>
  );
}