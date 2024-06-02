// app/upload/page.js
import UploadPage from '@/src/page-layouts/UploadPage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function App() {
	const session = await getServerSession(authOptions);
	if (!session) {
		console.log('Session not found at page: upload');
		redirect('/auth');
	}
	return <UploadPage />;
}
