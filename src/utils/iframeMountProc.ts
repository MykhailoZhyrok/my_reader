'use client';

import {
	restoreProgress,
	saveProgress,
	getMaxScrollable,
} from '@/utils/progress';
import {ensureReaderTypography, setReaderScale} from "@/utils/readerTypography";

// простая пагинация: количество "экранов" по высоте
function calcPages(totalScrollable: number, viewportH: number) {
	const max = Math.max(1, totalScrollable);
	const vp = Math.max(1, viewportH);
	const pages = Math.max(1, Math.ceil(max / vp));
	return { pages };
}

export interface HandlersReaderOptions {
	iframe: HTMLIFrameElement;
	key: string;
	setMaxHeight: (h: number) => void;
	setPageCount: (c: number) => void;
	scale: number;

}

/**
 * Вешает обработчики внутри iframe и возвращает disposer для отписки.
 * Работает только при same-origin iframe (требуется доступ к contentDocument).
 */
export function attachInsideHandlers(opts: HandlersReaderOptions): () => void {
	const { iframe, key, setMaxHeight, setPageCount } = opts;

	const win = iframe.contentWindow;
	const doc = iframe.contentDocument;
	if (!win || !doc) return () => {};


	// --- helpers
	const recomputeHeightsAndPages = () => {
		const total = getMaxScrollable(doc); // scrollHeight - clientHeight
		setMaxHeight(total);
        console.log('recomputeHeightsAndPages', total);
		const vp = Math.max(
			1,
			win.innerHeight || doc.documentElement.clientHeight || 1,
		);
		const { pages } = calcPages(total, vp);
		setPageCount(pages);
	};


	const debouncedSave = (() => {
		let t: number | null = null;
		return () => {
			if (t) win.clearTimeout(t);
			t = win.setTimeout(() => saveProgress(doc, key), 300);
		};
	})();

	const safeRestore = () => {
		// восстановить несколько раз, чтобы поймать изменения высоты
		restoreProgress(doc, key);
		win.requestAnimationFrame?.(() => restoreProgress(doc, key));
		win.setTimeout(() => restoreProgress(doc, key), 100);
		win.setTimeout(() => restoreProgress(doc, key), 400);
	};

	// --- первичная инициализация
	recomputeHeightsAndPages();
	safeRestore();

	// --- события внутри фрейма
	const onScroll = debouncedSave;
	const onResize = () => {
		recomputeHeightsAndPages();
		// позиция может «уехать» из-за изменений высоты — подправим по сохранённому прогрессу
		restoreProgress(doc, key);
	};
	const onHashChange = () => {
		// переход по якорю = новая логическая «страница» в книге
		safeRestore();
		recomputeHeightsAndPages();
	};
	const onPopState = onHashChange;
	const onPageShow = () => {
		// возврат из bfcache
		safeRestore();
		recomputeHeightsAndPages();
	};

	win.addEventListener('scroll', onScroll, { passive: true });
	win.addEventListener('resize', onResize);
	win.addEventListener('hashchange', onHashChange);
	win.addEventListener('popstate', onPopState);
	win.addEventListener('pageshow', onPageShow);

	// наблюдаем за изменениями содержимого (картинки дорисовались, шрифты, lazy-content)
	let ro: ResizeObserver | null = null;
	try {
		ro = new ResizeObserver(() => {
			recomputeHeightsAndPages();
		});
		// наблюдать лучше за documentElement и body
		if (doc.documentElement) ro.observe(doc.documentElement);
		if (doc.body) ro.observe(doc.body);
	} catch {
		// ResizeObserver может отсутствовать — не критично
	}

	// --- disposer
	return () => {
		win.removeEventListener('scroll', onScroll);
		win.removeEventListener('resize', onResize);
		win.removeEventListener('hashchange', onHashChange);
		win.removeEventListener('popstate', onPopState);
		win.removeEventListener('pageshow', onPageShow);
		ro?.disconnect();
	};
}
