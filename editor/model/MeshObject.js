'use client';

import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { useControls, folder } from 'leva';
import { useModelStateStore } from '../store/useStore';
import { useCurrentSelectedModel } from '@/context/CurrentSelectedModelProvider';

const MeshObject = ({
	mesh,
	fileUUID,
	fileName,
	editing,
	mode,
	setLevaGlobalModel,
	globalEnableAnimations,
	...props
}) => {
	const [selectedObject, setSelectedObject] = useState(null);
	const { globallySelectedModel, setGloballySelectedModel } =
		useCurrentSelectedModel();
	const [perModelAnimationEnabled, setPerModelAnimationEnabled] =
		useState(true);
	const groupRef = useRef(null);
	const transformControlsRef = useRef(null);

	const modelAnimations = mesh.animations || [];

	const onSelect = (e) => {
		if (!editing) return;
		e.stopPropagation();
		setSelectedObject(groupRef.current);
		setGloballySelectedModel(fileUUID);
		setLevaGlobalModel({ active: fileUUID });
	};

	const onDeselect = () => {
		setSelectedObject(null);
		setGloballySelectedModel(null);
	};

	const { updateModel, models } = useModelStateStore();
	const [modelSettings, set] = useControls(() => ({
		[fileUUID]: folder({
			position: {
				x: 0,
				y: 0,
				z: 0,
				render: (get) => get('editing') && get('active') === fileUUID,
				onChange: (e) => {
					groupRef.current.position.set(e.x, e.y, e.z);
					updateModel(fileUUID, {
						...models[fileUUID],
						position: e,
					});
				},
			},
			rotateX: {
				value: 0,
				min: 0,
				max: 2 * Math.PI,
				render: (get) => get('editing') && get('active') === fileUUID,
				onChange: (e) => {
					groupRef.current.rotation.x = e;
					updateModel(fileUUID, {
						...models[fileUUID],
						rotation: { ...models[fileUUID].rotation, x: e },
					});
				},
			},
			rotateY: {
				value: 0,
				min: 0,
				max: 2 * Math.PI,
				render: (get) => get('editing') && get('active') === fileUUID,
				onChange: (e) => {
					groupRef.current.rotation.y = e;
					updateModel(fileUUID, {
						...models[fileUUID],
						rotation: { ...models[fileUUID].rotation, y: e },
					});
				},
			},
			rotateZ: {
				value: 0,
				min: 0,
				max: 2 * Math.PI,
				render: (get) => get('editing') && get('active') === fileUUID,
				onChange: (e) => {
					groupRef.current.rotation.z = e;
					updateModel(fileUUID, {
						...models[fileUUID],
						rotation: { ...models[fileUUID].rotation, z: e },
					});
				},
			},
			scale: {
				x: 1,
				y: 1,
				z: 1,
				render: (get) => get('editing') && get('active') === fileUUID,
				onChange: (e) => {
					groupRef.current.scale.set(e.x, e.y, e.z);
					updateModel(fileUUID, {
						...models[fileUUID],
						scale: e,
					});
				},
			},
			animations: {
				value: true,
				onChange: setPerModelAnimationEnabled,
				render: (get) =>
					get('editing') &&
					get('active') === fileUUID &&
					modelAnimations.length > 0,
			},
		}),
	}));

	const onTranslate = useCallback(() => {
		const newPosition = groupRef.current.position;
		set({ position: { x: newPosition.x, y: newPosition.y, z: newPosition.z } });
	}, [set]);

	const onRotate = useCallback(() => {
		const newRotation = groupRef.current.rotation;
		set({
			rotateX: newRotation.x,
			rotateY: newRotation.y,
			rotateZ: newRotation.z,
		});
	}, [set]);

	const onScale = useCallback(() => {
		const newScale = groupRef.current.scale;
		set({ scale: { x: newScale.x, y: newScale.y, z: newScale.z } });
	}, [set]);

	useEffect(() => {
		const controls = transformControlsRef.current;
		const onDragChange = (e) => {
			if (!e.value) {
				if (mode === 'translate') onTranslate();
				if (mode === 'rotate') onRotate();
				if (mode === 'scale') onScale();
			}
		};
		controls.addEventListener('dragging-changed', onDragChange);
		return () => controls.removeEventListener('dragging-changed', onDragChange);
	}, [onTranslate, onRotate, onScale, mode]);

	return (
		<TransformControls
			ref={transformControlsRef}
			object={selectedObject}
			mode={mode}
			enabled={
				!!selectedObject && editing && globallySelectedModel === fileUUID
			}
			showX={!!selectedObject && editing && globallySelectedModel === fileUUID}
			showY={!!selectedObject && editing && globallySelectedModel === fileUUID}
			showZ={!!selectedObject && editing && globallySelectedModel === fileUUID}
		>
			<mesh
				ref={groupRef}
				onClick={onSelect}
				onDoubleClick={onDeselect}
				userData={{ isExportable: true }}
				animations={
					perModelAnimationEnabled && globalEnableAnimations
						? modelAnimations
						: []
				}
				{...props}
			>
				<primitive object={mesh} />
			</mesh>
		</TransformControls>
	);
};

export default MeshObject;
