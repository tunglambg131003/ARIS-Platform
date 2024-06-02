// store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getAllModelsFromDB, updateModelInDB, getModelDB } from './localdb';

const useModelStateStore = create(
	immer((set) => ({
		models: {
			// '5e96dbba-dc55-4460-9ff5-c694825f7944': {
			// 	uuid: '5e96dbba-dc55-4460-9ff5-c694825f7944',
			// 	fileURL: '/RobotExpressive.glb',
			// 	name: 'robot',
			// 	position: {
			// 		x: 0,
			// 		y: 0,
			// 		z: 0,
			// 	},
			// 	rotation: {
			// 		x: 0,
			// 		y: 0,
			// 		z: 0,
			// 	},
			// 	scale: {
			// 		x: 1,
			// 		y: 1,
			// 		z: 1,
			// 	},
			// },
			// '5e96dcba-dc55-4460-9ff5-d694825f3445': {
			// 	uuid: '5e96dcba-dc55-4460-9ff5-d694825f3445',
			// 	fileURL: '/chicken.glb',
			// 	name: 'chicken',
			// 	position: {
			// 		x: 0,
			// 		y: 0,
			// 		z: 0,
			// 	},
			// 	rotation: {
			// 		x: 0,
			// 		y: 0,
			// 		z: 0,
			// 	},
			// 	scale: {
			// 		x: 1,
			// 		y: 1,
			// 		z: 1,
			// 	},
			// },
		},
		addModel: (fileURL, fileName, uuid) => {
			set((state) => {
				state.models[uuid] = {
					uuid: uuid,
					fileURL: fileURL,
					name: fileName,
					position: {
						x: 0,
						y: 0,
						z: 0,
					},
					rotation: {
						x: 0,
						y: 0,
						z: 0,
					},
					scale: {
						x: 1,
						y: 1,
						z: 1,
					},
				};
			});
		},
		updateModel: (uuid, updates) => {
			set((state) => {
				// console.log('updates from the store call: ', updates);
				Object.assign(state.models[uuid], updates);
			});
		},
		removeModel: (uuid) => {
			set((state) => {
				delete state.models[uuid];
			});
		},
	}))
);

// Utility functions for local storage / IndexedDB\
// legacy code here
// const saveToLocalStorage = (key, value) => {
// 	localStorage.setItem(key, JSON.stringify(value));
// };

// const getFromLocalStorage = (key) => {
// 	const value = localStorage.getItem(key);
// 	return value ? JSON.parse(value) : null;
// };

// Initialize from local storage
const initializeFromLocal = async () => {
	console.log('initializing from IndexedDB...');
	const persistedModels = await getAllModelsFromDB();
	console.log(persistedModels);
	persistedModels.forEach((model) => {
		if (model.file) {
			const fileURL = URL.createObjectURL(model.file);
			useModelStateStore.setState((state) => {
				state.models[model.uuid] = {
					...model,
					fileURL: fileURL,
				};
			});
		} else {
			console.log('no file found for model: ', model);
		}

		console.log(model);
	});
	console.log('done initializing from IndexedDB');
};

// Subscribe to changes and update local storage
// legacy save to local
// const saveToLocal = () => {
// 	saveToLocalStorage('models', useModelStateStore.getState().models);
// 	console.log('saved to local storage!');
// };

const saveToLocal = async () => {
	const models = useModelStateStore.getState().models;

	for (const uuid in models) {
		if (models.hasOwnProperty(uuid)) {
			const model = models[uuid];
			await updateModelInDB(uuid, model);
		}
		// console.log(uuid);
	}

	console.log('saved to IndexedDB!');
};

const clearLocal = async () => {
	const db = await getModelDB();
	const transaction = db.transaction(['models'], 'readwrite');
	const store = transaction.objectStore('models');
	return new Promise((resolve, reject) => {
		const request = store.clear();
		request.onsuccess = () => {
			console.log('cleared IndexedDB store!');
			resolve(request.result);
		};
		request.onerror = () => {
			console.error('error clearing IndexedDB store:', request.error);
			reject(request.error);
		};
	});
};

// useModelStateStore.subscribe((state) =>{})

export { useModelStateStore, saveToLocal, initializeFromLocal, clearLocal };
