// legacy, TODO: remove

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import AuthForm from './AuthForm';

function AuthPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getSession().then((session) => {
			if (session) {
				// If session exists, navigate to the 'homepagetest' page
			} else {
				setIsLoading(false);
			}
		});
	}, [router]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return <AuthForm />;
}

export default AuthPage;
