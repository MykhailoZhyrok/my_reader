'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { attachInsideHandlers } from '@/utils/iframeMountProc';
import {SliderWithProps} from "@/components/modules/SliderWithProps";
import {ensureReaderTypography, setReaderScale} from "@/utils/readerTypography";

type Props = {
	src: string;
	storageKey?: string;
	className?: string;
};

export default function BookReader({ src, storageKey, className }: Props) {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const key = useMemo(() => storageKey ?? `reader:${src}`, [storageKey, src]);
	const [scale, setScale] = useState(1);

	const [pageCount, setPageCount] = useState(0);
	const [maxHeight, setMaxHeight] = useState(0);

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		let detach: (() => void) | null = null;

		const onLoad = () => {
			// новый документ внутри iframe
			// навешиваем обработчики и получаем disposer
			detach?.(); // на всякий случай снимаем старые
			detach = attachInsideHandlers({
				iframe,
				key,
				setMaxHeight,
				setPageCount,
				scale
			});
		};

		// слушаем только один раз текущий элемент
		iframe.addEventListener('load', onLoad);

		// если документ уже загружен (race), попробуем подключиться сразу
		if (
			iframe.contentDocument &&
			iframe.contentDocument.readyState === 'complete'
		) {
			onLoad();
		}

		return () => {
			iframe.removeEventListener('load', onLoad);
			detach?.();
		};
	}, [key, src]); // при смене src/ключа — перенавешиваем

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;
		const apply = () => {
			const doc = iframe.contentDocument;
			if (!doc) return;
			ensureReaderTypography(doc);
			setReaderScale(doc, scale);
		};
		iframe.addEventListener('load', apply);
		if (iframe.contentDocument?.readyState === 'complete') apply();
		return () => iframe.removeEventListener('load', apply);
	}, [scale]);
	return (
		<div
			className={`relative overflow-x-hidden flex justify-center bg-white w-full h-full ${className ?? ''}`}
		>
			<iframe
				ref={iframeRef}
				src={src}
				className="relative overflow-x-hidden bg-white w-full h-full"
				// важно для same-origin доступа: src должен указывать на тот же домен/протокол/порт
			/>
			{/* пример подсказки/индикатора страниц — как хочешь визуализируй */}
			<div className="absolute top-2 right-3 text-xs text-gray-500">
				{pageCount} pages
			</div>
			<SliderWithProps value={[Math.round(scale*100)]} min={80} max={160} step={5}
					onValueChange={([v])=> {
						console.log(v);
						setScale(v / 100)
					}} />
		</div>
	);
}
