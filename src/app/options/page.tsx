import HomeLayout from '@/components/layouts/HomeLayout';

export default function OptionsPage() {
	return (
		<>
			<HomeLayout background="/images/backgrounds/home_back.jpg">
				<div className={'flex flex-col items-center justify-center gap-4'}>
					<h1>Options Page</h1>
				</div>
			</HomeLayout>
		</>
	);
}
