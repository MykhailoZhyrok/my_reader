import { ReactNode } from 'react';

export default function FullViewLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col items-center w-full justify-center flex-1">
			{children}
		</div>
	);
}
