import { RefObject, useEffect } from 'react';
import {
	ensureReaderTypography,
	setReaderScale,
} from '@/utils/readerTypography';

type UseReaderScaleParams = {
	iframeRef: RefObject<HTMLIFrameElement | null>;
	scale: number;
};

export default function useReaderScale({
	iframeRef,
	scale,
}: UseReaderScaleParams) {
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
}
