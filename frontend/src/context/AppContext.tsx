import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  // Add your context properties here
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state] = useState({});

  return (
    <AppContext.Provider value={state as AppContextType}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
