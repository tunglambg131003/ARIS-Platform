'use client';

import { useState, useEffect } from 'react';
import { SceneContext } from '@/context/SceneProvider';
import { Flex } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { CurrentSelectedModelProvider } from '@/context/CurrentSelectedModelProvider';

import SceneFiber from './scene/SceneObject';
import AnimationsModal from './controls/AnimationsModal';
import AssetsSidebar from './controls/AssetsSidebar';
import FilePanel from './controls/FilePanel';

const CanvasObjectFiber = ({ filename, user, projectName }) => {
	const [scene, setScene] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [enableAnimations, setEnableAnimations] = useState(true);
	const [fileURL, setFileURL] = useState(null);

	useEffect(() => {
		async function fetchFile() {
			const res = await fetch(`/api/projects/get-project-file`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					activeUser: user,
					projectName: projectName,
				}),
			});
			const data = await res.json();
			console.log(data);
			setFileURL(data.file);
		}
		fetchFile();
	}, [user, projectName]);

	return (
		<SceneContext.Provider value={{ scene, setScene }}>
			<CurrentSelectedModelProvider>
				<FilePanel
					setModalOpen={setIsModalOpen}
					filename={filename}
					user={user}
					projectName={projectName}
				/>
				<AssetsSidebar />
				<Flex
					h="100vh"
					w="100vw"
					alignItems={'center'}
					justifyContent={'center'}
					bgColor={'#171923'}
				>
					<Canvas>
						<SceneFiber enableAnimations={enableAnimations} fileURL={fileURL} />
					</Canvas>
				</Flex>
				<AnimationsModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					enableAnimations={enableAnimations}
					setEnableAnimations={setEnableAnimations}
				/>
			</CurrentSelectedModelProvider>
		</SceneContext.Provider>
	);
};

export default CanvasObjectFiber;
