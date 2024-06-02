//app/auth/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AuthForm from '@/src/page-layouts/AuthForm';

export default async function AuthPage() {
	const session = await getServerSession(authOptions);
	// const router = useRouter();

	if (session) {
		redirect('/home');
	}
 
	return <AuthForm />;
}
