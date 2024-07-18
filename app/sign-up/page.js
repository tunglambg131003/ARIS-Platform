//app/auth/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignUpForm from '@/src/page-layouts/user/SignUpForm';

export default async function AuthPage() {
	const session = await getServerSession(authOptions);
	// const router = useRouter();
	if (session) {
		redirect('/home');
	}

	return <SignUpForm />;
}
