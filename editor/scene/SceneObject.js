'use client';

import { useContext, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useControls, folder } from 'leva';
import MeshObject from '../model/MeshObject';
import { useModelStateStore } from '../store/useStore';
import { SceneContext } from '@/context/SceneProvider';
import { useCurrentSelectedModel } from '@/context/CurrentSelectedModelProvider';

const SceneFiber = ({ enableAnimations }) => {
	// to handle selected objects
	const { scene } = useThree();
	const { setScene } = useContext(SceneContext);
	const { globallySelectedModel } = useCurrentSelectedModel();

	useEffect(() => {
		setScene(scene);
	}, [scene, setScene]);

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
	const { models } = useModelStateStore();
	// const [editing, setEditing] = useState(false);

	return (
		<>
			<ambientLight intensity={1} />
			<gridHelper args={[50, 50, '#2e2f30', '#828399']} position={[0, 0, 0]} />
			<axesHelper args={[2]} />
			<OrbitControls makeDefault />
			{Object.entries(models).map(([uuid, model]) => {
				return (
					<MeshObject
						key={uuid}
						fileUUID={uuid}
						fileName={model.name}
						fileURL={model.fileURL}
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
