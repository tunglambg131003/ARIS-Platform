const dbRequest = indexedDB.open('ModelStore', 1);

dbRequest.onupgradeneeded = (event) => {
	const db = event.target.result;
	db.createObjectStore('models', { keyPath: 'uuid' });
};

const getModelDB = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('ModelStore', 1);
		request.onerror = (event) => reject(event.target.error);
		request.onsuccess = (event) => resolve(event.target.result);
	});
};

const addModelToDB = async (modelObject) => {
	const db = await getModelDB();
	const transaction = db.transaction(['models'], 'readwrite');
	const store = transaction.objectStore('models');
	store.add(modelObject);
};

const getModelFromDB = async (uuid) => {
	const db = await getModelDB();
	const transaction = db.transaction(['models'], 'readonly');
	const store = transaction.objectStore('models');
	return new Promise((resolve, reject) => {
		const request = store.get(uuid);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
};

const getAllModelsFromDB = async () => {
	const db = await getModelDB();
	const transaction = db.transaction(['models'], 'readonly');
	const store = transaction.objectStore('models');
	return new Promise((resolve, reject) => {
		const request = store.getAll();
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
};

const deleteModelFromDB = async (uuid) => {
	const db = await getModelDB();
	const transaction = db.transaction(['models'], 'readwrite');
	const store = transaction.objectStore('models');
	store.delete(uuid);
};

const updateModelInDB = async (uuid, modelUpdates) => {
	const db = await getModelDB();
	const transaction = db.transaction(['models'], 'readwrite');
	const store = transaction.objectStore('models');

	return new Promise((resolve, reject) => {
		const getRequest = store.get(uuid);
		getRequest.onsuccess = () => {
			const existingModel = getRequest.result;
			const updatedModel = { ...existingModel, ...modelUpdates };
			const putRequest = store.put(updatedModel);
			putRequest.onsuccess = () => resolve(putRequest.result);
			putRequest.onerror = () => reject(putRequest.error);
		};
		getRequest.onerror = () => reject(getRequest.error);
	});
};

export {
	getModelDB,
	addModelToDB,
	getModelFromDB,
	getAllModelsFromDB,
	deleteModelFromDB,
	updateModelInDB,
};
