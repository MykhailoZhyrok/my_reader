import { RefObject, useEffect, useState } from 'react';
import { attachInsideHandlers } from '@/utils/iframeMountProc';

type UseAttachInsideHandlersParams = {
	iframeRef: RefObject<HTMLIFrameElement | null>;
	key: string;
	src: string;
	scale: number;
};

export default function useAttachInsideHandlers({
	iframeRef,
	key,
	src,
	scale,
}: UseAttachInsideHandlersParams) {
	const [pageCount, setPageCount] = useState(0);
	const [maxHeight, setMaxHeight] = useState(0);

	useEffect(() => {
		const iframe = iframeRef?.current;
		if (!iframe) return;

		let detach: (() => void) | null = null;

		const onLoad = () => {
			detach?.();
			detach = attachInsideHandlers({
				iframe,
				key,
				setMaxHeight,
				setPageCount,
				scale,
			});
		};

		iframe.addEventListener('load', onLoad);

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
	}, [key, src]);

	return { pageCount, maxHeight };
}
