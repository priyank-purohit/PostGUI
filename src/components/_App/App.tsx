import React from 'react';

import { Navigation } from '../top-navigation';
import { ApiDataContextProvider, UserSelectionContextProvider } from './context';


export const App: React.FC = () => {
  return (
    <ApiDataContextProvider value={{deleteMe: 'Just a random prop...'}}>
      <UserSelectionContextProvider
        value={{deleteMe: 'Another random prop...'}}
      >
        <Navigation databaseDisplayName='Database Name' />
      </UserSelectionContextProvider>
    </ApiDataContextProvider>
  )
}
