import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function loadGLTFModel(
	scene,
	glbPath,
	options = { receiveShadow: true, castShadow: true }
) {
	const { receiveShadow, castShadow } = options;
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(
			glbPath,
			(gltf) => {
				const object = gltf.scene;
				object.position.x = 0;
				object.position.y = -4;
				object.receiveShadow = receiveShadow;
				object.castShadow = castShadow;

				const s = new THREE.Box3()
					.setFromObject(gltf.scene)
					.getSize(new THREE.Vector3());
				const sizes = [s.x, s.y];
				const planeSize = Math.max(...sizes);
				const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
				const planeMat = new THREE.ShadowMaterial();
				planeMat.opacity = 0.25;
				let plane = new THREE.Mesh(planeGeo, planeMat);
				plane.position.y -= 4;
				plane.rotateX(-Math.PI / 2);
				plane.receiveShadow = false;

				scene.add(plane);
				scene.add(object);

				object.traverse((child) => {
					if (child.isMesh) {
						console.log('child mesh detected');
						child.castShadow = castShadow;
						child.receiveShadow = receiveShadow;
					}
				});

				resolve(object);
			},
			undefined,
			(error) => {
				reject(error);
				console.error(error);
			}
		);
	});
}
