'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ProjectDashboard from '@/src/page-layouts/ProjectDashboard';
import { useParams } from 'next/navigation';

const IndivProjectPage = () => {
	const session = useSession();
	if (session.status != 'authenticated') {
		redirect('/login');
	}
	const { user, project_name } = useParams();

	return <ProjectDashboard user={user} projectName={project_name} />;
};

export default IndivProjectPage;
