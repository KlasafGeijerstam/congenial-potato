import React from 'react';
import GamepadsView from './components/GamepadsView';
import ServosView from './components/ServosView';
import { GamepadsProvider } from './providers/GamepadsProvider';
import { ServosProvider } from './providers/ServosProvider';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App: React.FC = () => (
  <ServosProvider>
    <GamepadsProvider>
      <GamepadsView />
    </GamepadsProvider>
    <ServosView />
  </ServosProvider>
);

export default App;
