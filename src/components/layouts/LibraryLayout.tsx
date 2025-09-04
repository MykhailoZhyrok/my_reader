import { ReactNode } from 'react';
import { Navbar } from '@/components/navigation/BottomNav';
import { mainNavbar } from '@/lib/nav_configs/main_config';
import Image from 'next/image';

export default function LibraryLayout({
	children,
	background,
}: {
	children: ReactNode;
	background?: string;
}) {
	return (
		<div className="flex flex-col items-center relative max-w-[800px] mx-auto justify-between h-dvh">
			{background && (
				<Image
					src={background}
					alt="Logo"
					className={`object-contain z-[-1] aspect-[736/1226]`}
					fill
				/>
			)}

			<div
				className={`flex-1 flex w-full flex-col items-center justify-center gap-4`}
			>
				{children}
			</div>
			<Navbar components={mainNavbar} />
		</div>
	);
}
