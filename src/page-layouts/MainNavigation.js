//src/page-layouts/MainNavigations.js
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import classes from '../../styles/main-navigation.module.css';

function MainNavigation() {
	const { session, loading } = useSession();
	const router = useRouter();

	function logoutHandler() {
		signOut();
	}

	/* function handleLoginSuccess() {
    router.push('../../homepage/homepagetest');
  } */

	return (
		<header className={classes.header}>
			<Link href="/">Next Auth</Link>

			<nav>
				<ul>
					{!session && !loading && (
						<li>
							<Link href="/auth">Login</Link>
						</li>
					)}
					{session && (
						<li>
							<Link href="/profile">Profile</Link>
						</li>
					)}

					{session && (
						<li>
							<button onClick={logoutHandler}>Logout</button>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
}

export default MainNavigation;
