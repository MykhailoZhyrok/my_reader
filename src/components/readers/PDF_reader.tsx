'use client';

import { useEffect, useMemo, useRef } from 'react';

type Props = {
	src: string;
	storageKey?: string;
};

export default function PDFReader({ src, storageKey }: Props) {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const key = useMemo(() => storageKey ?? `reader:${src}`, [storageKey, src]);

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		let saveTimer: number | null = null;
		let scrollHandler: ((this: Window, ev: Event) => any) | null = null;

		const saveProgress = (doc: Document) => {
			const el = doc.documentElement;
			const body = doc.body;
			const scrollTop = (el?.scrollTop ?? 0) || (body?.scrollTop ?? 0);
			const scrollHeight = (el?.scrollHeight ?? 1) || (body?.scrollHeight ?? 1);
			const clientHeight = (el?.clientHeight ?? 1) || (body?.clientHeight ?? 1);
			const max = Math.max(1, scrollHeight - clientHeight);
			const progress = Math.min(1, scrollTop / max);

			localStorage.setItem(
				key,
				JSON.stringify({ scrollTop, progress, t: Date.now() }),
			);
		};

		const restoreProgress = (doc: Document) => {
			const raw = localStorage.getItem(key);
			if (!raw) return;

			try {
				const { scrollTop, progress } = JSON.parse(raw);
				const el = doc.documentElement;
				const body = doc.body;
				console.log(scrollTop, progress);
				const apply = () => {
					let y = typeof scrollTop === 'number' ? scrollTop : 0;

					const win = doc.defaultView || window;

					win.scrollTo({ top: y, behavior: 'smooth' });
				};
				console.log(apply);
				apply();
				setTimeout(apply, 0);
				setTimeout(apply, 500);
			} catch {}
		};

		const onLoad = () => {
			const win = iframe.contentWindow;
			const doc = iframe.contentDocument;
			if (!win || !doc) return;

			restoreProgress(doc);

			const throttled = () => {
				if (saveTimer) window.clearTimeout(saveTimer);
				saveTimer = window.setTimeout(() => saveProgress(doc), 300);
			};

			scrollHandler = throttled;
			// На документе скролл часто всплывает на window — слушаем окно внутри iframe
			win.addEventListener('scroll', throttled, { passive: true });
		};

		iframe.addEventListener('load', onLoad);

		return () => {
			iframe.removeEventListener('load', onLoad);
			if (scrollHandler && iframe.contentWindow) {
				iframe.contentWindow.removeEventListener('scroll', scrollHandler);
			}
			if (saveTimer) {
				window.clearTimeout(saveTimer);
			}
		};
	}, [key, src]);

	return (
		<div className={'relative overflow-x-hidden bg-white w-full h-full'}>
			<iframe
				ref={iframeRef}
				src={src}
				className={'relative overflow-x-hidden bg-white w-full h-full'}
			/>
		</div>
	);
}
