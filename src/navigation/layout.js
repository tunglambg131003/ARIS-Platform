import MainNavigation from '../page-layouts/MainNavigation';

function Layout(props) {
	return (
		<>
			<MainNavigation />
			<main>{props.children}</main>
		</>
	);
}

export default Layout;
