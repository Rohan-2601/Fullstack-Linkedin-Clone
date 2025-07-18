import React, { createContext } from 'react';

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "https://backend-linkedin-clone.onrender.com";
  const value = { serverUrl };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
