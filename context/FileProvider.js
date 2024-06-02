//context/FileProvider.js

import { createContext, useState } from 'react';

export const FileContext = createContext();

export const FileContextProvider = ({ children }) => {
  const [fileData, setFileData] = useState(null);

  return (
    <FileContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileContext.Provider>
  );
};
