import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import NewProjectPage from '@/src/page-layouts/NewProjectPage';

const page = async () => {
	const session = await getServerSession(authOptions);
	console.log(session);
	if (!session) {
		redirect('/login');
	}
	return <NewProjectPage />;
};

export default page;
