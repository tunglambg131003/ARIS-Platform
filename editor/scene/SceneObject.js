'use client';

import { useContext, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';
import MeshObject from '../model/MeshObject';
import { useModelStateStore } from '../store/useStore';
import { SceneContext } from '@/context/SceneProvider';
import { useCurrentSelectedModel } from '@/context/CurrentSelectedModelProvider';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const SceneFiber = ({ enableAnimations, fileURL }) => {
	// to handle selected objects
	const { scene } = useThree();
	const { setScene } = useContext(SceneContext);
	const { globallySelectedModel } = useCurrentSelectedModel();

	useEffect(() => {
		setScene(scene);
	}, [scene, setScene]);

	const { models, addModel } = useModelStateStore();

	useEffect(() => {
		const loader = new GLTFLoader();
		if (!fileURL) return;
		loader.load(fileURL, (gltf) => {
			gltf.scene.children.forEach((child) => {
				addModel(child, child.name, child.uuid);
			});
		});
		console.log('preloading complete.');
	}, [addModel, fileURL]);
	// since active prop should not be exposed to the user, we hide it completely
	// we need to export the set function to be able to update the global state (for leva only)
	const [{ editing, mode }, set] = useControls(() => ({
		editing: {
			value: true,
		},
		mode: {
			options: { translate: 'translate', rotate: 'rotate', scale: 'scale' },
			render: (get) => get('editing'),
		},
		active: {
			value: globallySelectedModel ? globallySelectedModel : 'none',
			render: () => false,
		},
	}));

	// const [editing, setEditing] = useState(false);

	return (
		<>
			<ambientLight intensity={1} />
			<gridHelper args={[50, 50, '#2e2f30', '#828399']} position={[0, 0, 0]} />
			<axesHelper args={[2]} />
			<OrbitControls makeDefault />
			{Object.entries(models).map(([uuid, model]) => {
				// console.log(model);
				return (
					<MeshObject
						key={uuid}
						fileUUID={uuid}
						fileName={model.name}
						mesh={model.mesh}
						editing={editing}
						mode={mode}
						globalEnableAnimations={enableAnimations}
						setLevaGlobalModel={set}
					/>
				);
			})}
		</>
	);
};

export default SceneFiber;
