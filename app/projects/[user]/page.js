'use client';

import React from 'react';
import ProjectsListing from '@/src/page-layouts/ProjectsListingPage';
import { useParams, redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

const UserProjects = () => {
	const session = useSession();
	if (session.status != 'authenticated') {
		redirect('/login');
	}
	const { user } = useParams();
	return <ProjectsListing user={user} />;
};

export default UserProjects;
