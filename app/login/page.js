//app/auth/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LoginForm from '@/src/page-layouts/user/LoginForm';

export default async function AuthPage() {
	const session = await getServerSession(authOptions);
	// const router = useRouter();
	if (session) {
		redirect('/home');
	}

	return <LoginForm />;
}
