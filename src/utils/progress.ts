export type ProgressPayload = {
	scrollTop: number;
	progress: number; // 0..1
	t: number; // timestamp
};

export function getMaxScrollable(doc: Document, iframe?: HTMLIFrameElement) {
	const el = doc.documentElement;
	const body = doc.body;

	const scrollHeight = Math.max(el?.scrollHeight || 0, body?.scrollHeight || 0);
	const clientHeight = Math.max(iframe?.clientHeight || 0);
	console.log('getMaxScrollable', scrollHeight, clientHeight);
	return Math.max(1, scrollHeight - clientHeight);
}

export function saveProgress(
	doc: Document,
	key: string,
	max = getMaxScrollable(doc),
) {
	if (typeof window === 'undefined') return; // SSR guard
	try {
		const el = doc.documentElement;
		const body = doc.body;

		// Более надёжно брать текущую позицию окна:
		const scrollTop =
			(doc.defaultView?.scrollY ?? 0) || el?.scrollTop || body?.scrollTop || 0;

		const progress = Math.min(1, Math.max(0, scrollTop / max));

		const payload: ProgressPayload = { scrollTop, progress, t: Date.now() };
		window.localStorage.setItem(key, JSON.stringify(payload));
	} catch {
		// localStorage может быть недоступен — безопасно игнорируем
	}
}

export function restoreProgress(doc: Document, key: string) {
	if (typeof window === 'undefined') return; // SSR guard
	let payload: ProgressPayload | null = null;

	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return;
		payload = JSON.parse(raw) as ProgressPayload;
	} catch {
		return;
	}

	const apply = () => {
		const max = getMaxScrollable(doc);
		// Используем progress, а не устаревший scrollTop
		const yFromProgress = Math.round((payload?.progress ?? 0) * max);
		const y = Number.isFinite(yFromProgress)
			? yFromProgress
			: (payload?.scrollTop ?? 0);
		console.log('restoreProgress', y, yFromProgress);
		const win = doc.defaultView || window;
		try {
			win.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }); // моментально, чтобы не «прыгать» несколько раз
		} catch {
			// Fallback для старых браузеров
			(win as any).scrollTo(0, y);
		}
	};
	// Несколько попыток: сразу, в rAF и через короткую задержку — пока макеты/шрифты «устаканятся»
	apply();
	if ('requestAnimationFrame' in window) {
		requestAnimationFrame(apply);
	}
	setTimeout(apply, 100);
	setTimeout(apply, 400);
}
