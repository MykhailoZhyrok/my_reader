export type NavbarItem = {
	title: string;
	href: string;
	description?: string;
};

export const mainNavbar: NavbarItem[] = [
	{ title: 'Home', href: '/', description: 'Go home...' },
	{ title: 'Library', href: '/library', description: 'Go to the library...' },
	{ title: 'Options', href: '/options', description: 'Go to the options...' },
];
