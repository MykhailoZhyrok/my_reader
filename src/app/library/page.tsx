import LibraryLayout from '@/components/layouts/LibraryLayout';
import PDFReader from '@/components/readers/PDF_reader';
import FullViewLayout from '@/components/layouts/FullViewLayout';

export default function LibraryPage() {
	const pageTitle = 'Library Page';

	return (
		<>
			<LibraryLayout background="/images/backgrounds/home_back.jpg">
				<FullViewLayout>
					<PDFReader src="/books/shantaram/index.html" />
				</FullViewLayout>
			</LibraryLayout>
		</>
	);
}
