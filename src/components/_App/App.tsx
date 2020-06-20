import React from 'react';

import { ApiDataContextProvider, UserSelectionContextProvider } from './context';


export const App: React.FC = () => {
  return (
    <ApiDataContextProvider value={{deleteMe: 'Just a random prop...'}}>
      <UserSelectionContextProvider
        value={{deleteMe: 'Another random prop...'}}
      >
        <div>App</div>
      </UserSelectionContextProvider>
    </ApiDataContextProvider>
  )
}
