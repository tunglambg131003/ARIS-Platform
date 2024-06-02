import { createContext, useContext, useState } from 'react';

const CurrentSelectedModelContext = createContext({
	globallySelectedModel: null,
	setGloballySelectedModel: () => {},
});

const CurrentSelectedModelProvider = ({ children }) => {
	const [globallySelectedModel, setGloballySelectedModel] = useState(null);
	return (
		<CurrentSelectedModelContext.Provider
			value={{ globallySelectedModel, setGloballySelectedModel }}
		>
			{children}
		</CurrentSelectedModelContext.Provider>
	);
};

const useCurrentSelectedModel = () => {
	return useContext(CurrentSelectedModelContext);
};

export {
	CurrentSelectedModelContext,
	CurrentSelectedModelProvider,
	useCurrentSelectedModel,
};
