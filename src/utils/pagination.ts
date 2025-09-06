export default function pagination(maxScroll: number): {
	pages: number;
	currentPage: number;
} {
	const viewportHeight = window.innerHeight;
	const pages = Math.ceil(maxScroll / viewportHeight);
	const currentPage = Math.min(
		pages,
		Math.max(1, Math.ceil(window.scrollY / viewportHeight) + 1),
	);
	return { pages, currentPage };
}
