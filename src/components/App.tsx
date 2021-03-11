import React, { useState } from 'react';

import { useToggleState } from 'hooks/use-toggle-state';

import { ApiDataContextProvider, UserSelectionContextProvider } from './context';
import { TopNavigation } from './top-navigation';


export const App: React.FC = () => {
  const [leftPanelVisibility, toggleLeftPanelVisibility] = useToggleState(false)

  return (
    <ApiDataContextProvider value={{deleteMe: 'Just a random prop...'}}>
      <UserSelectionContextProvider
        value={{deleteMe: 'Another random prop...'}}
      >
        <TopNavigation
          databaseDisplayName='Database Name'
          toggleLeftPanelVisibility={toggleLeftPanelVisibility}
        />
      </UserSelectionContextProvider>
    </ApiDataContextProvider>
  )
}
