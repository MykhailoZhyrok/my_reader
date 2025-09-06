import BookReader from '@/components/reader/BookReader';
import FullViewLayout from '@/components/layouts/FullViewLayout';
import LibraryLayout from '@/components/layouts/LibraryLayout';

export default function LibraryPage() {

	return (
		<>
			<LibraryLayout background="/images/backgrounds/home_back.jpg">
				<FullViewLayout>
					<BookReader src="/books/shantaram/index.html" />
				</FullViewLayout>
			</LibraryLayout>
		</>
	);
}
