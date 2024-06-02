import React, { createContext, useContext, useState } from 'react';

const UploadModelContext = createContext();

export const UploadModelProvider = ({ children }) => {
    const [uploadActivities, setUploadActivities] = useState([]);

    const saveUploadActivity = (activity) => {
        setUploadActivities([...uploadActivities, activity]);
    };

    return (
        <UploadModelContext.Provider value={{ uploadActivities, saveUploadActivity }}>
            {children}
        </UploadModelContext.Provider>
    );
};

export const useUploadModel = () => {
    return useContext(UploadModelContext);
};
