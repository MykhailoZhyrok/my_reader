'use client';

import { useMemo, useRef, useState } from 'react';
import { SliderWithProps } from '@/components/modules/SliderWithProps';
import useAttachInsideHandlers from '@/hooks/useAttachInsideHandlers';
import useReaderScale from '@/hooks/useReaderScale';

type Props = {
	src: string;
	storageKey?: string;
	className?: string;
};

export default function BookReader({ src, storageKey, className }: Props) {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const key = useMemo(() => storageKey ?? `reader:${src}`, [storageKey, src]);
	const [scale, setScale] = useState(1);

	const { pageCount } = useAttachInsideHandlers({ iframeRef, key, src, scale });

	useReaderScale({ iframeRef, scale });

	return (
		<div
			className={`relative overflow-x-hidden flex justify-center bg-white w-full h-full ${className ?? ''}`}
		>
			<iframe
				ref={iframeRef}
				src={src}
				className="relative overflow-x-hidden bg-white w-full h-full"
			/>
			<div className="absolute top-2 right-3 text-xs text-gray-500">
				{pageCount} pages
			</div>
			<SliderWithProps
				value={[Math.round(scale * 100)]}
				min={80}
				max={160}
				step={5}
				onValueChange={([v]) => {
					setScale(v / 100);
				}}
			/>
		</div>
	);
}
