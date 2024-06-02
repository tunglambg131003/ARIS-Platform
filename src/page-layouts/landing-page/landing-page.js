import classes from '../../../styles/landing-pages.module.css';
import Layout from '../../navigation/layout';

function StartingPage() {
	// Show Link to Login page if NOT auth

	return (
		<Layout>
			<section className={classes.starting}>
				<h1>Welcome</h1>
			</section>
		</Layout>
	);
}
export default StartingPage;
