'use client';

import React from 'react';
import CanvasObjectFiber from '@/editor/EditorCore';
import { useParams } from 'next/navigation';

const ProjectEditingPage = () => {
	const { user, project_name } = useParams();
	const filename = user + '_' + project_name;
	return (
		<CanvasObjectFiber
			filename={filename}
			user={user}
			projectName={project_name}
		/>
	);
};

export default ProjectEditingPage;
