import React from 'react';
import ProjectsListing from '@/src/page-layouts/ProjectsListingPage';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

const plisting = async () => {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/login');
	} else {
		redirect('/projects/' + session.user.username);
	}
};

export default plisting;
