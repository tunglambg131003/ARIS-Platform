'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Flex, CircularProgress } from '@chakra-ui/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { loadGLTFModel } from './loader';

function easeOutCircular(x) {
	return -Math.sqrt(1 - Math.pow(x - 1, 4));
}

const ModelWrapper = ({ autoRotate, fileURL }) => {
	const [loading, setLoading] = useState(false);
	const refContainer = useRef(null);
	const refRenderer = useRef(null);
	let camera;

	useEffect(() => {
		const { current: container } = refContainer;
		if (container) {
			const sceneWidth = container.clientWidth;
			const sceneHeight = container.clientHeight;
			// setSceneWidth(container.clientWidth);
			// setSceneHeight(container.clientHeight);

			console.log(sceneWidth, sceneHeight);
			const renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true,
			});

			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(sceneWidth, sceneHeight);
			// this is supposed to be deprecated, but the model just doesnt work without it?
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			refRenderer.current = renderer;
			const canvas = renderer.domElement;
			container.appendChild(canvas);

			const scene = new THREE.Scene();
			const target = new THREE.Vector3(-0.5, 1.2, 0);
			const initialPosition = new THREE.Vector3(
				20 * Math.sin(Math.PI * 0.2),
				-20,
				20 * Math.cos(Math.PI * 0.2)
			);
			const scalingFactor = 0.011;
			const scaleH = sceneHeight * scalingFactor;
			const scaleW = sceneWidth * scalingFactor;
			camera = new THREE.OrthographicCamera(
				-scaleW, // left
				scaleW, // right
				scaleH, // top
				-scaleH, // bottom
				0.1, // near plane
				50000 // far plane
			);
			// console.log(canvas.clientWidth, canvas.clientHeight);
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.position.copy(initialPosition);
			camera.lookAt(target);
			camera.updateProjectionMatrix();

			const ambientLight = new THREE.AmbientLight(0xfffffff, 1);
			scene.add(ambientLight);

			const controls = new OrbitControls(camera, canvas);

			controls.autoRotateSpeed = -2;
			controls.autoRotate = autoRotate;
			controls.target = target;
			setLoading(true);
			loadGLTFModel(scene, fileURL, {
				receiveShadow: false,
				castShadow: false,
			}).then(() => {
				animate();
				setLoading(false);
			});

			let req = null;

			let frame = 0;

			const animate = () => {
				req = requestAnimationFrame(animate);

				frame = frame <= 100 ? frame + 1 : frame;

				if (frame <= 100) {
					const p = initialPosition;

					const rotSpeed = autoRotate
						? -easeOutCircular(frame / 144) * Math.PI
						: 0;

					camera.position.y = 10;
					camera.position.x = -(
						p.x * Math.cos(rotSpeed) +
						p.z * Math.sin(rotSpeed)
					);
					camera.position.z = -(
						p.z * Math.cos(rotSpeed) -
						p.x * Math.sin(rotSpeed)
					);
					camera.lookAt(target);
				} else {
					controls.update();
				}

				renderer.render(scene, camera);
			};

			return () => {
				cancelAnimationFrame(req);
				canvas.remove();
				renderer.dispose();
			};
		}
	}, [autoRotate]);

	const handleResize = useCallback(() => {
		const { current: renderer } = refRenderer;
		const container = refContainer.current;
		console.log('resizing!');
		if (container && renderer) {
			const sceneWidth = container.clientWidth;
			const sceneHeight = container.clientHeight;
			// console.log(sceneWidth, sceneHeight);
			renderer.setSize(sceneWidth, sceneHeight);

			const scalingFactor = 0.011;
			const scaleH = sceneHeight * scalingFactor;
			const scaleW = sceneWidth * scalingFactor;
			camera.left = -scaleW;
			camera.right = scaleW;
			camera.top = scaleH;
			camera.bottom = -scaleH;
			camera.updateProjectionMatrix();
		}
	}, [camera]);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	return (
		<Flex
			ref={refContainer}
			width="100%"
			height="100%"
			// flexGrow={1}
			// flexShrink={1}
			// border={'1px solid red'}
			pos="relative"
		>
			{loading && (
				<CircularProgress
					isIndeterminate
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
				/>
			)}
		</Flex>
	);
};

export default ModelWrapper;
