// import HomePageTest from '@/src/page-layouts/home-page/HomePage';
import TestHome from '@/src/page-layouts/home-page/TestHome';
import HomePageTest from '@/src/page-layouts/home-page/HomePage';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const test = async () => {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/login');
	}
	return <HomePageTest />;
};

export default test;
