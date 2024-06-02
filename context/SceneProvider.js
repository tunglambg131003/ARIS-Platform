import { createContext, useState } from 'react';

const SceneContext = createContext();

const SceneContextProvider = ({ children }) => {
	const [scene, setScene] = useState(null);

	return (
		<SceneContext.Provider value={{ scene, setScene }}>
			{children}
		</SceneContext.Provider>
	);
};

export { SceneContext, SceneContextProvider };
