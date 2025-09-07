export function ensureReaderTypography(doc: Document) {
	if (doc.getElementById('__reader_typography__')) return;
	const style = doc.createElement('style');
	style.id = '__reader_typography__';
	style.textContent = `
    :root{
      --reader-base: 16px;   /* базовый размер шрифта */
      --reader-scale: 1;     /* общий множитель 0.8..1.8 */
      --reader-line: 1.6;    /* базовый line-height */
    }

    html{ font-size: var(--reader-base); }
    body{ margin:0; line-height: var(--reader-line); }

    /* Базовые текстовые элементы */
    :where(p, span, a, strong, em, i, b, u, s, small, mark, time, abbr, cite, q,
           code, kbd, samp, sub, sup, label, legend,
           li, dt, dd, figcaption, summary, caption,
           td, th, textarea, input, select, button){
      font-size: calc(1rem * var(--reader-scale));
    }

    /* Заголовки с относительными размерами — тоже масштабируются */
    :where(h1){ font-size: calc(2rem * var(--reader-scale)); }
    :where(h2){ font-size: calc(1.75rem * var(--reader-scale)); }
    :where(h3){ font-size: calc(1.5rem * var(--reader-scale)); }
    :where(h4){ font-size: calc(1.25rem * var(--reader-scale)); }
    :where(h5){ font-size: calc(1.125rem * var(--reader-scale)); }
    :where(h6){ font-size: calc(1rem * var(--reader-scale)); }

    /* Списки и таблицы */
    :where(ul, ol){ padding-left: 1.5em; margin: 0.8em 0; }
    :where(table){ width:100%; border-collapse: collapse; }
    :where(th, td){ padding: .5em .6em; }

    /* Моноширинные блоки */
    :where(code, kbd, samp, pre){
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: calc(.95rem * var(--reader-scale));
    }
    pre{ line-height: 1.5; white-space: pre-wrap; word-break: break-word; }

    /* Цитаты и мелкий текст */
    :where(blockquote){ margin: 1em 0; padding-left: 1em; border-left: 3px solid rgba(0,0,0,.1); }
    :where(small){ font-size: calc(.875rem * var(--reader-scale)); }

    /* Чуть увеличиваем межстрочный при крупном масштабе */
    body{ line-height: calc(var(--reader-line) + (max(var(--reader-scale),1) - 1) * 0.2); }
  `;
	doc.head.appendChild(style);
}

export function setReaderScale(doc: Document, scale: number) {
	const s = Math.max(0.8, Math.min(scale, 1.8));
	doc.documentElement.style.setProperty('--reader-scale', String(s));
}

export function setReaderBase(doc: Document, px: number) {
	const clamped = Math.max(12, Math.min(px, 22));
	doc.documentElement.style.setProperty('--reader-base', `${clamped}px`);
}
