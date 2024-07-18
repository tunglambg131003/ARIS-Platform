'use client';

import { useContext } from 'react';
import {
	clearLocal,
	useModelStateStore,
	initializeFromLocal,
} from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { SceneContext } from '@/context/SceneProvider';
import { useRouter } from 'next/navigation';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import Toolbar from '@/src/navigation/Toolbar';
import { useToast } from '@chakra-ui/react';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const FilePanel = ({ setModalOpen, filename, user, projectName }) => {
	const { scene } = useContext(SceneContext);
	const router = useRouter();
	const exporter = new GLTFExporter();
	const toast = useToast();

	const filterMeshesFromScene = (originalScene) => {
		const newScene = new THREE.Scene();

		originalScene.traverse((child) => {
			if (child.userData.isExportable) {
				// uses SkeletonUtils to clone the mesh and its children, because SkeletonUtils is a much more robust cloning utility
				// and it auto assigns bone-skinned mesh objects
				// docs: https://threejs.org/docs/#examples/en/exporters/GLTFExporter

				const clonedMesh = SkeletonUtils.clone(child); // Deep clone
				// console.log('descendants:', child.children);
				// // Reset the matrix transformation to apply world position, rotation, scale
				clonedMesh.applyMatrix4(child.matrixWorld);

				// If the mesh is a direct child of the original scene, add it to newScene
				// Otherwise, recreate the hierarchy
				if (child.parent === originalScene) {
					newScene.add(clonedMesh);
				} else {
					// Recreate the parent group structure if necessary
					let parentClone = newScene.getObjectByName(child.parent.name);
					if (!parentClone) {
						parentClone = new THREE.Group();
						parentClone.name = child.parent.name;
						newScene.add(parentClone);
					}
					parentClone.add(clonedMesh);
				}
				console.log(child);
			}
		});

		return { newScene };
	};

	const download = (blob, filename) => {
		const glblink = document.createElement('a');
		glblink.style.display = 'none';
		glblink.href = URL.createObjectURL(blob);
		glblink.download = filename;
		document.body.appendChild(glblink);
		glblink.click();
		document.body.removeChild(glblink);
	};

	const onExport = () => {
		if (scene) {
			// console.log(scene.children);
			const { newScene } = filterMeshesFromScene(scene);
			console.log('newScene:', newScene.children);
			const animations = [];
			scene.traverse((node) => {
				// console.log(node.animations);
				if (node.animations) {
					animations.push(...node.animations);
				}
			});
			console.log('animations: ', animations);
			exporter.parse(
				newScene,
				(gltf) => {
					console.log(gltf);
					const blob = new Blob([gltf], { type: 'model/gltf-binary' });
					uploadToServer(blob);

					// download only for debug purposes
					// download(blob, '3dscene.glb');
				},
				(err) => {
					console.error(err);
				},
				{
					binary: true,
					animations: animations,
				}
			);
		}
	};

	// Function to handle the upload
	const uploadToServer = async (blob) => {
		const formData = new FormData();
		formData.append('file', blob, '3dscene.glb');
		formData.append('filename', filename);

		try {
			const res = await fetch('/api/upload-model', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			console.log(data);
			router.push(`/render/${data.body.modelID}`);
		} catch (err) {
			console.error(err);
		}
	};

	const updateProjectFile = async (blob) => {
		const formData = new FormData();
		formData.append('file', blob, '3dscene.glb');
		formData.append('filename', filename);
		formData.append('user', user);
		formData.append('projectName', projectName);

		try {
			const res = await fetch('/api/projects/patch', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			console.log(data);
			if (res.ok) {
				toast({
					title: 'Project saved!',
					description: 'Your project has been saved successfully.',
					status: 'success',
					duration: 9000,
					isClosable: true,
				});
			} else {
				toast({
					title: 'Error saving project',
					description: 'There was an error saving your project.',
					status: 'error',
					duration: 9000,
					isClosable: true,
				});
			}
		} catch (err) {
			console.error(err);
			toast({
				title: 'Error saving project',
				description: 'There was an error saving your project.',
				status: 'error',
				duration: 9000,
				isClosable: true,
			});
		}
	};

	const onSave = () => {
		if (scene) {
			const { newScene } = filterMeshesFromScene(scene);
			const animations = [];
			scene.traverse((node) => {
				if (node.animations) {
					animations.push(...node.animations);
				}
			});
			console.log('animations: ', animations);
			exporter.parse(
				newScene,
				(gltf) => {
					console.log(gltf);
					const blob = new Blob([gltf], { type: 'model/gltf-binary' });
					updateProjectFile(blob);
				},
				(err) => {
					console.error(err);
				},
				{
					binary: true,
					animations: animations,
				}
			);
		}
	};

	const { addModel } = useModelStateStore();

	const handleUpload = (e) => {
		const uuid = uuidv4();
		const file = e.target.files[0];
		const fileURL = URL.createObjectURL(file);

		const loader = new GLTFLoader();
		if (!fileURL) return;
		loader.load(fileURL, (gltf) => {
			gltf.scene.children.forEach((child) => {
				addModel(child, child.name, child.uuid);
			});
		});
	};

	return (
		<>
			<Toolbar
				onSave={onSave}
				onLoadFromServer={initializeFromLocal}
				onAddModel={handleUpload}
				onClearLocal={clearLocal}
				onExport={onExport}
				setModalOpen={setModalOpen}
			/>
		</>
	);
};

export default FilePanel;
